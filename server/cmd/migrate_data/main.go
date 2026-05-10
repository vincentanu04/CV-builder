// Command migrate_data converts all existing resumes from the legacy v1 ordered-JSON
// format to the v2 flexible-sections format introduced in migration 002.
//
// Usage (run from the server/ directory after deploying the new binary):
//
//	go run ./cmd/migrate_data/main.go
//
// The command connects using the DB_URL environment variable (same as the web
// server).  It is safe to re-run: resumes already at template_version=2 are
// skipped.  Run in a transaction so a partial failure leaves the database
// unchanged.
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"server/configs"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// ---------------------------------------------------------------------------
// V1 structures (legacy ordered JSON)
// ---------------------------------------------------------------------------

// v1OrderedEntry is one element of the array produced by the frontend's
// toOrderedJSON helper: [{"key":"profile","value":{...}}, ...]
type v1OrderedEntry struct {
	Key   string      `json:"key"`
	Value interface{} `json:"value"`
}

// ---------------------------------------------------------------------------
// V2 structures (flexible sections)
// ---------------------------------------------------------------------------

type v2Section struct {
	ID         string      `json:"id"`
	Name       string      `json:"name"`
	SectionKey string      `json:"sectionKey"`
	Position   int         `json:"position"`
	IsVisible  bool        `json:"isVisible"`
	Data       interface{} `json:"data"`
}

type v2FormData struct {
	SchemaVersion int         `json:"schemaVersion"`
	Sections      []v2Section `json:"sections"`
}

// sectionMeta maps each legacy key to the display name shown in the form nav.
var sectionMeta = []struct {
	key  string
	name string
}{
	{"profile", "Profile"},
	{"education", "Education"},
	{"experience", "Experience"},
	{"projects", "Projects"},
	{"awards", "Awards"},
	{"additional", "Additional experience"},
	{"skills", "Skills"},
	{"remarks", "Remarks"},
}

func convertV1ToV2(rawData string) (string, error) {
	// Parse the ordered JSON array.
	var entries []v1OrderedEntry
	if err := json.Unmarshal([]byte(rawData), &entries); err != nil {
		return "", fmt.Errorf("cannot parse v1 data as ordered JSON array: %w", err)
	}

	// Build a lookup map from the parsed array so we can access each section
	// by key without worrying about ordering.
	sectionDataByKey := make(map[string]interface{}, len(entries))
	for _, e := range entries {
		sectionDataByKey[e.Key] = e.Value
	}

	sections := make([]v2Section, 0, len(sectionMeta))
	for i, meta := range sectionMeta {
		data, ok := sectionDataByKey[meta.key]
		if !ok {
			// Section was not present in the legacy data; skip it.
			continue
		}
		sections = append(sections, v2Section{
			ID:         "s_" + meta.key,
			Name:       meta.name,
			SectionKey: meta.key,
			Position:   i,
			IsVisible:  true,
			Data:       data,
		})
	}

	v2 := v2FormData{
		SchemaVersion: 2,
		Sections:      sections,
	}

	out, err := json.Marshal(v2)
	if err != nil {
		return "", fmt.Errorf("cannot marshal v2 data: %w", err)
	}
	return string(out), nil
}

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	dbURL := configs.Envs.DBUrl
	if dbURL == "" {
		log.Fatal("DB_URL environment variable is not set")
	}

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatalf("cannot open database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("cannot reach database: %v", err)
	}

	// Count rows that need migration.
	var total int
	if err := db.QueryRow(`SELECT COUNT(*) FROM resumes WHERE template_version = 1`).Scan(&total); err != nil {
		log.Fatalf("cannot count resumes: %v", err)
	}

	if total == 0 {
		log.Println("No resumes need migration — all are already at template_version=2.")
		os.Exit(0)
	}

	log.Printf("Found %d resume(s) to migrate from v1 to v2 ...", total)

	// Fetch all v1 resumes.
	rows, err := db.Query(`SELECT id, data FROM resumes WHERE template_version = 1 ORDER BY id`)
	if err != nil {
		log.Fatalf("cannot query resumes: %v", err)
	}

	type row struct {
		id   int
		data string
	}
	var toMigrate []row
	for rows.Next() {
		var r row
		if err := rows.Scan(&r.id, &r.data); err != nil {
			rows.Close()
			log.Fatalf("cannot scan resume row: %v", err)
		}
		toMigrate = append(toMigrate, r)
	}
	rows.Close()
	if err := rows.Err(); err != nil {
		log.Fatalf("row iteration error: %v", err)
	}

	// Run the whole migration inside a single transaction so that a partial
	// failure leaves the database in its original state.
	tx, err := db.Begin()
	if err != nil {
		log.Fatalf("cannot start transaction: %v", err)
	}
	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback()
			panic(p)
		}
	}()

	stmt, err := tx.Prepare(`UPDATE resumes SET data = $1, template_version = 2 WHERE id = $2`)
	if err != nil {
		_ = tx.Rollback()
		log.Fatalf("cannot prepare update statement: %v", err)
	}
	defer stmt.Close()

	succeeded := 0
	for _, r := range toMigrate {
		v2Data, err := convertV1ToV2(r.data)
		if err != nil {
			_ = tx.Rollback()
			log.Fatalf("resume id=%d: conversion error: %v", r.id, err)
		}

		if _, err := stmt.Exec(v2Data, r.id); err != nil {
			_ = tx.Rollback()
			log.Fatalf("resume id=%d: update error: %v", r.id, err)
		}

		log.Printf("  migrated resume id=%d", r.id)
		succeeded++
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("cannot commit transaction: %v", err)
	}

	log.Printf("Migration complete: %d/%d resume(s) converted to v2.", succeeded, total)
}

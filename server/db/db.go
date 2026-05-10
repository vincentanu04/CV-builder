// Package db is superseded by the new architecture.
// DB connections are now opened directly in main.go using lib/pq.
// This file is kept for backwards compatibility.
package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func NewPostgresStorage(connString string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connString)
	if err != nil {
		log.Fatal(err)
	}
	return db, nil
}

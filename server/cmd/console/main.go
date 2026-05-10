// Console is a script runner for production maintenance tasks.
//
// Usage:
//
//	go run ./cmd/console <script> [args...]
//	make console script=<script> [args=<args>]
package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"sort"

	"cvbuilder/internal/deps"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Script is a runnable console command that receives the shared deps and any
// extra CLI arguments that follow the script name.
type Script func(d deps.Deps, args []string) error

// registry maps script names to their implementations.
// To add a new script: create a <name>.go file in this package, implement the
// function, then register it here.
var registry = map[string]Script{
	"seed":       runSeed,
	"list_users": runListUsers,
	"set_plan":   runSetPlan,
}

func main() {
	if err := godotenv.Load("../.env.local"); err != nil {
		log.Println("no .env.local found — reading from environment")
	}

	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	name := os.Args[1]
	script, ok := registry[name]
	if !ok {
		fmt.Fprintf(os.Stderr, "unknown script: %q\n\n", name)
		printUsage()
		os.Exit(1)
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("ping db: %v", err)
	}

	d := deps.Deps{DB: db}

	if err := script(d, os.Args[2:]); err != nil {
		log.Fatalf("script %q: %v", name, err)
	}
	log.Printf("script %q completed successfully", name)
}

func printUsage() {
	names := make([]string, 0, len(registry))
	for name := range registry {
		names = append(names, name)
	}
	sort.Strings(names)

	fmt.Fprintln(os.Stdout, "Usage: go run ./cmd/console <script> [args...]")
	fmt.Fprintln(os.Stdout, "       make console script=<script> [args=<args>]")
	fmt.Fprintln(os.Stdout, "")
	fmt.Fprintln(os.Stdout, "Available scripts:")
	for _, name := range names {
		fmt.Fprintf(os.Stdout, "  %s\n", name)
	}
}

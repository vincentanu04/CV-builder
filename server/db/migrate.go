package db

import (
	"log"
	"server/configs"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/mattes/migrate/source/file"
)

func RunMigration(action string) {
	migrationsPath := "file://db/migrations"

	dbURL := configs.Envs.DBUrl

	m, err := migrate.New(
		migrationsPath,
		dbURL,
	)
	if err != nil {
		log.Fatalf("failed to create migrate instance: %v", err)
	}

	oldVersion, dirty, err := m.Version()
	if err != nil && err != migrate.ErrNilVersion {
		log.Fatalf("failed to get current migration version: %v", err)
	}
	log.Printf("Current migration version: %d (Dirty: %t)", oldVersion, dirty)

	switch action {
	case "up":
		if err := m.Steps(1); err != nil && err.Error() != "no change" {
			log.Fatalf("migration up failed: %s", err.Error())
		} else {
			log.Println("Migrations applied successfully.")
		}
	case "down":
		if err := m.Steps(-1); err != nil && err.Error() != "no change" {
			log.Printf("migration down failed: %s", err.Error())
		} else {
			log.Println("Migrations rolled back successfully.")
		}
	case "undirty":
		if !dirty {
			log.Println("Migration is already clean, no action needed.")
			return
		}
		// Force the migration to mark it as clean by setting the version.
		if err := m.Force(int(oldVersion)); err != nil {
			log.Printf("migration undirty failed: %s", err.Error())
		} else {
			log.Println("Migrations undirtied successfully.")
		}
	default:
		log.Fatalf("invalid migration action: %s. Use 'up' or 'down'.", action)
	}

	newVersion, dirty, err := m.Version()
	if err != nil && err != migrate.ErrNilVersion {
		log.Fatalf("failed to get new migration version: %v", err)
	}

	log.Printf("Migration completed. New version: %d (Dirty: %t)", newVersion, dirty)
}

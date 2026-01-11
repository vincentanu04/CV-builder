package api

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/signal"
	"server/configs"
	"server/db"
	"server/jobs"
	"syscall"
)

func Run() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	db, err := db.NewPostgresStorage(configs.Envs.DBUrl)
	if err != nil {
		log.Fatal(err)
	}

	initDB(db)

	jobs.KeepDBAlive(ctx, db)

	log.Printf("Running server on port %s ...", configs.Envs.Port)
	server := newAPIServer(fmt.Sprintf(":%s", configs.Envs.Port), db)
	if err := server.run(); err != nil {
		log.Fatal(err)
	}
}

func initDB(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("DB successfully connected!")
}

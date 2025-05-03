package api

import (
	"database/sql"
	"fmt"
	"log"
	"server/configs"
	"server/db"
)

func Run() {
	db, err := db.NewPostgresStorage(configs.Envs.DBUrl)
	if err != nil {
		log.Fatal(err)
	}

	initDB(db)

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

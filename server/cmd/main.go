package main

import (
	"database/sql"
	"fmt"
	"log"
	"server/cmd/api"
	"server/configs"
	"server/db"

	"github.com/go-sql-driver/mysql"
)

func main() {
	dbCfg := mysql.Config{
		User:                 configs.Envs.DBUser,
		Passwd:               configs.Envs.DBPasswd,
		Addr:                 configs.Envs.DBAddr,
		DBName:               configs.Envs.DBName,
		Net:                  "tcp",
		AllowNativePasswords: true,
		ParseTime:            true,
	}

	db, err := db.NewMySQLStorage(dbCfg)
	if err != nil {
		log.Fatal(err)
	}

	initDB(db)

	log.Printf("Running server on port %s ...", configs.Envs.Port)
	server := api.NewAPIServer(fmt.Sprintf(":%s", configs.Envs.Port), db)
	if err := server.Run(); err != nil {
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

package main

import (
	"database/sql"
	"fmt"
	"log"
	"server/cmd/api"
)

func main() {
	port := "8080"
	db := &sql.DB{}

	server := api.NewAPIServer(fmt.Sprintf(":%s", port), db)
	log.Printf("Running server on port %s", port)
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}
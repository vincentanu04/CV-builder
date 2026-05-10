package main

import (
	"fmt"
	"log"
	"os"
	"server/cmd/api"
	"server/db"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Println("Usage: go run main.go [webserver|migrate:up|migrate:down|migrate:data]")
		os.Exit(1)
	}

	action := os.Args[1]
	fmt.Println(action)
	switch action {
	case "webserver":
		api.Run()
	case "migrate:up":
		db.RunMigration("up")
	case "migrate:down":
		db.RunMigration("down")
	case "migrate:undirty":
		db.RunMigration("undirty")
	default:
		log.Fatalf("Available commands are [webserver|migrate:up|migrate:down|migrate:data]")
	}
}

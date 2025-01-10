package main

import (
	"log"
	"net/http"
	"server/router"
)

func main() {
	r := router.InitializeRouter()

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
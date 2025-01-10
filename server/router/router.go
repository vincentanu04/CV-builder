package router

import (
	"server/handlers"

	"github.com/gorilla/mux"
)

func InitializeRouter() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/login", handlers.LoginHandler).Methods("POST")

	return router 
}
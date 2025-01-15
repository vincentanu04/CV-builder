package api

import (
	"database/sql"
	"net/http"
	"server/services/health"
	"server/services/resume"
	"server/services/user"

	"github.com/gorilla/mux"
)

type APIServer struct {
	addr string
	db   *sql.DB
}

func NewAPIServer(addr string, db *sql.DB) *APIServer {
	return &APIServer{addr: addr, db: db}
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api").Subrouter()

	healthChecker := health.NewHandler()
	healthChecker.RegisterRoutes(subrouter)

	userStore := user.NewStore(s.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	resumeStore := resume.NewStore(s.db)
	resumeHandler := resume.NewHandler(resumeStore, userStore)
	resumeHandler.RegisterRoutes(subrouter)

	return http.ListenAndServe(s.addr, router)
}

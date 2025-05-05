package api

import (
	"database/sql"
	"net/http"
	"os"
	"server/services/health"
	"server/services/resume"
	"server/services/user"
	"server/utils"

	"github.com/gorilla/mux"
)

type APIServer struct {
	addr string
	db   *sql.DB
}

func newAPIServer(addr string, db *sql.DB) *APIServer {
	return &APIServer{addr: addr, db: db}
}

func (s *APIServer) run() error {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api").Subrouter()

	// handle preflight
	router.Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	healthChecker := health.NewHandler()
	healthChecker.RegisterRoutes(subrouter)

	userStore := user.NewStore(s.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	resumeStore := resume.NewStore(s.db)
	resumeHandler := resume.NewHandler(resumeStore, userStore)
	resumeHandler.RegisterRoutes(subrouter)

	router.Use(utils.Logger)
	router.Use(utils.CORS)
	router.Use(utils.RateLimit)

	// serve FE, only run in docker (prod) as dist only present in container
	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := "./web/dist" + r.URL.Path
		if _, err := os.Stat(path); os.IsNotExist(err) {
			http.ServeFile(w, r, "./web/dist/index.html")
			return
		}
		http.ServeFile(w, r, path)
	})

	return http.ListenAndServe(s.addr, router)
}

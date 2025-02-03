package utils

import (
	"log"
	"net/http"
)

var allowedOrigins = []string{
	"http://127.0.0.1:5173",
	"http://localhost:5173",
}

func CORS(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		isAllowed := false
		log.Printf("checking cors origin, %s", origin)
		for _, allowedOrigin := range allowedOrigins {
			if allowedOrigin == origin {
				isAllowed = true
				break
			}
		}

		if isAllowed {
			log.Println("allowed")
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

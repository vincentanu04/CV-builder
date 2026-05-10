package utils

import (
	"log"
	"net"
	"net/http"
	"os"
	"sync"
	"time"
)

var prdAllowedOrigins = []string{
	"https://cv-builder.fly.dev",
}

var devAllowedOrigins = []string{
	"http://127.0.0.1:5173",
	"http://localhost:5173",
}

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		isAllowed := false
		log.Printf("checking cors origin, %s", origin)

		allowedOrigins := []string{}
		switch os.Getenv("ENVIRONMENT") {
		case "dev":
			allowedOrigins = devAllowedOrigins
		case "prd":
			allowedOrigins = prdAllowedOrigins
		}

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

type client struct {
	Requests    int
	WindowStart time.Time
}

var (
	mu       sync.Mutex
	clients  = make(map[string]*client)
	rate     = 100         // max requests
	interval = time.Minute // time window
)

func RateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, _, _ := net.SplitHostPort(r.RemoteAddr)

		mu.Lock()
		c, exists := clients[ip]
		if !exists || time.Since(c.WindowStart) > interval {
			c = &client{Requests: 1, WindowStart: time.Now()}
			clients[ip] = c
		} else {
			c.Requests++
		}
		mu.Unlock()

		if c.Requests > rate {
			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("ENDPOINT: %s %s", r.Method, r.URL.Path)

		next.ServeHTTP(w, r)
	})
}

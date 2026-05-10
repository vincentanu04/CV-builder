package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/deps"
	"cvbuilder/internal/handler"
	"cvbuilder/internal/middleware"
)

func main() {
	if err := godotenv.Load("../.env.local"); err != nil {
		log.Println("No .env.local file found, reading env from environment")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	log.Println("database connected")

	d := deps.Deps{DB: db}
	h := handler.NewHandler(d)

	r := chi.NewRouter()
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(middleware.RateLimit)

	// API routes under /api prefix
	r.Route("/api", func(apiRouter chi.Router) {
		apiRouter.Use(middleware.Auth)
		oapi.HandlerFromMux(h, apiRouter)
	})

	// SPA fallback — serve built frontend from ./web/dist in production
	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		distPath := "./web/dist" + r.URL.Path
		if info, err := os.Stat(distPath); err == nil && !info.IsDir() {
			http.ServeFile(w, r, distPath)
			return
		}
		http.ServeFile(w, r, "./web/dist/index.html")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      r,
		BaseContext:  func(_ net.Listener) context.Context { return context.Background() },
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Printf("server listening on :%s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	<-ctx.Done()
	log.Println("shutting down server...")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown error: %v", err)
	}
}

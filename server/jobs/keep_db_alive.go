package jobs

import (
	"context"
	"database/sql"
	"log"
	"time"
)

// Keeps free-tier Postgres databases alive (e.g. Supabase)
// - Runs once at startup
// - Then once every 5 days
// - Stops cleanly on shutdown
func KeepDBAlive(ctx context.Context, db *sql.DB) {
	go func() {
		// 🔹 Run immediately on startup
		log.Println("[cron] DB keepalive ping (startup)")
		ctxPing, cancel := context.WithTimeout(ctx, 10*time.Second)
		if err := db.PingContext(ctxPing); err != nil {
			log.Printf("[cron] DB ping failed: %v\n", err)
		}
		cancel()

		// 🔹 Then run every 5 days
		ticker := time.NewTicker(5 * 24 * time.Hour)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				log.Println("[cron] DB keepalive ping")

				ctxPing, cancel := context.WithTimeout(ctx, 10*time.Second)
				if err := db.PingContext(ctxPing); err != nil {
					log.Printf("[cron] DB ping failed: %v\n", err)
				}
				cancel()

			case <-ctx.Done():
				log.Println("[cron] DB keepalive stopped")
				return
			}
		}
	}()
}

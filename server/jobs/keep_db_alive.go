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
	runQuery := func() {
		ctxQ, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()
		var one int
		if err := db.QueryRowContext(ctxQ, "SELECT 1").Scan(&one); err != nil {
			log.Printf("[cron] DB keepalive query failed: %v\n", err)
		}
	}

	go func() {
		// 🔹 Run immediately on startup
		log.Println("[cron] DB keepalive query (startup)")
		runQuery()

		// 🔹 Then run every 5 days
		ticker := time.NewTicker(5 * 24 * time.Hour)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				log.Println("[cron] DB keepalive query")
				runQuery()

			case <-ctx.Done():
				log.Println("[cron] DB keepalive stopped")
				return
			}
		}
	}()
}

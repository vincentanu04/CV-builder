package deps

import "database/sql"

// Deps is the shared dependency container passed through handler → app_service → repository/mutation.
// Add new dependencies here (Redis, S3 client, etc.) rather than passing them individually.
type Deps struct {
	DB *sql.DB
}

-include ../.env.local

DATABASE_URL ?= $(DB_URL)
GOOSE_DRIVER   := postgres
GOOSE_DBSTRING := $(DATABASE_URL)
GOOSE_MIGRATION_DIR := db/migrations
JET_DSN        := $(DATABASE_URL)
JET_SCHEMA     := public
JET_DB_NAME    := cvbuilder_db
JET_OUT_DIR    := generated/db

.PHONY: run run-once openapi-codegen migration-create migration-up migration-down migration-status jet-codegen console fmt test build

## Start server with air hot-reload
run:
	air

## Start server once (no hot-reload)
run-once:
	go run main.go

## Regenerate OpenAPI server + frontend RTK Query hooks
openapi-codegen:
	go tool oapi-codegen -config api/oapi-server.yml api/openapi.yml
	cd ../web && npm run codegen

## Create a new Goose migration: make migration-create name=<description>
migration-create:
	go tool goose -dir $(GOOSE_MIGRATION_DIR) create $(name) sql

## Apply all pending migrations and regenerate go-jet models
migration-up:
	go tool goose -dir $(GOOSE_MIGRATION_DIR) $(GOOSE_DRIVER) "$(GOOSE_DBSTRING)" up
	$(MAKE) jet-codegen

## Roll back last migration
migration-down:
	go tool goose -dir $(GOOSE_MIGRATION_DIR) $(GOOSE_DRIVER) "$(GOOSE_DBSTRING)" down

## Show migration status
migration-status:
	go tool goose -dir $(GOOSE_MIGRATION_DIR) $(GOOSE_DRIVER) "$(GOOSE_DBSTRING)" status

## Regenerate go-jet models from live database
jet-codegen:
	go tool jet -dsn="$(JET_DSN)" -schema=$(JET_SCHEMA) -dbname=$(JET_DB_NAME) -path=$(JET_OUT_DIR)

## Format all Go files
fmt:
	gofmt -w .

## Run tests
test:
	go test -v ./...

## Verify compilation
build:
	go build ./...

## Run a console script: make console script=<name> [args="<arg1> <arg2>"]
## Examples:
##   make console script=seed
##   make console script=seed args="ops@example.com s3cr3t"
##   make console script=list_users
##   make console script=set_plan args="user@example.com pro"
console:
	go run ./cmd/console $(script) $(args)
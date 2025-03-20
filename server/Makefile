run:
	@go run ./cmd/main.go webserver

test:
	@go test -v ./...

migrate-up:
	@go run ./cmd/main.go migrate:up

migrate-down:
	@go run ./cmd/main.go migrate:down

migrate-undirty:
	@go run ./cmd/main.go migrate:undirty
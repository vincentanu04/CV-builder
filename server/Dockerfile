ARG GO_VERSION=1
FROM golang:${GO_VERSION}-bookworm as builder

WORKDIR /usr/src/app
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . .
RUN go build -v -o /run-app ./cmd/main.go


FROM debian:bookworm

WORKDIR /app

COPY --from=builder /run-app /usr/local/bin/
COPY --from=builder /usr/src/app/db/migrations ./db/migrations

# run webserver command
ENTRYPOINT ["/usr/local/bin/run-app"]
CMD ["webserver"]

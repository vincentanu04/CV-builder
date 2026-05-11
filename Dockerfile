# syntax=docker/dockerfile:1

# ---------- Frontend build ----------
FROM node:18 AS frontend
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web ./

# Set the environment variable for Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---------- Backend build ----------
FROM golang:1.25 AS backend
WORKDIR /app/server
COPY server/go.mod server/go.sum .
RUN go mod download
COPY server .
COPY --from=frontend /app/web/dist ./web/dist
# TODO: copy migration files later to run migrations
# COPY --from=builder /run-app /usr/local/bin/
# COPY --from=builder /usr/src/app/db/migrations ./db/migrations

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# ---------- Final image ----------
FROM debian:bullseye-slim
WORKDIR /app
COPY --from=backend /app/server/main .
COPY --from=backend /app/server/web/dist ./web/dist

# (Optional) Set port exposed by your Go backend
EXPOSE 8080

CMD ["./main"]

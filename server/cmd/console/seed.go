package main

import (
	"context"
	"errors"
	"fmt"

	"cvbuilder/internal/app_service/auth"
	"cvbuilder/internal/deps"
)

// runSeed creates a test user in the database.
//
// Usage:
//
//	go run ./cmd/console seed
//	go run ./cmd/console seed user@example.com password123
func runSeed(d deps.Deps, args []string) error {
	ctx := context.Background()

	email := "admin@example.com"
	if len(args) > 0 {
		email = args[0]
	}

	password := "password123"
	if len(args) > 1 {
		password = args[1]
	}

	user, _, err := auth.Register(ctx, d, email, password)
	if err != nil {
		if errors.Is(err, auth.ErrEmailTaken) {
			fmt.Printf("user %s already exists — skipping\n", email)
			return nil
		}
		return fmt.Errorf("register user: %w", err)
	}

	fmt.Printf("created user: id=%s  email=%s  plan=%s\n", user.ID, user.Email, user.Plan)
	return nil
}

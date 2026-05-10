package main

import (
	"context"
	"fmt"
	"strings"

	"cvbuilder/internal/deps"
)

// runListUsers prints all users with their plan and resume count.
//
// Usage:
//
//	go run ./cmd/console list_users
func runListUsers(d deps.Deps, _ []string) error {
	ctx := context.Background()

	type row struct {
		ID          string
		Email       string
		Plan        string
		CreatedAt   string
		ResumeCount int
	}

	sqlRows, err := d.DB.QueryContext(ctx, `
		SELECT
			u.id::text,
			u.email,
			u.plan,
			to_char(u.created_at, 'YYYY-MM-DD HH24:MI') AS created_at,
			COUNT(r.id) AS resume_count
		FROM user_tbl u
		LEFT JOIN resume_tbl r ON r.user_id = u.id
		GROUP BY u.id, u.email, u.plan, u.created_at
		ORDER BY u.created_at DESC
	`)
	if err != nil {
		return fmt.Errorf("query: %w", err)
	}
	defer sqlRows.Close()

	var results []row
	for sqlRows.Next() {
		var r row
		if err := sqlRows.Scan(&r.ID, &r.Email, &r.Plan, &r.CreatedAt, &r.ResumeCount); err != nil {
			return fmt.Errorf("scan: %w", err)
		}
		results = append(results, r)
	}
	if err := sqlRows.Err(); err != nil {
		return fmt.Errorf("rows: %w", err)
	}

	if len(results) == 0 {
		fmt.Println("no users found")
		return nil
	}

	fmt.Printf("%-38s  %-30s  %-5s  %-16s  %s\n", "ID", "EMAIL", "PLAN", "CREATED_AT", "RESUMES")
	fmt.Println(strings.Repeat("─", 100))
	for _, r := range results {
		fmt.Printf("%-38s  %-30s  %-5s  %-16s  %d\n", r.ID, r.Email, r.Plan, r.CreatedAt, r.ResumeCount)
	}
	fmt.Printf("\ntotal: %d user(s)\n", len(results))
	return nil
}

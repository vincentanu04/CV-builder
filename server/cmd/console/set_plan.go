package main

import (
	"context"
	"fmt"

	pg "github.com/go-jet/jet/v2/postgres"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/generated/db/cvbuilder_db/public/table"
	"cvbuilder/internal/deps"
)

// runSetPlan updates the plan for a user identified by email.
//
// Usage:
//
//	go run ./cmd/console set_plan user@example.com pro
//	go run ./cmd/console set_plan user@example.com free
func runSetPlan(d deps.Deps, args []string) error {
	if len(args) < 2 {
		return fmt.Errorf("usage: set_plan <email> <free|mid|pro>")
	}
	email, plan := args[0], args[1]

	validPlans := map[string]bool{"free": true, "mid": true, "pro": true}
	if !validPlans[plan] {
		return fmt.Errorf("invalid plan %q — must be one of: free, mid, pro", plan)
	}

	ctx := context.Background()
	tbl := table.UserTbl

	stmt := tbl.UPDATE(pg.ColumnList{tbl.Plan}).
		MODEL(model.UserTbl{Plan: model.UserPlan(plan)}).
		WHERE(tbl.Email.EQ(pg.String(email))).
		RETURNING(tbl.AllColumns)

	var dest []model.UserTbl
	if err := stmt.QueryContext(ctx, d.DB, &dest); err != nil {
		return fmt.Errorf("update plan: %w", err)
	}
	if len(dest) == 0 {
		return fmt.Errorf("no user found with email %q", email)
	}

	fmt.Printf("updated: id=%s  email=%s  plan=%s\n", dest[0].ID, dest[0].Email, dest[0].Plan)
	return nil
}

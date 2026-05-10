package mutation

import (
	"context"
	"time"

	"github.com/go-jet/jet/v2/qrm"
	"github.com/google/uuid"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/generated/db/cvbuilder_db/public/table"
)

func InsertUser(ctx context.Context, db qrm.DB, email, passwordHash string) (*model.UserTbl, error) {
	tbl := table.UserTbl

	record := model.UserTbl{
		ID:           uuid.New(),
		Email:        email,
		PasswordHash: passwordHash,
		Plan:         "free",
		CreatedAt:    time.Now().UTC(),
	}

	stmt := tbl.INSERT(tbl.MutableColumns).
		MODEL(record).
		RETURNING(tbl.AllColumns)

	var dest []model.UserTbl
	if err := stmt.QueryContext(ctx, db, &dest); err != nil {
		return nil, err
	}
	return &dest[0], nil
}

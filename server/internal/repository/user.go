package repository

import (
	"context"
	"database/sql"

	pg "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	"github.com/google/uuid"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/generated/db/cvbuilder_db/public/table"
)

func GetUserByEmail(ctx context.Context, db qrm.DB, email string) (*model.UserTbl, error) {
	tbl := table.UserTbl

	stmt := pg.SELECT(tbl.AllColumns).
		FROM(tbl).
		WHERE(tbl.Email.EQ(pg.String(email)))

	var rows []model.UserTbl
	if err := stmt.QueryContext(ctx, db, &rows); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	if len(rows) == 0 {
		return nil, nil
	}
	return &rows[0], nil
}

func GetUserByID(ctx context.Context, db qrm.DB, id uuid.UUID) (*model.UserTbl, error) {
	tbl := table.UserTbl

	stmt := pg.SELECT(tbl.AllColumns).
		FROM(tbl).
		WHERE(pg.CAST(tbl.ID).AS_TEXT().EQ(pg.String(id.String())))

	var rows []model.UserTbl
	if err := stmt.QueryContext(ctx, db, &rows); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	if len(rows) == 0 {
		return nil, nil
	}
	return &rows[0], nil
}

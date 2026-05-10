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

func ListResumeVersions(ctx context.Context, db qrm.DB, resumeID uuid.UUID) ([]model.ResumeVersionTbl, error) {
	tbl := table.ResumeVersionTbl

	stmt := pg.SELECT(tbl.AllColumns).
		FROM(tbl).
		WHERE(pg.CAST(tbl.ResumeID).AS_TEXT().EQ(pg.String(resumeID.String()))).
		ORDER_BY(tbl.CreatedAt.DESC())

	var rows []model.ResumeVersionTbl
	if err := stmt.QueryContext(ctx, db, &rows); err != nil {
		return nil, err
	}
	return rows, nil
}

func GetResumeVersionByID(ctx context.Context, db qrm.DB, id uuid.UUID) (*model.ResumeVersionTbl, error) {
	tbl := table.ResumeVersionTbl

	stmt := pg.SELECT(tbl.AllColumns).
		FROM(tbl).
		WHERE(pg.CAST(tbl.ID).AS_TEXT().EQ(pg.String(id.String())))

	var rows []model.ResumeVersionTbl
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

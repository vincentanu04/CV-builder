package repository

import (
	"context"
	"database/sql"
	"time"

	pg "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	"github.com/google/uuid"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/generated/db/cvbuilder_db/public/table"
)

func GetResumeByID(ctx context.Context, db qrm.DB, id uuid.UUID, userID uuid.UUID) (*model.ResumeTbl, error) {
	tbl := table.ResumeTbl

	stmt := pg.SELECT(tbl.AllColumns).
		FROM(tbl).
		WHERE(
			pg.CAST(tbl.ID).AS_TEXT().EQ(pg.String(id.String())).
				AND(pg.CAST(tbl.UserID).AS_TEXT().EQ(pg.String(userID.String()))),
		)

	var rows []model.ResumeTbl
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

func ListResumesByUser(ctx context.Context, db qrm.DB, userID uuid.UUID) ([]model.ResumeTbl, error) {
	tbl := table.ResumeTbl

	stmt := pg.SELECT(tbl.AllColumns).
		FROM(tbl).
		WHERE(pg.CAST(tbl.UserID).AS_TEXT().EQ(pg.String(userID.String()))).
		ORDER_BY(tbl.CreatedAt.DESC())

	var rows []model.ResumeTbl
	if err := stmt.QueryContext(ctx, db, &rows); err != nil {
		return nil, err
	}
	return rows, nil
}

// GetLatestVersionNumber returns the highest version_number for a resume, or 0 if none exist.
func GetLatestVersionNumber(ctx context.Context, db qrm.DB, resumeID uuid.UUID) (int, error) {
	tbl := table.ResumeVersionTbl

	stmt := pg.SELECT(pg.MAX(tbl.VersionNumber).AS("max_version")).
		FROM(tbl).
		WHERE(pg.CAST(tbl.ResumeID).AS_TEXT().EQ(pg.String(resumeID.String())))

	var dest struct {
		MaxVersion *int32
	}
	if err := stmt.QueryContext(ctx, db, &dest); err != nil && err != sql.ErrNoRows {
		return 0, err
	}
	if dest.MaxVersion == nil {
		return 0, nil
	}
	return int(*dest.MaxVersion), nil
}

// GetLatestAutoSaveVersion returns the most recent auto-save version created within the last 5 minutes.
func GetLatestAutoSaveVersion(ctx context.Context, db qrm.DB, resumeID uuid.UUID) (*model.ResumeVersionTbl, error) {
	tbl := table.ResumeVersionTbl
	cutoff := time.Now().Add(-1 * time.Minute)

	stmt := pg.SELECT(tbl.AllColumns).
		FROM(tbl).
		WHERE(
			pg.CAST(tbl.ResumeID).AS_TEXT().EQ(pg.String(resumeID.String())).
				AND(tbl.IsManual.EQ(pg.Bool(false))).
				AND(tbl.CreatedAt.GT(pg.TimestampzT(cutoff))),
		).
		ORDER_BY(tbl.CreatedAt.DESC()).
		LIMIT(1)

	var rows []model.ResumeVersionTbl
	if err := stmt.QueryContext(ctx, db, &rows); err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, nil
	}
	return &rows[0], nil
}

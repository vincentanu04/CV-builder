package mutation

import (
	"context"
	"time"

	pg "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	"github.com/google/uuid"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/generated/db/cvbuilder_db/public/table"
)

func InsertResumeVersion(ctx context.Context, db qrm.DB, resumeID uuid.UUID, versionNumber int, data string, label *string, isManual bool) (*model.ResumeVersionTbl, error) {
	tbl := table.ResumeVersionTbl

	record := model.ResumeVersionTbl{
		ID:            uuid.New(),
		ResumeID:      resumeID,
		VersionNumber: int32(versionNumber),
		Data:          data,
		Label:         label,
		IsManual:      isManual,
		CreatedAt:     time.Now().UTC(),
	}

	stmt := tbl.INSERT(tbl.MutableColumns).
		MODEL(record).
		RETURNING(tbl.AllColumns)

	var dest []model.ResumeVersionTbl
	if err := stmt.QueryContext(ctx, db, &dest); err != nil {
		return nil, err
	}
	return &dest[0], nil
}

func UpdateResumeVersionData(ctx context.Context, db qrm.DB, id uuid.UUID, data string) error {
	tbl := table.ResumeVersionTbl

	cols := pg.ColumnList{tbl.Data}
	record := model.ResumeVersionTbl{Data: data}

	stmt := tbl.UPDATE(cols).
		MODEL(record).
WHERE(pg.CAST(tbl.ID).AS_TEXT().EQ(pg.String(id.String())))

	_, err := stmt.ExecContext(ctx, db)
	return err
}

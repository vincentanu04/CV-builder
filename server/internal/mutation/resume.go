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

func InsertResume(ctx context.Context, db qrm.DB, userID uuid.UUID, title, templateName string, templateVersion int, data string) (*model.ResumeTbl, error) {
	tbl := table.ResumeTbl

	now := time.Now().UTC()
	record := model.ResumeTbl{
		ID:              uuid.New(),
		UserID:          userID,
		Title:           title,
		TemplateName:    templateName,
		TemplateVersion: int32(templateVersion),
		Data:            data,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	stmt := tbl.INSERT(tbl.MutableColumns).
		MODEL(record).
		RETURNING(tbl.AllColumns)

	var dest []model.ResumeTbl
	if err := stmt.QueryContext(ctx, db, &dest); err != nil {
		return nil, err
	}
	return &dest[0], nil
}

func UpdateResume(ctx context.Context, db qrm.DB, id uuid.UUID, userID uuid.UUID, templateName string, templateVersion int, data string) (*model.ResumeTbl, error) {
	tbl := table.ResumeTbl

	cols := pg.ColumnList{tbl.TemplateName, tbl.TemplateVersion, tbl.Data, tbl.UpdatedAt}
	record := model.ResumeTbl{
		TemplateName:    templateName,
		TemplateVersion: int32(templateVersion),
		Data:            data,
		UpdatedAt:       time.Now().UTC(),
	}

	stmt := tbl.UPDATE(cols).
		MODEL(record).
		WHERE(
			pg.CAST(tbl.ID).AS_TEXT().EQ(pg.String(id.String())).
				AND(pg.CAST(tbl.UserID).AS_TEXT().EQ(pg.String(userID.String()))),
		).
		RETURNING(tbl.AllColumns)

	var dest []model.ResumeTbl
	if err := stmt.QueryContext(ctx, db, &dest); err != nil {
		return nil, err
	}
	return &dest[0], nil
}

func UpdateResumeTitle(ctx context.Context, db qrm.DB, id uuid.UUID, userID uuid.UUID, title string) (*model.ResumeTbl, error) {
	tbl := table.ResumeTbl

	cols := pg.ColumnList{tbl.Title, tbl.UpdatedAt}
	record := model.ResumeTbl{
		Title:     title,
		UpdatedAt: time.Now().UTC(),
	}

	stmt := tbl.UPDATE(cols).
		MODEL(record).
		WHERE(
			pg.CAST(tbl.ID).AS_TEXT().EQ(pg.String(id.String())).
				AND(pg.CAST(tbl.UserID).AS_TEXT().EQ(pg.String(userID.String()))),
		).
		RETURNING(tbl.AllColumns)

	var dest []model.ResumeTbl
	if err := stmt.QueryContext(ctx, db, &dest); err != nil {
		return nil, err
	}
	return &dest[0], nil
}

func DeleteResume(ctx context.Context, db qrm.DB, id uuid.UUID, userID uuid.UUID) error {
	tbl := table.ResumeTbl

	stmt := tbl.DELETE().
		WHERE(
			pg.CAST(tbl.ID).AS_TEXT().EQ(pg.String(id.String())).
				AND(pg.CAST(tbl.UserID).AS_TEXT().EQ(pg.String(userID.String()))),
		)

	_, err := stmt.ExecContext(ctx, db)
	return err
}

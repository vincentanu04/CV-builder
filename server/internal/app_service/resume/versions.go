package resume

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/internal/deps"
	"cvbuilder/internal/mutation"
	"cvbuilder/internal/repository"
)

func ListVersions(ctx context.Context, d deps.Deps, resumeID uuid.UUID, userID uuid.UUID) ([]model.ResumeVersionTbl, error) {
	// Verify ownership first.
	r, err := repository.GetResumeByID(ctx, d.DB, resumeID, userID)
	if err != nil {
		return nil, err
	}
	if r == nil {
		return nil, ErrNotFound
	}

	return repository.ListResumeVersions(ctx, d.DB, resumeID)
}

func GetVersion(ctx context.Context, d deps.Deps, versionID uuid.UUID) (*model.ResumeVersionTbl, error) {
	v, err := repository.GetResumeVersionByID(ctx, d.DB, versionID)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, ErrNotFound
	}
	return v, nil
}

func CreateNamedVersion(ctx context.Context, d deps.Deps, resumeID uuid.UUID, userID uuid.UUID, label string) (*model.ResumeVersionTbl, error) {
	r, err := repository.GetResumeByID(ctx, d.DB, resumeID, userID)
	if err != nil {
		return nil, err
	}
	if r == nil {
		return nil, ErrNotFound
	}

	latest, err := repository.GetLatestVersionNumber(ctx, d.DB, resumeID)
	if err != nil {
		return nil, err
	}

	return mutation.InsertResumeVersion(ctx, d.DB, resumeID, latest+1, r.Data, &label, true)
}

func RestoreVersion(ctx context.Context, d deps.Deps, resumeID uuid.UUID, versionID uuid.UUID, userID uuid.UUID) (*model.ResumeTbl, error) {
	r, err := repository.GetResumeByID(ctx, d.DB, resumeID, userID)
	if err != nil {
		return nil, err
	}
	if r == nil {
		return nil, ErrNotFound
	}

	v, err := repository.GetResumeVersionByID(ctx, d.DB, versionID)
	if err != nil {
		return nil, err
	}
	if v == nil || v.ResumeID != resumeID {
		return nil, ErrNotFound
	}

	updated, err := mutation.UpdateResume(ctx, d.DB, resumeID, userID, r.TemplateName, int(r.TemplateVersion), v.Data)
	if err != nil {
		return nil, err
	}

	// Create a new version entry so the timeline reflects the restore.
	latest, err := repository.GetLatestVersionNumber(ctx, d.DB, resumeID)
	if err != nil {
		return nil, err
	}
	label := "Restored to v" + fmt.Sprintf("%d", v.VersionNumber)
	_, err = mutation.InsertResumeVersion(ctx, d.DB, resumeID, latest+1, v.Data, &label, true)
	if err != nil {
		return nil, err
	}

	return updated, nil
}

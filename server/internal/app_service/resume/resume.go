package resume

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/internal/deps"
	"cvbuilder/internal/mutation"
	"cvbuilder/internal/repository"
)

var (
	ErrNotFound    = errors.New("resume not found")
	ErrLimitReached = errors.New("resume limit reached for current plan")
)

// PlanLimits maps plan name → max number of resumes.
var PlanLimits = map[string]int{
	"free": 1,
	"mid":  3,
	"pro":  100,
}

// ListResult bundles the resume list with a flag indicating whether the user has hit their plan limit.
type ListResult struct {
	Resumes []model.ResumeTbl
	Limited bool
}

func ListResumes(ctx context.Context, d deps.Deps, userID uuid.UUID) (*ListResult, error) {
	user, err := repository.GetUserByID(ctx, d.DB, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	resumes, err := repository.ListResumesByUser(ctx, d.DB, userID)
	if err != nil {
		return nil, err
	}

	limit := PlanLimits[user.Plan]
	return &ListResult{
		Resumes: resumes,
		Limited: len(resumes) >= limit,
	}, nil
}

func GetResume(ctx context.Context, d deps.Deps, id uuid.UUID, userID uuid.UUID) (*model.ResumeTbl, error) {
	r, err := repository.GetResumeByID(ctx, d.DB, id, userID)
	if err != nil {
		return nil, err
	}
	if r == nil {
		return nil, ErrNotFound
	}
	return r, nil
}

func CreateResume(ctx context.Context, d deps.Deps, userID uuid.UUID, title, templateName string, templateVersion int, data string) (*model.ResumeTbl, error) {
	user, err := repository.GetUserByID(ctx, d.DB, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	existing, err := repository.ListResumesByUser(ctx, d.DB, userID)
	if err != nil {
		return nil, err
	}

	limit := PlanLimits[user.Plan]
	if len(existing) >= limit {
		return nil, ErrLimitReached
	}

	return mutation.InsertResume(ctx, d.DB, userID, title, templateName, templateVersion, data)
}

func UpdateResume(ctx context.Context, d deps.Deps, id uuid.UUID, userID uuid.UUID, templateName string, templateVersion int, data string) (*model.ResumeTbl, error) {
	existing, err := repository.GetResumeByID(ctx, d.DB, id, userID)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrNotFound
	}

	updated, err := mutation.UpdateResume(ctx, d.DB, id, userID, templateName, templateVersion, data)
	if err != nil {
		return nil, err
	}

	// Squash or create an auto-save version snapshot.
	last, lastErr := repository.GetLatestAutoSaveVersion(ctx, d.DB, id)
	if lastErr == nil && last != nil {
		_ = mutation.UpdateResumeVersionData(ctx, d.DB, last.ID, data)
	} else {
		latest, vErr := repository.GetLatestVersionNumber(ctx, d.DB, id)
		if vErr == nil {
			_, _ = mutation.InsertResumeVersion(ctx, d.DB, id, latest+1, data, nil, false)
		}
	}

	return updated, nil
}

func UpdateResumeTitle(ctx context.Context, d deps.Deps, id uuid.UUID, userID uuid.UUID, title string) (*model.ResumeTbl, error) {
	existing, err := repository.GetResumeByID(ctx, d.DB, id, userID)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrNotFound
	}

	return mutation.UpdateResumeTitle(ctx, d.DB, id, userID, title)
}

func DeleteResume(ctx context.Context, d deps.Deps, id uuid.UUID, userID uuid.UUID) error {
	existing, err := repository.GetResumeByID(ctx, d.DB, id, userID)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrNotFound
	}

	return mutation.DeleteResume(ctx, d.DB, id, userID)
}

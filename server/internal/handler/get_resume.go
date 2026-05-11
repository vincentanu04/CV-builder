package handler

import (
	"context"
	"errors"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/app_service/resume"
	"cvbuilder/internal/middleware"
)

func (h *Handler) GetResume(ctx context.Context, request oapi.GetResumeRequestObject) (oapi.GetResumeResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	r, err := resume.GetResume(ctx, h.deps, request.Id, userID)
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.GetResume404JSONResponse{Message: "resume not found"}, nil
		}
		return nil, err
	}

	return oapi.GetResume200JSONResponse{
		Id:              r.ID,
		Title:           r.Title,
		TemplateName:    r.TemplateName,
		TemplateVersion: int(r.TemplateVersion),
		Data:            r.Data,
		CreatedAt:       r.CreatedAt,
		UpdatedAt:       r.UpdatedAt,
	}, nil
}

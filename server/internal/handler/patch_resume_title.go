package handler

import (
	"context"
	"errors"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/app_service/resume"
	"cvbuilder/internal/middleware"
)

func (h *Handler) PatchResumeTitle(ctx context.Context, request oapi.PatchResumeTitleRequestObject) (oapi.PatchResumeTitleResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	r, err := resume.UpdateResumeTitle(ctx, h.deps, request.Params.Id, userID, request.Body.Title)
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.PatchResumeTitle404JSONResponse{Message: "resume not found"}, nil
		}
		return nil, err
	}

	return oapi.PatchResumeTitle200JSONResponse{
		Id:              r.ID,
		Title:           r.Title,
		TemplateName:    r.TemplateName,
		TemplateVersion: int(r.TemplateVersion),
		Data:            r.Data,
		CreatedAt:       r.CreatedAt,
		UpdatedAt:       r.UpdatedAt,
	}, nil
}

package handler

import (
	"context"
	"errors"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/app_service/resume"
	"cvbuilder/internal/middleware"
)

func (h *Handler) PatchResume(ctx context.Context, request oapi.PatchResumeRequestObject) (oapi.PatchResumeResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	templateVersion := 1
	if request.Body.TemplateVersion != nil {
		templateVersion = *request.Body.TemplateVersion
	}

	r, err := resume.UpdateResume(ctx, h.deps, request.Params.Id, userID, request.Body.TemplateName, templateVersion, request.Body.Data)
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.PatchResume404JSONResponse{Message: "resume not found"}, nil
		}
		return nil, err
	}

	return oapi.PatchResume200JSONResponse{
		Id:              r.ID,
		Title:           r.Title,
		TemplateName:    r.TemplateName,
		TemplateVersion: int(r.TemplateVersion),
		Data:            r.Data,
		CreatedAt:       r.CreatedAt,
		UpdatedAt:       r.UpdatedAt,
	}, nil
}

package handler

import (
	"context"
	"errors"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/app_service/resume"
	"cvbuilder/internal/middleware"
)

func (h *Handler) PostResume(ctx context.Context, request oapi.PostResumeRequestObject) (oapi.PostResumeResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	templateVersion := 1
	if request.Body.TemplateVersion != nil {
		templateVersion = *request.Body.TemplateVersion
	}

	r, err := resume.CreateResume(ctx, h.deps, userID, request.Body.Title, request.Body.TemplateName, templateVersion, request.Body.Data)
	if err != nil {
		if errors.Is(err, resume.ErrLimitReached) {
			return oapi.PostResume403JSONResponse{Message: "resume limit reached for your current plan"}, nil
		}
		return nil, err
	}

	return oapi.PostResume201JSONResponse{
		Id:              r.ID,
		Title:           r.Title,
		TemplateName:    r.TemplateName,
		TemplateVersion: int(r.TemplateVersion),
		Data:            r.Data,
		CreatedAt:       r.CreatedAt,
		UpdatedAt:       r.UpdatedAt,
	}, nil
}

package handler

import (
	"context"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/app_service/resume"
	"cvbuilder/internal/middleware"
)

func (h *Handler) GetResumes(ctx context.Context, _ oapi.GetResumesRequestObject) (oapi.GetResumesResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	result, err := resume.ListResumes(ctx, h.deps, userID)
	if err != nil {
		return nil, err
	}

	items := make([]oapi.Resume, len(result.Resumes))
	for i, r := range result.Resumes {
		items[i] = oapi.Resume{
			Id:              r.ID,
			Title:           r.Title,
			TemplateName:    r.TemplateName,
			TemplateVersion: int(r.TemplateVersion),
			Data:            r.Data,
			CreatedAt:       r.CreatedAt,
			UpdatedAt:       r.UpdatedAt,
		}
	}

	return oapi.GetResumes200JSONResponse{Resumes: items, Limited: result.Limited}, nil
}

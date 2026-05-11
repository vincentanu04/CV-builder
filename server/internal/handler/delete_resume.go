package handler

import (
	"context"
	"errors"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/app_service/resume"
	"cvbuilder/internal/middleware"
)

func (h *Handler) DeleteResume(ctx context.Context, request oapi.DeleteResumeRequestObject) (oapi.DeleteResumeResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	err := resume.DeleteResume(ctx, h.deps, request.Id, userID)
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.DeleteResume404JSONResponse{Message: "resume not found"}, nil
		}
		return nil, err
	}

	return oapi.DeleteResume200Response{}, nil
}

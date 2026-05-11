package handler

import (
	"context"
	"errors"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/app_service/resume"
	"cvbuilder/internal/middleware"
)

func (h *Handler) GetResumeVersions(ctx context.Context, request oapi.GetResumeVersionsRequestObject) (oapi.GetResumeVersionsResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	versions, err := resume.ListVersions(ctx, h.deps, request.Id, userID)
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.GetResumeVersions200JSONResponse{Versions: []oapi.ResumeVersion{}}, nil
		}
		return nil, err
	}

	items := make([]oapi.ResumeVersion, len(versions))
	for i, v := range versions {
		items[i] = oapi.ResumeVersion{
			Id:            v.ID,
			ResumeId:      v.ResumeID,
			VersionNumber: int(v.VersionNumber),
			Data:          v.Data,
			Label:         v.Label,
			IsManual:      v.IsManual,
			CreatedAt:     v.CreatedAt,
		}
	}

	return oapi.GetResumeVersions200JSONResponse{Versions: items}, nil
}

func (h *Handler) GetResumeVersion(ctx context.Context, request oapi.GetResumeVersionRequestObject) (oapi.GetResumeVersionResponseObject, error) {
	_, err := resume.GetResume(ctx, h.deps, request.Id, middleware.UserIDFromContext(ctx))
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.GetResumeVersion404JSONResponse{Message: "resume not found"}, nil
		}
		return nil, err
	}

	v, err := resume.GetVersion(ctx, h.deps, request.Vid)
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.GetResumeVersion404JSONResponse{Message: "version not found"}, nil
		}
		return nil, err
	}

	return oapi.GetResumeVersion200JSONResponse{
		Id:            v.ID,
		ResumeId:      v.ResumeID,
		VersionNumber: int(v.VersionNumber),
		Data:          v.Data,
		Label:         v.Label,
		IsManual:      v.IsManual,
		CreatedAt:     v.CreatedAt,
	}, nil
}

func (h *Handler) PostResumeVersion(ctx context.Context, request oapi.PostResumeVersionRequestObject) (oapi.PostResumeVersionResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	v, err := resume.CreateNamedVersion(ctx, h.deps, request.Id, userID, request.Body.Label)
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.PostResumeVersion404JSONResponse{Message: "resume not found"}, nil
		}
		return nil, err
	}

	return oapi.PostResumeVersion201JSONResponse{
		Id:            v.ID,
		ResumeId:      v.ResumeID,
		VersionNumber: int(v.VersionNumber),
		Data:          v.Data,
		Label:         v.Label,
		IsManual:      v.IsManual,
		CreatedAt:     v.CreatedAt,
	}, nil
}

func (h *Handler) PostResumeVersionRestore(ctx context.Context, request oapi.PostResumeVersionRestoreRequestObject) (oapi.PostResumeVersionRestoreResponseObject, error) {
	userID := middleware.UserIDFromContext(ctx)

	r, err := resume.RestoreVersion(ctx, h.deps, request.Id, request.Vid, userID)
	if err != nil {
		if errors.Is(err, resume.ErrNotFound) {
			return oapi.PostResumeVersionRestore404JSONResponse{Message: "resume or version not found"}, nil
		}
		return nil, err
	}

	return oapi.PostResumeVersionRestore200JSONResponse{
		Id:              r.ID,
		Title:           r.Title,
		TemplateName:    r.TemplateName,
		TemplateVersion: int(r.TemplateVersion),
		Data:            r.Data,
		CreatedAt:       r.CreatedAt,
		UpdatedAt:       r.UpdatedAt,
	}, nil
}

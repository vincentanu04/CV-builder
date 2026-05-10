package handler

import (
	"context"
	"net/http"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/middleware"
)

// logoutCookieResponse clears the auth cookie.
type logoutCookieResponse struct{}

func (r logoutCookieResponse) VisitPostAuthLogoutResponse(w http.ResponseWriter) error {
	middleware.ClearAuthCookie(w)
	w.WriteHeader(200)
	return nil
}

func (h *Handler) PostAuthLogout(_ context.Context, _ oapi.PostAuthLogoutRequestObject) (oapi.PostAuthLogoutResponseObject, error) {
	return logoutCookieResponse{}, nil
}

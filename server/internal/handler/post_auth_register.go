package handler

import (
	"context"
	"errors"
	"encoding/json"
	"net/http"

	oapi "cvbuilder/generated/server"
	"cvbuilder/internal/app_service/auth"
	"cvbuilder/internal/middleware"
)

// registerCookieResponse sets the JWT HttpOnly cookie before writing the JSON body.
type registerCookieResponse struct {
	user  oapi.AuthUser
	token string
}

func (r registerCookieResponse) VisitPostAuthRegisterResponse(w http.ResponseWriter) error {
	middleware.SetAuthCookie(w, r.token)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	return json.NewEncoder(w).Encode(r.user)
}

func (h *Handler) PostAuthRegister(ctx context.Context, request oapi.PostAuthRegisterRequestObject) (oapi.PostAuthRegisterResponseObject, error) {
	user, token, err := auth.Register(ctx, h.deps, string(request.Body.Email), request.Body.Password)
	if err != nil {
		if errors.Is(err, auth.ErrEmailTaken) {
			return oapi.PostAuthRegister409JSONResponse{Message: "email already in use"}, nil
		}
		if errors.Is(err, auth.ErrWeakPassword) {
			return oapi.PostAuthRegister400JSONResponse{Message: err.Error()}, nil
		}
		return nil, err
	}

	return registerCookieResponse{
		user:  oapi.AuthUser{Id: user.ID, Email: user.Email, Plan: user.Plan},
		token: token,
	}, nil
}

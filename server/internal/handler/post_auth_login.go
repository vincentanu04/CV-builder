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

// loginCookieResponse sets the JWT HttpOnly cookie before writing the JSON body.
type loginCookieResponse struct {
	user  oapi.AuthUser
	token string
}

func (r loginCookieResponse) VisitPostAuthLoginResponse(w http.ResponseWriter) error {
	middleware.SetAuthCookie(w, r.token)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	return json.NewEncoder(w).Encode(r.user)
}

func (h *Handler) PostAuthLogin(ctx context.Context, request oapi.PostAuthLoginRequestObject) (oapi.PostAuthLoginResponseObject, error) {
	user, token, err := auth.Login(ctx, h.deps, string(request.Body.Email), request.Body.Password)
	if err != nil {
		if errors.Is(err, auth.ErrInvalidCredentials) {
			return oapi.PostAuthLogin401JSONResponse{Message: "invalid email or password"}, nil
		}
		return nil, err
	}

	return loginCookieResponse{
		user:  oapi.AuthUser{Id: user.ID, Email: user.Email, Plan: oapi.AuthUserPlan(user.Plan)},
		token: token,
	}, nil
}

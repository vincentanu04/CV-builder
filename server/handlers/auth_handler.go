package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
} 

func sanitizeLoginRequest (req *LoginRequest) error {
	req.Email = strings.TrimSpace(req.Email)
	req.Password = strings.TrimSpace(req.Password)

	if req.Email == "" {
		return httpError{Message: "Email must not be empty", StatusCode: http.StatusBadRequest}
	}
	if req.Password == "" {
		return httpError{Message: "Password must not be empty", StatusCode: http.StatusBadRequest}
	}

	return nil
}

func LoginHandler (w http.ResponseWriter, r *http.Request) {
	loginRequest := LoginRequest{}

	err := json.NewDecoder(r.Body).Decode(&loginRequest)
	if err != nil {
		http.Error(w, "Unexpected JSON", http.StatusBadRequest)
		return
	}

	err = sanitizeLoginRequest(&loginRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// continue main logic
	// check if user exists in db

	// check if hashed pwd associated with that user matches request password

	// if match, give token to db and return successful
}
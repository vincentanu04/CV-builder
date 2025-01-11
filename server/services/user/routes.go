package user

import (
	"fmt"
	"net/http"
	"server/utils"
	"strings"

	"github.com/gorilla/mux"
)

type UserHandler struct {
	store UserStore
}

func NewHandler(store UserStore) *UserHandler {
	return &UserHandler{store: store}
}

func (h *UserHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.handleLogin).Methods("POST")
	router.HandleFunc("/register", h.handleRegister).Methods("POST")
}

type UserRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

func (h *UserHandler) sanitizeUserRequest (req *UserRequest) {
	req.Email = strings.TrimSpace(req.Email)
	req.Password = strings.TrimSpace(req.Password)
}

func (h *UserHandler) handleLogin(w http.ResponseWriter, r *http.Request) {
	loginRequest := UserRequest{}

	err := utils.ParseJSON(r, &loginRequest)
	if err != nil {
		utils.WriteError(w, err, http.StatusBadRequest)
		return
	}

	h.sanitizeUserRequest(&loginRequest)

	err = utils.Validate.Struct(loginRequest)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("invalid payload"), http.StatusBadRequest)
	}

	// main logic
	// user, err := h.store.GetUserByEmail(loginRequest.Email)
	// if err != nil {
	// 	utils.WriteError(w, fmt.Errorf("invalid email or password"), http.StatusBadRequest)
	// }
}

func (h *UserHandler) handleRegister(w http.ResponseWriter, r *http.Request) {
	registerRequest := UserRequest{}

	err := utils.ParseJSON(r, &registerRequest)
	if err != nil {
		utils.WriteError(w, err, http.StatusBadRequest)
		return
	}

	h.sanitizeUserRequest(&registerRequest)

	err = utils.Validate.Struct(registerRequest)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("invalid payload"), http.StatusBadRequest)
	}

	// main logic

}
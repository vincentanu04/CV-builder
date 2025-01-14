package user

import (
	"fmt"
	"net/http"
	"server/configs"
	"server/services/auth"
	"server/utils"
	"strings"

	"github.com/go-playground/validator/v10"
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
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, fmt.Errorf("invalid payload %+v", errors), http.StatusBadRequest)
		return
	}

	// main logic
	user, err := h.store.GetUserByEmail(loginRequest.Email)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("invalid email or password"), http.StatusBadRequest)
		return
	}

	if !auth.ComparePasswords(user.Password, []byte(loginRequest.Password)) {
		utils.WriteError(w, fmt.Errorf("invalid email or password"), http.StatusBadRequest)
		return
	}

	secret := []byte(configs.Envs.JWTSecret)
	token, err := auth.CreateJWT(secret, user.ID, configs.Envs.JWTExpirationInSec) 
	if err != nil {
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"token": token})
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
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, fmt.Errorf("invalid payload %+v", errors), http.StatusBadRequest)
		return
	}

	user, _ := h.store.GetUserByEmail(registerRequest.Email)
	if user != nil { // user already exists
		utils.WriteError(w, fmt.Errorf("user with email %s already exists", registerRequest.Email), http.StatusBadRequest)
		return
	}

	hashedPassword, err := auth.HashPassword(registerRequest.Password)
	if err != nil {
		utils.WriteError(w, err, http.StatusInternalServerError)
	}

	newUser := User{
		Email: registerRequest.Email,
		Password: hashedPassword,
	}
	err = h.store.CreateUser(&newUser)
	if err != nil {
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	// generate token to automatically log in
	secret := []byte(configs.Envs.JWTSecret)
	token, err := auth.CreateJWT(secret, newUser.ID, configs.Envs.JWTExpirationInSec) 
	if err != nil {
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"token": token})
}
package user

import (
	"fmt"
	"log"
	"net/http"
	"server/configs"
	"server/services/auth"
	"server/types"
	"server/utils"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type UserHandler struct {
	store types.UserStore
}

func NewHandler(store types.UserStore) *UserHandler {
	return &UserHandler{store: store}
}

func (h *UserHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.handleLogin).Methods(http.MethodPost)
	router.HandleFunc("/register", h.handleRegister).Methods(http.MethodPost)
}

type UserRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

func (h *UserHandler) sanitizeUserRequest(req *UserRequest) {
	req.Email = strings.TrimSpace(req.Email)
	req.Password = strings.TrimSpace(req.Password)
}

func (h *UserHandler) handleLogin(w http.ResponseWriter, r *http.Request) {
	log.Println("handing login ..")
	defer func() {
		log.Println("finished logging in ..")
	}()

	loginRequest := UserRequest{}

	err := utils.ParseJSON(r, &loginRequest)
	if err != nil {
		log.Printf("error parsing request json, %v", err)
		utils.WriteError(w, err, http.StatusBadRequest)
		return
	}

	h.sanitizeUserRequest(&loginRequest)

	err = utils.Validate.Struct(loginRequest)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		log.Printf("error validating request, %+v", errors)
		utils.WriteError(w, fmt.Errorf("invalid payload %+v", errors), http.StatusBadRequest)
		return
	}

	log.Printf("logging in with request payload %+v", loginRequest)

	// main logic
	user, err := h.store.GetUserByEmail(loginRequest.Email)
	if err != nil {
		log.Printf("error validating request, %+v", err)
		utils.WriteError(w, fmt.Errorf("invalid email or password"), http.StatusBadRequest)
		return
	}

	if !auth.ComparePasswords(user.Password, []byte(loginRequest.Password)) {
		log.Printf("password doesn't match")
		utils.WriteError(w, fmt.Errorf("invalid email or password"), http.StatusBadRequest)
		return
	}

	secret := []byte(configs.Envs.JWTSecret)
	token, err := auth.CreateJWT(secret, user.ID, configs.Envs.JWTExpirationInSec)
	if err != nil {
		log.Printf("error creating jwt, %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	log.Printf("successfully login user %s", user.Email)
	utils.WriteJSON(w, http.StatusOK, map[string]string{"token": token})
}

func (h *UserHandler) handleRegister(w http.ResponseWriter, r *http.Request) {
	log.Println("handing register ..")
	defer func() {
		log.Println("finished registering ..")
	}()

	registerRequest := UserRequest{}

	err := utils.ParseJSON(r, &registerRequest)
	if err != nil {
		log.Printf("error parsing request json, %v", err)
		utils.WriteError(w, err, http.StatusBadRequest)
		return
	}

	h.sanitizeUserRequest(&registerRequest)

	err = utils.Validate.Struct(registerRequest)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		log.Printf("error validating request payload, %+v", errors)
		utils.WriteError(w, fmt.Errorf("invalid payload %+v", errors), http.StatusBadRequest)
		return
	}

	log.Printf("registering with request payload %+v", registerRequest)

	_, err = h.store.GetUserByEmail(registerRequest.Email)
	if err == nil { // user already exists
		log.Printf("user with email %s already exists", registerRequest.Email)
		utils.WriteError(w, fmt.Errorf("user with email %s already exists or error %v", registerRequest.Email, err), http.StatusBadRequest)
		return
	}

	hashedPassword, err := auth.HashPassword(registerRequest.Password)
	if err != nil {
		log.Printf("error hashing password, %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
	}

	newUser := types.User{
		Email:    registerRequest.Email,
		Password: hashedPassword,
	}
	err = h.store.CreateUser(&newUser)
	if err != nil {
		log.Printf("error creating new user %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	// generate token to automatically log in
	secret := []byte(configs.Envs.JWTSecret)
	token, err := auth.CreateJWT(secret, newUser.ID, configs.Envs.JWTExpirationInSec)
	if err != nil {
		log.Printf("error creating JWT, %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	log.Printf("successfully registered user %s", newUser.Email)
	utils.WriteJSON(w, http.StatusOK, map[string]string{"token": token})
}

package resume

import (
	"fmt"
	"log"
	"net/http"
	"server/services/auth"
	"server/types"
	"server/utils"
	"strconv"

	"github.com/gorilla/mux"
)

type Handler struct {
	resumeStore types.ResumeStore
	userStore   types.UserStore
}

func NewHandler(resumeStore types.ResumeStore, userStore types.UserStore) *Handler {
	return &Handler{resumeStore: resumeStore, userStore: userStore}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/resumes", auth.WithJWTAuth(h.handleGetResumeMetadatas, h.userStore)).Methods(http.MethodGet)
	router.HandleFunc("/resumes/{id:[0-9]+}", auth.WithJWTAuth(h.handleGetResume, h.userStore)).Methods(http.MethodGet)
}

func (h *Handler) handleGetResumeMetadatas(w http.ResponseWriter, r *http.Request) {
	log.Println("handing get resumes ..")
	defer func() {
		log.Println("finished getting resumes ..")
	}()

	userID := auth.GetUserIDFromContext(r.Context())

	resumes, err := h.resumeStore.GetResumeMetadatasByUserID(userID)
	if err != nil {
		log.Printf("error getting resumes for user %d, %v", userID, err)
		utils.WriteError(w, fmt.Errorf("error getting resumes for user %d", userID), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string][]*types.ResumeMetadata{"resumeMetadatas": resumes})
}

func (h *Handler) handleGetResume(w http.ResponseWriter, r *http.Request) {
	log.Println("handing get resume ..")
	defer func() {
		log.Println("finished getting resume ..")
	}()

	vars := mux.Vars(r)
	resumeID, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Printf("error converting resumeID param to int: %v", err)
		utils.WriteError(w, fmt.Errorf("error converting resumeID param to int: %v", err), http.StatusInternalServerError)
		return
	}

	resume, err := h.resumeStore.GetResumeByID(resumeID)
	if err != nil {
		log.Printf("error getting resume content for resume ID %d, %v", resumeID, err)
		utils.WriteError(w, fmt.Errorf("error getting resume content for resume ID %d", resumeID), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]*types.Resume{"resume": resume})
}

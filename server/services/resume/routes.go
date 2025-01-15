package resume

import (
	"fmt"
	"log"
	"net/http"
	"server/services/auth"
	"server/types"
	"server/utils"

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
	router.HandleFunc("/resumes", auth.WithJWTAuth(h.handleGetResumes, h.userStore)).Methods(http.MethodGet)
}

func (h *Handler) handleGetResumes(w http.ResponseWriter, r *http.Request) {
	log.Println("handing get resumes ..")
	defer func() {
		log.Println("finished getting resumes ..")
	}()

	userID := auth.GetUserIDFromContext(r.Context())

	resumes, err := h.resumeStore.GetResumesByUserID(userID)
	if err != nil {
		log.Printf("error getting resumes for user %d, %v", userID, err)
		utils.WriteError(w, fmt.Errorf("error getting resumes for user %d", userID), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string][]types.Resume{"resumes": resumes})
}

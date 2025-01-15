package resume

import (
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
	user := r.Context().Value("user").(*types.User) 

	resumes, err := h.resumeStore.GetResumesByUserID(user.ID)
	if err != nil {
		http.Error(w, "Error retrieving resumes", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, resumes)
}

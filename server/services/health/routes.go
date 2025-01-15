package health

import (
	"net/http"
	"server/utils"

	"github.com/gorilla/mux"
)

const (
	HEALTHY_STATUS = "Server up and running!"
)

type HealthHandler struct{}

func NewHandler() *HealthHandler {
	return &HealthHandler{}
}

func (h *HealthHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/health", h.handleHealth).Methods(http.MethodGet)
}

func (h *HealthHandler) handleHealth(w http.ResponseWriter, r *http.Request) {
	utils.WriteJSON(w, http.StatusOK, map[string]string{"health": HEALTHY_STATUS})
}

package handler

import (
	"cvbuilder/internal/deps"
)

// Handler implements oapi.StrictServerInterface.
// All business logic is delegated to internal/app_service/.
type Handler struct {
	deps deps.Deps
}

func NewHandler(d deps.Deps) *Handler {
	return &Handler{deps: d}
}

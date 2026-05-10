package handler

import (
	"context"

	oapi "cvbuilder/generated/server"
)

func (h *Handler) GetHealth(_ context.Context, _ oapi.GetHealthRequestObject) (oapi.GetHealthResponseObject, error) {
	return oapi.GetHealth200Response{}, nil
}

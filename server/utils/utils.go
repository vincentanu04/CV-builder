package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

var Validate = validator.New()

func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}

func ParseJSON(r *http.Request, v any) error {
	if r.Body == nil {
		return fmt.Errorf("missing request body")
	}

	return json.NewDecoder(r.Body).Decode(v)
}

func WriteError(w http.ResponseWriter, err error, status int) {
	WriteJSON(w, status, map[string]string{"error": err.Error()})
}

func GetTokenFromRequest(r *http.Request) string {
	tokenAuth := r.Header.Get("Authorization")

	if tokenAuth != "" {
		parts := strings.Split(tokenAuth, " ")
		if len(parts) == 2 && parts[0] == "Bearer" {
			return parts[1]
		}
	}

	return ""
}

func DecodeBase64(fileString string) ([]byte, error) {

	return nil, nil
}

func UploadImageToS3(imagePath string) (string, error) {
	return "", nil
}

func FileBinaryToImagePath(fileBytes []byte) (string, error) {
	uniqueID := uuid.New().String()
	tempPDFPath := fmt.Sprintf("/tmp/temp_resume_%s.pdf", uniqueID)
	tempImagePath := fmt.Sprintf("/tmp/temp_resume_thumbnail_%s", uniqueID)

	defer func() {
		os.Remove(tempPDFPath)            // Clean up temporary PDF
		os.Remove(tempImagePath + ".png") // Clean up temporary image
	}()

	err := os.WriteFile(tempPDFPath, fileBytes, 0644)
	if err != nil {
		return "", err
	}

	cmd := exec.Command("pdftoppm", "-png", "-singlefile", tempPDFPath, tempImagePath)
	err = cmd.Run()
	if err != nil {
		return "", err
	}

	// The generated image will be saved as "/tmp/temp_resume_thumbnail_<UUID>.png"
	finalImagePath := tempImagePath + ".png"

	return finalImagePath, nil
}

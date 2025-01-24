package utils

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"mime"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
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
	bytes, err := base64.StdEncoding.DecodeString(fileString)
	if err != nil {
		return nil, err
	}

	return bytes, nil
}

func FileBinaryToImagePath(fileBytes []byte) (string, error) {
	uniqueID := uuid.New().String() // prevent colliding files on the same path
	tempPDFPath := fmt.Sprintf("/tmp/temp_resume_%s.pdf", uniqueID)
	tempImagePath := fmt.Sprintf("/tmp/temp_resume_thumbnail_%s", uniqueID)

	defer func() { // clean up temporary files
		os.Remove(tempPDFPath)
		os.Remove(tempImagePath + ".png")
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

	finalImagePath := tempImagePath + ".png"

	return finalImagePath, nil
}

func UploadImageToS3(imagePath string) (string, error) {
	fileBytes, err := os.ReadFile(imagePath)
	if err != nil {
		return "", fmt.Errorf("failed to read file for upload: %w", err)
	}

	// Get file name and MIME type
	fileName := filepath.Base(imagePath)
	mimeType := mime.TypeByExtension(filepath.Ext(imagePath))

	// Create S3 session
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("your-region"), // Replace with your AWS region
	})
	if err != nil {
		return "", fmt.Errorf("failed to create AWS session: %w", err)
	}

	// Upload file to S3
	s3Svc := s3.New(sess)
	_, err = s3Svc.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String("your-bucket-name"), // Replace with your bucket name
		Key:         aws.String(fileName),
		Body:        bytes.NewReader(fileBytes),
		ContentType: aws.String(mimeType),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload image to S3: %w", err)
	}

	// Return S3 URL
	s3URL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", "your-bucket-name", "your-region", fileName)
	return s3URL, nil
}

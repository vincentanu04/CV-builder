package resume

import (
	"fmt"
	"log"
	"net/http"
	"server/services/auth"
	"server/types"
	"server/utils"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type CreateResumePayload struct {
	TemplateName string `json:"template_name" validate:"required"`
	Title        string `json:"title" validate:"required"`
	Data         string `json:"data" validate:"required"`
	File         string `json:"file" validate:"required"` // Base64-encoded file
}

type UpdateResumePayload struct {
	TemplateName string `json:"template_name" validate:"required"`
	Data         string `json:"data" validate:"required"`
	File         string `json:"file" validate:"required"` // Base64-encoded file
}

type UpdateResumeMetadataTitlePayload struct {
	Title string `json:"title" validate:"required"`
}

type Handler struct {
	resumeStore types.ResumeStore
	userStore   types.UserStore
}

func NewHandler(resumeStore types.ResumeStore, userStore types.UserStore) *Handler {
	return &Handler{resumeStore: resumeStore, userStore: userStore}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/resume_metadatas", auth.WithJWTAuth(h.handleGetResumeMetadatas, h.userStore)).Methods(http.MethodGet)
	router.HandleFunc("/resume_metadatas/{id:[0-9]+}/title", auth.WithJWTAuth(h.handleUpdateResumeMetadataTitle, h.userStore)).Methods(http.MethodPatch)
	router.HandleFunc("/resumes/{id:[0-9]+}", auth.WithJWTAuth(h.handleGetResume, h.userStore)).Methods(http.MethodGet)
	router.HandleFunc("/resumes", auth.WithJWTAuth(h.handleCreateResume, h.userStore)).Methods(http.MethodPost)
	router.HandleFunc("/resumes/{id:[0-9]+}", auth.WithJWTAuth(h.handleUpdateResume, h.userStore)).Methods(http.MethodPatch)
	router.HandleFunc("/resumes/{id:[0-9]+}", auth.WithJWTAuth(h.handleDeleteResume, h.userStore)).Methods(http.MethodDelete)
}

func (h *Handler) handleGetResumeMetadatas(w http.ResponseWriter, r *http.Request) {
	log.Println("handing get resume metadatas ..")
	defer func() {
		log.Println("finished getting resume metadatas ..")
	}()

	userID := auth.GetUserIDFromContext(r.Context())
	log.Printf("getting resume metadatas for user %d", userID)

	resumes, err := h.resumeStore.GetResumeMetadatasByUserID(userID)
	if err != nil {
		log.Printf("error getting resumes for user %d, %v", userID, err)
		utils.WriteError(w, fmt.Errorf("error getting resumes for user %d", userID), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string][]*types.ResumeMetadata{"resumeMetadatas": resumes})
}

func (h *Handler) handleUpdateResumeMetadataTitle(w http.ResponseWriter, r *http.Request) {
	log.Println("handling update resume metadata title..")
	defer func() {
		log.Println("finished updating resume metadata title..")
	}()

	titlePayload := UpdateResumeMetadataTitlePayload{}
	err := utils.ParseJSON(r, &titlePayload)
	if err != nil {
		log.Printf("error parsing request json, %v", err)
		utils.WriteError(w, err, http.StatusBadRequest)
		return
	}

	err = utils.Validate.Struct(titlePayload)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		log.Printf("error validating reqest payload, %+v", errors)
		utils.WriteError(w, fmt.Errorf("invalid payload %+v", errors), http.StatusBadRequest)
		return
	}

	log.Printf("updating resume metadata title with request payload %+v", titlePayload)

	vars := mux.Vars(r)
	resumeMetadataID, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Printf("error converting resumeMetadataID param to int: %v", err)
		utils.WriteError(w, fmt.Errorf("error converting resumeMetadataID param to int: %v", err), http.StatusInternalServerError)
		return
	}

	newResumeMetadata := types.ResumeMetadata{
		ID:        resumeMetadataID,
		Title:     titlePayload.Title,
		UpdatedAt: time.Now(),
	}
	err = h.resumeStore.UpdateResumeMetadataTitle(&newResumeMetadata)
	if err != nil {
		log.Printf("error updating resume metadata %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "resume updated successfully"})
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

func (h *Handler) handleCreateResume(w http.ResponseWriter, r *http.Request) {
	log.Println("handing create resume ..")
	defer func() {
		log.Println("finished creating resume ..")
	}()

	resumePayload := CreateResumePayload{}
	err := utils.ParseJSON(r, &resumePayload)
	if err != nil {
		log.Printf("error parsing request json, %v", err)
		utils.WriteError(w, err, http.StatusBadRequest)
		return
	}

	err = utils.Validate.Struct(resumePayload)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		log.Printf("error validating reqest payload, %+v", errors)
		utils.WriteError(w, fmt.Errorf("invalid payload %+v", errors), http.StatusBadRequest)
		return
	}

	log.Printf("creating resume with request payload %+v", resumePayload)

	newResume := types.Resume{
		TemplateName: resumePayload.TemplateName,
		Data:         resumePayload.Data,
	}
	err = h.resumeStore.CreateResume(&newResume)
	if err != nil {
		log.Printf("error creating new resume %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	// create image from base64 encoded pdf file from request payload, put it in s3
	// fileBytes, err := utils.DecodeBase64(resumePayload.File)
	// if err != nil {
	// 	log.Printf("error decoding base64 file, %v", err)
	// 	utils.WriteError(w, err, http.StatusInternalServerError)
	// 	return
	// }

	// finalImagePath, err := utils.FileBinaryToImagePath(fileBytes)
	// if err != nil {
	// 	log.Printf("error converting binary file to image, %v", err)
	// 	utils.WriteError(w, err, http.StatusInternalServerError)
	// 	return
	// }

	// s3ImageURL, err := utils.UploadImageToS3(finalImagePath)
	// if err != nil {
	// 	log.Printf("error uploading image to S3, %v", err)
	// 	utils.WriteError(w, fmt.Errorf("error uploading thumbnail to storage: %v", err), http.StatusInternalServerError)
	// 	return
	// }

	// create resume metadata with newResume.ID and s3 image link
	userID := auth.GetUserIDFromContext(r.Context())
	newResumeMetadata := types.ResumeMetadata{
		Title:        resumePayload.Title,
		ResumeID:     newResume.ID,
		UserID:       userID,
		ThumbnailURL: "", // TODO
	}
	err = h.resumeStore.CreateResumeMetadata(&newResumeMetadata)
	if err != nil {
		log.Printf("error creating new resume metadata %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{"message": "resume created successfully", "createdResumeID": newResume.ID})
}

func (h *Handler) handleUpdateResume(w http.ResponseWriter, r *http.Request) {
	log.Println("handling update resume ..")
	defer func() {
		log.Println("finished updating resume ..")
	}()

	resumePayload := UpdateResumePayload{}
	err := utils.ParseJSON(r, &resumePayload)
	if err != nil {
		log.Printf("error parsing request json, %v", err)
		utils.WriteError(w, err, http.StatusBadRequest)
		return
	}

	err = utils.Validate.Struct(resumePayload)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		log.Printf("error validating reqest payload, %+v", errors)
		utils.WriteError(w, fmt.Errorf("invalid payload %+v", errors), http.StatusBadRequest)
		return
	}

	log.Printf("updating resume with request payload %+v", resumePayload)

	vars := mux.Vars(r)
	resumeID, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Printf("error converting resumeID param to int: %v", err)
		utils.WriteError(w, fmt.Errorf("error converting resumeID param to int: %v", err), http.StatusInternalServerError)
		return
	}
	newResume := types.Resume{
		ID:           resumeID,
		TemplateName: resumePayload.TemplateName,
		Data:         resumePayload.Data,
		UpdatedAt:    time.Now(),
	}
	err = h.resumeStore.UpdateResumeByID(&newResume)
	if err != nil {
		log.Printf("error updating resume %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	userID := auth.GetUserIDFromContext(r.Context())
	newResumeMetadata := types.ResumeMetadata{
		ResumeID:  newResume.ID,
		UserID:    userID,
		UpdatedAt: time.Now(),
	}

	log.Printf("updating resume metadata with request payload %+v", newResumeMetadata)

	err = h.resumeStore.UpdateResumeMetadataUpdatedAt(&newResumeMetadata)
	if err != nil {
		log.Printf("error updating resume metadata %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "resume updated successfully"})
}

func (h *Handler) handleDeleteResume(w http.ResponseWriter, r *http.Request) {
	log.Println("handing delete resume ..")
	defer func() {
		log.Println("finished delete resume ..")
	}()

	vars := mux.Vars(r)
	resumeID, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Printf("error converting resumeID param to int: %v", err)
		utils.WriteError(w, fmt.Errorf("error converting resumeID param to int: %v", err), http.StatusInternalServerError)
		return
	}

	// also deletes resume metadata as it cascades by table definition
	err = h.resumeStore.DeleteResumeByID(resumeID)
	if err != nil {
		log.Printf("error delete resume %v", err)
		utils.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	log.Printf("resume with ID %d deleted successfully", resumeID)
	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "resume deleted successfully"})
}

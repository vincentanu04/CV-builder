package types

import "time"

// SchemaVersion constants for the resume data field.
const (
	SchemaVersionLegacy = 1 // ordered JSON array produced by toOrderedJSON
	SchemaVersionV2     = 2 // flexible sections JSON
)

type UserPlan string

const (
	FreePlan UserPlan = "free"
	MidPlan  UserPlan = "mid"
	ProPlan  UserPlan = "pro"
)

type User struct {
	ID       int      `json:"id"`
	Email    string   `json:"email"`
	Password string   `json:"password"`
	Plan     UserPlan `json:"plan"`
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(user *User) error
}

type ResumeMetadata struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	ResumeID  int       `json:"resume_id"`
	UserID    int       `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Resume struct {
	ID              int       `json:"id"`
	TemplateName    string    `json:"template_name"`
	Data            string    `json:"data"`
	TemplateVersion int       `json:"template_version"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type ResumeVersion struct {
	ID            int       `json:"id"`
	ResumeID      int       `json:"resume_id"`
	VersionNumber int       `json:"version_number"`
	Data          string    `json:"data"`
	Label         *string   `json:"label"`
	IsManual      bool      `json:"is_manual"`
	CreatedAt     time.Time `json:"created_at"`
}

type ResumeStore interface {
	GetResumeMetadatasByUserID(id int) ([]*ResumeMetadata, error)
	GetResumeByID(id int) (*Resume, error)
	CreateResume(resume *Resume) error
	CreateResumeMetadata(resumeMetadata *ResumeMetadata) error
	UpdateResumeByID(resume *Resume) error
	UpdateResumeMetadata(resumeMetadata *ResumeMetadata) error
	UpdateResumeMetadataTitle(resumeMetadata *ResumeMetadata) error
	UpdateResumeMetadataUpdatedAt(resumeMetadata *ResumeMetadata) error
	DeleteResumeByID(id int) error

	// Version history
	CreateResumeVersion(version *ResumeVersion) error
	GetLatestVersionNumber(resumeID int) (int, error)
	GetLatestAutoSaveVersion(resumeID int) (*ResumeVersion, error)
	UpdateResumeVersionData(versionID int, data string) error
	GetResumeVersionsByResumeID(resumeID int) ([]*ResumeVersion, error)
	GetResumeVersionByID(id int) (*ResumeVersion, error)
}

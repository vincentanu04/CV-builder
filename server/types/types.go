package types

import "time"

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
	ID           int       `json:"id"`
	TemplateName string    `json:"template_name"`
	Data         string    `json:"data"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
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
}

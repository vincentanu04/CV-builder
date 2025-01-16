package types

import "time"

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(user *User) error
}

type ResumeMetadata struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	ResumeID     int       `json:"resume_id"`
	UserID       int       `json:"user_id"`
	ThumbnailURL string    `json:"thumbnail_url"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Resume struct {
	ID           int       `json:"id"`
	TemplateName string    `json:"template_name"`
	Title        string    `json:"title"`
	Data         string    `json:"data"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ResumeStore interface {
	GetResumeMetadatasByUserID(id int) ([]*ResumeMetadata, error)
	GetResumeByID(id int) (*Resume, error)
}

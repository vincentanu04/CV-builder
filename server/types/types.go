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

type Resume struct {
	Int          int                    `json:"id"`
	UserID       int                    `json:"user_id"`
	TemplateName string                 `json:"template_name"`
	Data         map[string]interface{} `json:"data"`
	CreatedAt    time.Time              `json:"created_at"`
	UpdatedAt    time.Time              `json:"updated_at"`
}

type ResumeStore interface {
	GetResumesByUserID(id int) ([]Resume, error)
}

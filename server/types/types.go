package types

type User struct {
	ID int `json:"id"`
	Email string `json:"email"`
	Password string `json:"password"`
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(user *User) (error)
}

type Resume struct {}

type ResumeStore interface {
	GetResumesByUserID(id int) ([]Resume, error)
}

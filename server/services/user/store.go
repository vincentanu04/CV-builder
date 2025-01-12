package user

import "database/sql"

type Store struct {
	db *sql.DB
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
}

type User struct {
	ID int `json:"id"`
	Email string `json:"email"`
	Password string `json:"password"`
}

func NewStore(db *sql.DB) *Store {
	return &Store{
		db: db,
	}
}

func (s *Store) GetUserByEmail(email string) (*User, error) {
	return &User{}, nil
}
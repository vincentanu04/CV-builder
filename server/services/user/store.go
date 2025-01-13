package user

import (
	"database/sql"
	"fmt"
)

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
	rows, err := s.db.Query("SELECT * FROM users WHERE email = ?", email)
	if err != nil {
		return nil, err
	}

	u := &User{}
	for rows.Next() {
		u, err = scanRowsIntoUser(rows)
		if err != nil {
			return nil, err
		}
	}

	if u.ID == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return u, nil
}

func scanRowsIntoUser(rows *sql.Rows) (*User, error) {
	u := &User{}

	err := rows.Scan(
		&u.ID,
		&u.Email,
		&u.Password,
	)	
	if err != nil {
		return nil, err
	}

	return u, nil
}
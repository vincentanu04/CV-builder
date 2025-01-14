package user

import (
	"database/sql"
	"fmt"
	"log"
)

type Store struct {
	db *sql.DB
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	CreateUser(user *User) (error)
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

func (s *Store) CreateUser(user *User) (error) {
	log.Printf("db: creating user %+v ..", *user)

	defer func() {
		log.Println("finished creating user ..")
	}()

	result, err := s.db.Exec("INSERT INTO users (email, password) VALUES (?, ?)", user.Email, user.Password)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	user.ID = int(id) 
	return nil
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
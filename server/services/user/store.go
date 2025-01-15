package user

import (
	"database/sql"
	"fmt"
	"log"
	"server/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{
		db: db,
	}
}

func (s *Store) GetUserByEmail(email string) (*types.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE email = ?", email)
	if err != nil {
		return nil, err
	}

	u := &types.User{}
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

func (s *Store) GetUserByID(id int) (*types.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE id = ?", id)
	if err != nil {
		return nil, err
	}

	u := &types.User{}
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

func (s *Store) CreateUser(user *types.User) error {
	if user == nil {
		return fmt.Errorf("expecting user pointer")
	}

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

func scanRowsIntoUser(rows *sql.Rows) (*types.User, error) {
	u := &types.User{}

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

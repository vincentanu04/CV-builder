package resume

import (
	"database/sql"
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

func (s *Store) GetResumesByUserID(id int) ([]types.Resume, error) {
	return []types.Resume{}, nil
}

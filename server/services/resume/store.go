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

func (s *Store) GetResumeMetadatasByUserID(id int) ([]types.ResumeMetadata, error) {
	return []types.ResumeMetadata{}, nil
}

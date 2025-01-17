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

func (s *Store) GetResumeMetadatasByUserID(userID int) ([]*types.ResumeMetadata, error) {
	query := `SELECT id, title, resume_id, user_id, thumbnail_url, created_at, updated_at 
	          FROM resume_metadatas WHERE user_id = ?`
	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	metadatas := []*types.ResumeMetadata{}
	for rows.Next() {
		metadata, err := scanRowsIntoResumeMetadata(rows)
		if err != nil {
			return nil, err
		}

		metadatas = append(metadatas, metadata)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return metadatas, nil
}

func (s *Store) GetResumeByID(id int) (*types.Resume, error) {
	query := `SELECT id, template_name, title, data, created_at, updated_at 
	          FROM resumes WHERE id = ?`
	row := s.db.QueryRow(query, id)

	resume, err := scanRowIntoResume(row)
	if err != nil {
		return nil, err
	}

	return resume, nil
}

func scanRowsIntoResumeMetadata(rows *sql.Rows) (*types.ResumeMetadata, error) {
	metadata := &types.ResumeMetadata{}
	err := rows.Scan(
		&metadata.ID,
		&metadata.Title,
		&metadata.ResumeID,
		&metadata.UserID,
		&metadata.ThumbnailURL,
		&metadata.CreatedAt,
		&metadata.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return metadata, nil
}

func scanRowIntoResume(row *sql.Row) (*types.Resume, error) {
	resume := &types.Resume{}
	err := row.Scan(
		&resume.ID,
		&resume.TemplateName,
		&resume.Title,
		&resume.Data,
		&resume.CreatedAt,
		&resume.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return resume, nil
}

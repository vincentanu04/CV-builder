package resume

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

func (s *Store) GetResumeMetadatasByUserID(userID int) ([]*types.ResumeMetadata, error) {
	query := `SELECT id, title, resume_id, user_id, created_at, updated_at 
	          FROM resume_metadatas WHERE user_id = $1`
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
	query := `SELECT id, template_name, data, created_at, updated_at 
	          FROM resumes WHERE id = $1`
	row := s.db.QueryRow(query, id)

	resume, err := scanRowIntoResume(row)
	if err != nil {
		return nil, err
	}

	return resume, nil
}

func (s *Store) CreateResume(resume *types.Resume) error {
	query := `INSERT INTO resumes (template_name, data) VALUES ($1, $2) RETURNING id`
	err := s.db.QueryRow(query, resume.TemplateName, resume.Data).Scan(&resume.ID)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) CreateResumeMetadata(resumeMetadata *types.ResumeMetadata) error {
	query := `INSERT INTO resume_metadatas (title, resume_id, user_id) VALUES ($1, $2, $3) RETURNING id`
	err := s.db.QueryRow(query, resumeMetadata.Title, resumeMetadata.ResumeID, resumeMetadata.UserID).Scan(&resumeMetadata.ID)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) UpdateResumeByID(resume *types.Resume) error {
	query := `UPDATE resumes SET template_name = $1, data = $2, updated_at = $3 WHERE id = $4`
	result, err := s.db.Exec(query, resume.TemplateName, resume.Data, resume.UpdatedAt, resume.ID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		log.Printf("No changes made to resume %d", resume.ID)
		return nil
	}

	return nil
}

func (s *Store) UpdateResumeMetadata(resumeMetadata *types.ResumeMetadata) error {
	query := `UPDATE resume_metadatas SET title = $1, updated_at = $2 WHERE resume_id = $3 AND user_id = $4`
	result, err := s.db.Exec(query, resumeMetadata.Title, resumeMetadata.UpdatedAt, resumeMetadata.ResumeID, resumeMetadata.UserID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		log.Printf("no rows updated for resume ID %d and user ID %d", resumeMetadata.ResumeID, resumeMetadata.UserID)
		return nil
	}

	return nil
}

func (s *Store) UpdateResumeMetadataTitle(resumeMetadata *types.ResumeMetadata) error {
	query := `UPDATE resume_metadatas SET title = $1, updated_at = $2 WHERE id = $3`
	result, err := s.db.Exec(query, resumeMetadata.Title, resumeMetadata.UpdatedAt, resumeMetadata.ID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		log.Printf("no rows updated for resumemetadata id %d", resumeMetadata.ID)
		return nil
	}

	return nil
}

func (s *Store) UpdateResumeMetadataUpdatedAt(resumeMetadata *types.ResumeMetadata) error {
	query := `UPDATE resume_metadatas SET updated_at = $1 WHERE resume_id = $2 AND user_id = $3`
	result, err := s.db.Exec(query, resumeMetadata.UpdatedAt, resumeMetadata.ResumeID, resumeMetadata.UserID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		log.Printf("no rows updated for resumemetadata id %d", resumeMetadata.ID)
		return nil
	}

	return nil
}

func (s *Store) DeleteResumeByID(id int) error {
	query := `DELETE FROM resumes WHERE id = $1`
	result, err := s.db.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no rows deleted for resume ID %d", id)
	}

	return nil
}

func scanRowsIntoResumeMetadata(rows *sql.Rows) (*types.ResumeMetadata, error) {
	metadata := &types.ResumeMetadata{}
	err := rows.Scan(
		&metadata.ID,
		&metadata.Title,
		&metadata.ResumeID,
		&metadata.UserID,
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
		&resume.Data,
		&resume.CreatedAt,
		&resume.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return resume, nil
}

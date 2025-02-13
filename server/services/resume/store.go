package resume

import (
	"database/sql"
	"encoding/json"
	"fmt"
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

func (s *Store) CreateResume(resume *types.Resume) error {
	jsonData, err := json.Marshal(resume.Data)
	if err != nil {
		return err
	}

	query := `INSERT INTO resumes (template_name, title, data) VALUES (?, ?, ?)`
	result, err := s.db.Exec(query, resume.TemplateName, resume.Title, jsonData)
	if err != nil {
		return err
	}

	resumeID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	resume.ID = int(resumeID)
	return nil
}

func (s *Store) CreateResumeMetadata(resumeMetadata *types.ResumeMetadata) error {
	query := `INSERT INTO resume_metadatas (title, resume_id, user_id, thumbnail_url) VALUES (?, ?, ?, ?)`
	result, err := s.db.Exec(query, resumeMetadata.Title, resumeMetadata.ResumeID, resumeMetadata.UserID, resumeMetadata.ThumbnailURL)
	if err != nil {
		return err
	}

	resumeMetadataID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	resumeMetadata.ID = int(resumeMetadataID)
	return nil
}

func (s *Store) UpdateResumeByID(resume *types.Resume) error {
	jsonData, err := json.Marshal(resume.Data)
	if err != nil {
		return err
	}

	query := `UPDATE resumes SET template_name = ?, title = ?, data = ? WHERE id = ?`
	result, err := s.db.Exec(query, resume.TemplateName, resume.Title, jsonData, resume.ID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no rows updated for resume %d", resume.ID)
	}

	return nil
}

func (s *Store) UpdateResumeMetadata(resumeMetadata *types.ResumeMetadata) error {
	query := `UPDATE resume_metadatas SET title = ?, thumbnail_url = ? WHERE resume_id = ? AND user_id = ?`
	result, err := s.db.Exec(query, resumeMetadata.Title, resumeMetadata.ThumbnailURL, resumeMetadata.ResumeID, resumeMetadata.UserID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no rows updated for resume ID %d and user ID %d", resumeMetadata.ResumeID, resumeMetadata.UserID)
	}

	return nil
}

func (s *Store) DeleteResumeByID(id int) error {
	query := `DELETE FROM resumes WHERE id = ?`
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
	var rawData []byte // Temporary variable to hold the JSON data as []byte

	err := row.Scan(
		&resume.ID,
		&resume.TemplateName,
		&resume.Title,
		&rawData,
		&resume.CreatedAt,
		&resume.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(rawData, &resume.Data); err != nil {
		return nil, err
	}

	return resume, nil
}

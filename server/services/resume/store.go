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
	query := `SELECT id, template_name, data, template_version, created_at, updated_at 
	          FROM resumes WHERE id = $1`
	row := s.db.QueryRow(query, id)

	resume, err := scanRowIntoResume(row)
	if err != nil {
		return nil, err
	}

	return resume, nil
}

func (s *Store) CreateResume(resume *types.Resume) error {
	query := `INSERT INTO resumes (template_name, data, template_version) VALUES ($1, $2, $3) RETURNING id`
	err := s.db.QueryRow(query, resume.TemplateName, resume.Data, resume.TemplateVersion).Scan(&resume.ID)
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
	query := `UPDATE resumes SET template_name = $1, data = $2, template_version = $3, updated_at = $4 WHERE id = $5`
	result, err := s.db.Exec(query, resume.TemplateName, resume.Data, resume.TemplateVersion, resume.UpdatedAt, resume.ID)
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
		&resume.TemplateVersion,
		&resume.CreatedAt,
		&resume.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return resume, nil
}

// --- Version history ---

func (s *Store) GetLatestVersionNumber(resumeID int) (int, error) {
	query := `SELECT COALESCE(MAX(version_number), 0) FROM resume_versions WHERE resume_id = $1`
	var latest int
	err := s.db.QueryRow(query, resumeID).Scan(&latest)
	return latest, err
}

func (s *Store) CreateResumeVersion(version *types.ResumeVersion) error {
	query := `
		INSERT INTO resume_versions (resume_id, version_number, data, label, is_manual)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at`
	return s.db.QueryRow(query,
		version.ResumeID,
		version.VersionNumber,
		version.Data,
		version.Label,
		version.IsManual,
	).Scan(&version.ID, &version.CreatedAt)
}

func (s *Store) GetResumeVersionsByResumeID(resumeID int) ([]*types.ResumeVersion, error) {
	query := `
		SELECT id, resume_id, version_number, data, label, is_manual, created_at
		FROM resume_versions
		WHERE resume_id = $1
		ORDER BY version_number DESC
		LIMIT 50`
	rows, err := s.db.Query(query, resumeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	versions := []*types.ResumeVersion{}
	for rows.Next() {
		v := &types.ResumeVersion{}
		err := rows.Scan(&v.ID, &v.ResumeID, &v.VersionNumber, &v.Data, &v.Label, &v.IsManual, &v.CreatedAt)
		if err != nil {
			return nil, err
		}
		versions = append(versions, v)
	}
	return versions, rows.Err()
}

func (s *Store) GetResumeVersionByID(id int) (*types.ResumeVersion, error) {
	query := `
		SELECT id, resume_id, version_number, data, label, is_manual, created_at
		FROM resume_versions WHERE id = $1`
	v := &types.ResumeVersion{}
	err := s.db.QueryRow(query, id).Scan(
		&v.ID, &v.ResumeID, &v.VersionNumber, &v.Data, &v.Label, &v.IsManual, &v.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return v, nil
}

// GetLatestAutoSaveVersion returns the most recent non-manual version created
// within the last 5 minutes.  The timestamp window is evaluated inside
// PostgreSQL so no server-side timezone arithmetic is needed.
func (s *Store) GetLatestAutoSaveVersion(resumeID int) (*types.ResumeVersion, error) {
	query := `
		SELECT id, resume_id, version_number, data, label, is_manual, created_at
		FROM resume_versions
		WHERE resume_id = $1
		  AND is_manual = false
		  AND created_at > NOW() - INTERVAL '5 minutes'
		ORDER BY version_number DESC LIMIT 1`
	v := &types.ResumeVersion{}
	err := s.db.QueryRow(query, resumeID).Scan(
		&v.ID, &v.ResumeID, &v.VersionNumber, &v.Data, &v.Label, &v.IsManual, &v.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return v, nil
}

func (s *Store) UpdateResumeVersionData(versionID int, data string) error {
	_, err := s.db.Exec(`UPDATE resume_versions SET data = $1 WHERE id = $2`, data, versionID)
	return err
}

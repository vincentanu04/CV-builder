-- Rollback migration 002

DROP INDEX IF EXISTS idx_resume_versions_created_at;
DROP INDEX IF EXISTS idx_resume_versions_resume_id;
DROP TABLE IF EXISTS resume_versions;
ALTER TABLE resumes DROP COLUMN IF EXISTS template_version;

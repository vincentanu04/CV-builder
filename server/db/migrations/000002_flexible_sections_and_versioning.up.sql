-- Migration 002: flexible sections and versioning support

-- Track data schema version: 1 = legacy ordered JSON, 2 = flexible sections
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS template_version INT NOT NULL DEFAULT 1;

-- Store resume snapshots for version history
CREATE TABLE IF NOT EXISTS resume_versions (
  id SERIAL PRIMARY KEY,
  resume_id INT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  data TEXT NOT NULL,
  label VARCHAR(255),
  is_manual BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(resume_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_created_at ON resume_versions(created_at DESC);

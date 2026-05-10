-- +goose Up
-- +goose StatementBegin

CREATE TYPE user_plan AS ENUM ('free', 'mid', 'pro');

CREATE TABLE user_tbl (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT         UNIQUE NOT NULL,
    password_hash TEXT         NOT NULL,
    plan          user_plan    NOT NULL DEFAULT 'free',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE resume_tbl (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID         NOT NULL REFERENCES user_tbl(id) ON DELETE CASCADE,
    title            TEXT         NOT NULL,
    template_name    TEXT         NOT NULL,
    template_version INT          NOT NULL DEFAULT 1,
    data             TEXT         NOT NULL DEFAULT '',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resume_tbl_user_id ON resume_tbl(user_id);

CREATE TABLE resume_version_tbl (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id      UUID         NOT NULL REFERENCES resume_tbl(id) ON DELETE CASCADE,
    version_number INT          NOT NULL,
    data           TEXT         NOT NULL,
    label          TEXT,
    is_manual      BOOLEAN      NOT NULL DEFAULT false,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (resume_id, version_number)
);

CREATE INDEX idx_resume_version_tbl_resume_id ON resume_version_tbl(resume_id);
CREATE INDEX idx_resume_version_tbl_created_at ON resume_version_tbl(created_at DESC);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS resume_version_tbl;
DROP TABLE IF EXISTS resume_tbl;
DROP TABLE IF EXISTS user_tbl;
DROP TYPE IF EXISTS user_plan;

-- +goose StatementEnd

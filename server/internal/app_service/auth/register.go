package auth

import (
	"context"
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/internal/deps"
	"cvbuilder/internal/mutation"
	"cvbuilder/internal/repository"
)

var (
	ErrEmailTaken   = errors.New("email already in use")
	ErrWeakPassword = errors.New("password must be at least 8 characters")
)

func Register(ctx context.Context, d deps.Deps, email, password string) (*model.UserTbl, string, error) {
	email = strings.TrimSpace(strings.ToLower(email))

	if len(password) < 8 {
		return nil, "", ErrWeakPassword
	}

	existing, err := repository.GetUserByEmail(ctx, d.DB, email)
	if err != nil {
		return nil, "", err
	}
	if existing != nil {
		return nil, "", ErrEmailTaken
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", err
	}

	user, err := mutation.InsertUser(ctx, d.DB, email, string(hash))
	if err != nil {
		return nil, "", err
	}

	token, err := generateToken(user.ID)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

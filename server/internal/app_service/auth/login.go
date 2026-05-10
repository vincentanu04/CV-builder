package auth

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"cvbuilder/generated/db/cvbuilder_db/public/model"
	"cvbuilder/internal/deps"
	"cvbuilder/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
)

func Login(ctx context.Context, d deps.Deps, email, password string) (*model.UserTbl, string, error) {
	user, err := repository.GetUserByEmail(ctx, d.DB, email)
	if err != nil {
		return nil, "", err
	}
	if user == nil {
		return nil, "", ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, "", ErrInvalidCredentials
	}

	token, err := generateToken(user.ID)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func generateToken(userID uuid.UUID) (string, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	expiresAt := time.Now().Add(24 * time.Hour)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID.String(),
		"exp":    expiresAt.Unix(),
	})

	return token.SignedString(secret)
}

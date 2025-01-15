package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func CreateJWT(secret []byte, userID int, expirationInSec int64) (string, error) {	
	expiresAt := time.Now().Add(time.Second * time.Duration(expirationInSec)).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"expiresAt": expiresAt,
	})

	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
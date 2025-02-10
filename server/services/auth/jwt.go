package auth

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"server/configs"
	"server/types"
	"server/utils"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userKey contextKey = "user"

func CreateJWT(secret []byte, userID int, expirationInSec int64) (string, error) {
	expiresAt := time.Now().Add(time.Second * time.Duration(expirationInSec)).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"exp":    expiresAt,
	})

	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func WithJWTAuth(handlerFunc http.HandlerFunc, userStore types.UserStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("authenticating user ..")
		defer func() {
			log.Println("finished authenticating user ..")
		}()

		tokenString := utils.GetTokenFromCookie(r)
		log.Printf("token obtained: %s", tokenString)

		token, err := validateJWT(tokenString)
		if err != nil {
			log.Printf("failed to validate token %v", err)
			permissionDenied(w)
			return
		}

		if !token.Valid {
			log.Println("invalid token")
			permissionDenied(w)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			log.Println("claims is not a map")
			permissionDenied(w)
		}

		log.Printf("claims %+v", claims)

		userIDClaim, ok := claims["userID"].(float64)
		if !ok {
			log.Printf("failed to assert userID to float64, is %v, %T", userIDClaim, userIDClaim)
			permissionDenied(w)
			return
		}

		userID := int(userIDClaim)

		u, err := userStore.GetUserByID(userID)
		if err != nil {
			log.Printf("failed to get user by id, %v", err)
			permissionDenied(w)
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, userKey, &types.User{ID: u.ID, Email: u.Email})
		r = r.WithContext(ctx)

		handlerFunc(w, r)
	}
}

func validateJWT(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) { // also checks for expiry through the exp claim
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(configs.Envs.JWTSecret), nil
	})
}

func permissionDenied(w http.ResponseWriter) {
	utils.WriteError(w, fmt.Errorf("permission denied"), http.StatusForbidden)
}

func GetUserIDFromContext(ctx context.Context) int {
	user, ok := ctx.Value(userKey).(*types.User)
	if !ok {
		return -1
	}

	return user.ID
}

func GetUserFromContext(ctx context.Context) *types.User {
	user, ok := ctx.Value(userKey).(*types.User)
	if !ok {
		return &types.User{}
	}

	return user
}

func SetAuthCookie(w http.ResponseWriter, tokenString string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "authToken",
		Value:    tokenString,
		HttpOnly: true,
		Secure:   true,                  // Set to true in production (HTTPS)
		SameSite: http.SameSiteNoneMode, // Allows cross-origin requests
		Path:     "/",
		Expires:  time.Now().Add(time.Duration(configs.Envs.JWTExpirationInSec) * time.Second),
	})
}

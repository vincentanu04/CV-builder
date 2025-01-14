package auth

import (
	"server/configs"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestJWT(t *testing.T) {
	t.Run("test CreateJWT", func(t *testing.T) {
		secret := []byte("secret")
		token, err := CreateJWT(secret, 1, configs.Envs.JWTExpirationInSec)
		if err != nil {
			t.Errorf("error creating jwt, %v", err)
		}

		assert.NotEmpty(t, token, "token should not be empty")
	})
}
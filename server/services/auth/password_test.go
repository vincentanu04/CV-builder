package auth

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHashPassword(t *testing.T) {
	password := "password"
	hashedPassword, err := HashPassword(password)
	if err != nil {
		t.Errorf("error hashing password, %v", err)
	}

	assert.NotEmpty(t, hashedPassword, "hashed password should not be empty")

	assert.NotEqual(t, hashedPassword, password, "hashed password should be different than password")
}

func TestComparePasswords(t *testing.T) {
	tests := []struct{
		name string
		password1 string
		password2 string
		shouldMatch bool
	}{
		{
			name: "password should match",
			password1: "password1",
			password2: "password1",
			shouldMatch: true,
		},
		{
			name: "password shouldnt match",
			password1: "password1",
			password2: "password2",
			shouldMatch: false,
		},
	}
	
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			hashedPassword1, err := HashPassword(test.password1)
			if err != nil {
				t.Fatalf(hashedPassword1)
			}
		
			matches := ComparePasswords(hashedPassword1, []byte(test.password2))

			assert.Equal(t, test.shouldMatch, matches, test.name)
		})
	}
}
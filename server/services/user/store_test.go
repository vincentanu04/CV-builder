package user

import (
	"fmt"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestGetUserByEmail(t *testing.T) {
	t.Run("should return appropriate user if found", func (t *testing.T)  {
		db, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("error creating mock db, %v", err)
		}
		defer db.Close()

		store := NewStore(db)

		mockUser := User{
			ID: 1,
			Email: "exists@example.com",
			Password: "hashed_password",
		}

		mock.ExpectQuery("SELECT \\* FROM users WHERE email = ?").
    	WithArgs("exists@example.com").
    	WillReturnRows(sqlmock.NewRows([]string{"id", "email", "password"}).
				AddRow(mockUser.ID, mockUser.Email, mockUser.Password))

		user, err := store.GetUserByEmail("exists@example.com")
		assert.NoError(t, err)
		assert.Equal(t, mockUser.ID, user.ID, "expected user ID to match")
		assert.Equal(t, mockUser.Email, user.Email, "expected user email to match")
		assert.Equal(t, mockUser.Password, user.Password, "expected user password to match")
	})

	t.Run("should return error if not found", func(t *testing.T) {
		db, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("error creating mock db, %v", err)
		}
		defer db.Close()

		store := NewStore(db)

		mock.ExpectQuery("SELECT \\* FROM users WHERE email = ?").
			WithArgs("nonexisting@example.com").
			WillReturnRows(sqlmock.NewRows([]string{"id, email, password"}))

		user, err := store.GetUserByEmail("nonexisting@example.com")

		assert.Equal(t, fmt.Errorf("user not found"), err)
		assert.Nil(t, user)
	})
}

func TestCreateUser(t *testing.T) {
	t.Run("successfully create user", func(t *testing.T) {
		db, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("error creating mock db, %v", err)
		}
		defer db.Close()

		newUserID := 1

		newUser := User{
			Email: "newuser@example.com",
			Password: "hashedPassword",
		}

		mock.ExpectExec("INSERT INTO users \\(email, password\\) VALUES \\(\\?, \\?\\)").
			WithArgs(newUser.Email, newUser.Password).
			WillReturnResult(sqlmock.NewResult(int64(newUserID), 1))

		store := NewStore(db)

		err = store.CreateUser(&newUser)

		assert.NoError(t, err)
		assert.Equal(t, newUserID, newUser.ID)
	})

	t.Run("empty user input", func(t *testing.T) {
    db, _, err := sqlmock.New()
    if err != nil {
        t.Fatalf("error creating mock db: %v", err)
    }
    defer db.Close()

    store := NewStore(db)

    err = store.CreateUser(nil)

    assert.Error(t, err, "expecting user pointer")
	})
}
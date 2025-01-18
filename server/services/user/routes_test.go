package user

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"server/services/auth"
	"server/types"
	"testing"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestHandleRegister(t *testing.T) {
	tests := []struct {
		name           string
		requestPayload UserRequestPayload
		mockSetup      func(store *MockUserStore)
		expectedStatus int
		expectingToken bool
	}{
		{
			name: "successfully register",
			requestPayload: UserRequestPayload{
				Email:    "doesntexist@example.com",
				Password: "password123",
			},
			mockSetup: func(store *MockUserStore) {
				store.On("GetUserByEmail", "doesntexist@example.com").Return((*types.User)(nil), fmt.Errorf("user not found"))
				store.On("CreateUser", mock.MatchedBy(func(user *types.User) bool {
					return user.Email == "doesntexist@example.com" && user.Password != ""
				})).Return(nil)
			},
			expectedStatus: http.StatusOK,
			expectingToken: true,
		},
		{
			name: "invalid email format",
			requestPayload: UserRequestPayload{
				Email:    "not-an-email",
				Password: "password123",
			},
			mockSetup:      func(store *MockUserStore) {},
			expectedStatus: http.StatusBadRequest,
			expectingToken: false,
		},
		{
			name: "invalid password format",
			requestPayload: UserRequestPayload{
				Email:    "anemail@example.com",
				Password: "under8",
			},
			mockSetup:      func(store *MockUserStore) {},
			expectedStatus: http.StatusBadRequest,
			expectingToken: false,
		},
		{
			name: "email already exists",
			requestPayload: UserRequestPayload{
				Email:    "existing@example.com",
				Password: "password123",
			},
			mockSetup: func(store *MockUserStore) {
				store.On("GetUserByEmail", "existing@example.com").Return(&types.User{Email: "existing@example.com"}, nil)
			},
			expectedStatus: http.StatusBadRequest,
			expectingToken: false,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			mockStore := MockUserStore{}

			test.mockSetup(&mockStore)

			userHandler := NewHandler(&mockStore)

			router := mux.NewRouter().PathPrefix("/api").Subrouter()
			userHandler.RegisterRoutes(router)

			body, err := json.Marshal(test.requestPayload)
			if err != nil {
				t.Fatalf("failed to marshal request: %v", err)
			}

			req, err := http.NewRequest("POST", "/api/register", bytes.NewReader(body))
			if err != nil {
				t.Fatalf("failed to create new http request: %v", err)
			}
			rr := httptest.NewRecorder()

			router.ServeHTTP(rr, req)

			assert.Equal(t, test.expectedStatus, rr.Code)

			if test.expectingToken {
				response := map[string]string{}
				err := json.Unmarshal(rr.Body.Bytes(), &response)
				if err != nil {
					t.Fatalf("failed to unmarshal http response %v", err)
				}

				token, exists := response["token"]
				assert.True(t, exists, "should contain token")
				assert.NotEmpty(t, token, "token should not be empty")
			}
		})
	}

}

func TestHandleLogin(t *testing.T) {
	tests := []struct {
		name           string
		email          string
		password       string
		mockSetup      func(store *MockUserStore)
		expectedStatus int
		expectingToken bool
	}{
		{
			name:     "successfully login",
			email:    "example@example.com",
			password: "password123",
			mockSetup: func(store *MockUserStore) {
				hashedPassword, _ := auth.HashPassword("password123")
				mockUser := types.User{ID: 1, Email: "example@example.com", Password: hashedPassword}
				store.On("GetUserByEmail", "example@example.com").Return(&mockUser, nil)
			},
			expectedStatus: http.StatusOK,
			expectingToken: true,
		},
		{
			name:           "invalid email format",
			email:          "not-an-email",
			password:       "password123",
			mockSetup:      func(store *MockUserStore) {},
			expectedStatus: http.StatusBadRequest,
			expectingToken: false,
		},
		{
			name:           "invalid password format",
			email:          "anemail@example.com",
			password:       "under8",
			mockSetup:      func(store *MockUserStore) {},
			expectedStatus: http.StatusBadRequest,
			expectingToken: false,
		},
		{
			name:     "user doesn't exist",
			email:    "doesntexist@example.com",
			password: "password123",
			mockSetup: func(store *MockUserStore) {
				store.On("GetUserByEmail", "doesntexist@example.com").Return((*types.User)(nil), fmt.Errorf("user not found"))
			},
			expectedStatus: http.StatusBadRequest,
			expectingToken: false,
		},
		{
			name:     "password doesn't match",
			email:    "example@example.com",
			password: "wrongPassword",
			mockSetup: func(store *MockUserStore) {
				hashedPassword, _ := auth.HashPassword("rightPassword")
				mockUser := types.User{ID: 1, Email: "example@example.com", Password: hashedPassword}
				store.On("GetUserByEmail", "example@example.com").Return(&mockUser, nil)
			},
			expectedStatus: http.StatusBadRequest,
			expectingToken: false,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			userStore := MockUserStore{}

			test.mockSetup(&userStore)

			userHandler := NewHandler(&userStore)

			router := mux.NewRouter().PathPrefix("/api").Subrouter()
			userHandler.RegisterRoutes(router)

			body, err := json.Marshal(UserRequestPayload{Email: test.email, Password: test.password})
			if err != nil {
				t.Fatalf("failed marshalling request, %v", err)
			}

			req, err := http.NewRequest("POST", "/api/login", bytes.NewReader(body))
			if err != nil {
				t.Fatalf("failed creating request, %v", err)
			}
			rr := httptest.NewRecorder()

			router.ServeHTTP(rr, req)

			assert.Equal(t, test.expectedStatus, rr.Code)

			if test.expectingToken {
				response := map[string]string{}
				err := json.Unmarshal(rr.Body.Bytes(), &response)
				if err != nil {
					t.Fatalf("failed unmarshalling response, %v", err)
				}

				token, exists := response["token"]
				assert.True(t, exists, "should contain token")
				assert.NotEmpty(t, token, "token should not be empty")
			}
		})
	}
}

type MockUserStore struct {
	mock.Mock
}

func (m *MockUserStore) GetUserByEmail(email string) (*types.User, error) {
	args := m.Called(email)
	return args.Get(0).(*types.User), args.Error(1)
}

func (m *MockUserStore) GetUserByID(id int) (*types.User, error) {
	args := m.Called(id)
	return args.Get(0).(*types.User), args.Error(1)
}

func (m *MockUserStore) CreateUser(user *types.User) error {
	args := m.Called(user)
	return args.Error(0)
}

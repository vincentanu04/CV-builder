package user

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockUserStore struct {
	mock.Mock
}

func (m *MockUserStore) GetUserByEmail(email string) (*User, error) {
	args := m.Called(email)
	return args.Get(0).(*User), args.Error(1)
}

func (m *MockUserStore) CreateUser(user *User) error {
	args := m.Called(user)
	return args.Error(0)
}

func TestHandleRegister(t *testing.T) {
	tests := []struct{
		name           string
		requestPayload UserRequest
		mockSetup      func(store *MockUserStore)
		expectedStatus int
		expectedToken  bool
	}{
		{
			name: "successfully register",
			requestPayload: UserRequest{
				Email: "doesntexist@example.com",
				Password: "hashedPassword123",
			},
			mockSetup: func(store *MockUserStore) {
				store.On("GetUserByEmail", "doesntexist@example.com").Return((*User)(nil), fmt.Errorf("user not found"))
				store.On("CreateUser", mock.Anything).Return(nil)
			},
			expectedStatus: http.StatusOK,
			expectedToken: true,
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

			if test.expectedToken {
				response := map[string]string{}
				err := json.Unmarshal(rr.Body.Bytes(), &response)
				if err != nil {
					t.Fatalf("failed to unmarshal http response %v", err)
				}

				_, exists := response["token"]
				assert.True(t, exists)
			}
		})
	}

}

// func TestHandleLogin(t *testing.T) {
// 	t.Run("", func(t *testing.T) {

// 	})
// }
package api

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"server/services/health"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

func TestAPIServer(t *testing.T) {
	db, _, err := sqlmock.New()
	if err != nil {
		t.Fatalf("error creating mock db, %v", err)
	}

	server := NewAPIServer(":8080", db)

	go func() {
		if err := server.Run(); err != nil {
			log.Fatalf("error running server, %v", err)
		}
	}()

	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		log.Fatalf("error creating new http request, %v", err)
	}
	rr := httptest.NewRecorder()

	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api").Subrouter()
	healthChecker := health.NewHandler()
	healthChecker.RegisterRoutes(subrouter)

	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	response := map[string]string{}
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("error unmarshalling response, %v", err)
	}
	healthStatus, ok := response["health"]

	assert.Equal(t, ok, true, "health found in response")
	
	t.Logf("Status: %s", healthStatus)
	assert.Equal(t, healthStatus, health.HEALTHY_STATUS)
}
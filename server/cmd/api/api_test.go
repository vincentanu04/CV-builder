package api

import (
	"encoding/json"
	"log"
	"net/http"
	"server/services/health"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestAPIServer(t *testing.T) {
	server := NewAPIServer(":8088", nil) 

	go func() {
		if err := server.Run(); err != nil {
			log.Fatalf("error running server, %v", err)
		}
	}()

	time.Sleep(100 * time.Millisecond)

	resp, err := http.Get("http://localhost:8088/api/health")
	if err != nil {
		t.Fatalf("failed to make request to server, %v", err)
	}
	defer resp.Body.Close()

	assert.Equal(t, http.StatusOK, resp.StatusCode)

	response := map[string]string{}
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		t.Fatalf("error unmarshalling response, %v", err)
	}

	healthStatus, ok := response["health"]
	assert.True(t, ok, "health found in response")
	log.Printf("Status: %v", healthStatus)
	assert.Equal(t, healthStatus, health.HEALTHY_STATUS)
}

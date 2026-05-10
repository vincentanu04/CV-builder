package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"
)

type client struct {
	requests    int
	windowStart time.Time
}

var (
	mu       sync.Mutex
	clients  = make(map[string]*client)
	rate     = 100
	interval = time.Minute
)

// RateLimit is a per-IP sliding window rate limiter (100 req/min).
func RateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, _, _ := net.SplitHostPort(r.RemoteAddr)

		mu.Lock()
		c, exists := clients[ip]
		if !exists || time.Since(c.windowStart) > interval {
			c = &client{requests: 1, windowStart: time.Now()}
			clients[ip] = c
		} else {
			c.requests++
		}
		count := c.requests
		mu.Unlock()

		if count > rate {
			http.Error(w, `{"message":"rate limit exceeded"}`, http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}

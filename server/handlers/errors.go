package handlers

type httpError struct {
	Message string
	StatusCode int
}

func (e httpError) Error() string {
	return e.Message
}
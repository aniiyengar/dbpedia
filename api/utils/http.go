
// General utilities for HTTP requests.

package utils

import (
    "fmt"
    "net/http"
)

func HttpAbort(w http.ResponseWriter, r *http.Request, status int, msg string) {
    w.WriteHeader(status)
    fmt.Fprintf(w, msg)
}

func HttpCors(h http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        headers := w.Header()
        headers.Add("Access-Control-Allow-Origin", "*")
        headers.Add("Access-Control-Allow-Headers", "GET, POST, OPTIONS")
        headers.Add("Vary", "Origin")
        headers.Add("Vary", "Access-Control-Request-Headers")
        h.ServeHTTP(w, r)
    })
}

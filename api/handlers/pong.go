
// Just to make sure we're live

package handlers

import (
    "fmt"
    "net/http"
)

type PongHandler struct {}

func (h PongHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path == "/api/ping" {
        // Signal that we're live
        fmt.Fprintf(w, "pong")
    } else {
        // Not gonna service other routes
        w.WriteHeader(404)
    }
}

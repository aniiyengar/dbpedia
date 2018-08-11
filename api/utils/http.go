
// General utilities+middleware for HTTP requests.

package utils

import (
    "fmt"
    "net/http"
    "io/ioutil"
    "bytes"
    "strings"
)

func Abort(w http.ResponseWriter, r *http.Request, status int, msg string) {
    w.WriteHeader(status)
    fmt.Fprintf(w, msg)
}

type Middleware func(http.Handler) http.Handler

func ComposeMiddleware(funcs []Middleware) Middleware {
    if len(funcs) == 0 {
        // Noop
        return func(h http.Handler) http.Handler {
            return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
                h.ServeHTTP(w, r)
            })
        }
    } else if len(funcs) == 1 {
        return funcs[0]
    } else {
        last := funcs[len(funcs) - 1]
        rest := ComposeMiddleware(funcs[:len(funcs) - 1])
        return func(h http.Handler) http.Handler {
            return rest(last(h))
        }
    }
}

// Middleware for CORS
func CORSMiddleware(h http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.Method == "OPTIONS" {
            headers := w.Header()
            headers.Add("Access-Control-Allow-Origin", "*")
            headers.Add("Access-Control-Allow-Headers", "GET, POST, OPTIONS")
            headers.Add("Vary", "Origin")
            headers.Add("Vary", "Access-Control-Request-Headers")
        } else {
            h.ServeHTTP(w, r)
        }
    })
}

// Middleware for request logging
func LoggerMiddleware(h http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        body, err := ioutil.ReadAll(r.Body)
        if err != nil {
            Error("Could not read request body. Error: %v", err)
            Abort(w, r, 400, "Could not read request body.")
            return
        }

        bodyString := string(body[:])

        // Compose log
        var request []string
        request = append(request, fmt.Sprintf("%v %v %v", r.Method, r.URL, r.Proto))
        request = append(request, fmt.Sprintf("Host: %v", r.Host))
        request = append(request, fmt.Sprintf("Body: %v", bodyString))
        for name, headers := range r.Header {
            for _, h := range headers {
                request = append(request, fmt.Sprintf("%v: %v", name, h))
            }
        }

        Debug(strings.Join(request, "\n"))

        // Mock io.ReadCloser for new request body
        r.Body = ioutil.NopCloser(bytes.NewBuffer(body))
        h.ServeHTTP(w, r)
    })
}


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

type Request struct {
    Url string
    Method string
    Data []byte
    Headers map[string]string
}

// Make requests (mainly to Dropbox).
func MakeRequest(
    url string,
    method string,
    data []byte,
    headers map[string]string,
) (*http.Response, error) {
    client := &http.Client{}
    req, err := http.NewRequest(
        strings.ToUpper(method),
        url,
        bytes.NewReader(data),
    )
    if err != nil {
        return &http.Response{}, err
    }

    for field, header := range headers {
        req.Header.Add(field, header)
    }

    resp, err := client.Do(req)
    if err != nil {
        return &http.Response{}, err
    }

    return resp, nil
}

// https://gist.github.com/montanaflynn/ea4b92ed640f790c4b9cee36046a5383
// Make requests in parallel bounded by CPU capability.

type ParallelRequestResponse struct {
    RequestIndex int // in case responses need to be ordered
    Response http.Response
    Error error
}

func MakeParallelRequests(reqs []Request, concurrencyLimit int) []ParallelRequestResponse {
    sem := make(chan struct{}, concurrencyLimit)
    results := make(chan *ParallelRequestResponse)

    defer func() {
        close(sem)
        close(results)
    }()

    for i, req := range reqs {
        go func(i int, req Request) {
            // Blocks semaphore channel until there is room
            // under bounded limit of requests
            sem <- struct{}{}

            resp, err := MakeRequest(
                req.Url,
                req.Method,
                req.Data,
                req.Headers,
            )

            results <- &ParallelRequestResponse{
                i, *resp, err,
            }

            // Unblock this request
            <- sem
        }(i, req)
    }

    var resultList []ParallelRequestResponse
    for {
        partialResult := <- results
        resultList = append(resultList, *partialResult)

        if len(resultList) == len(reqs) {
            break
        }
    }

    return resultList
}

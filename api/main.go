
package main

import (
    "fmt"
    "net/http"

    "github.com/aniiyengar/fbpedia/api/utils"
    "github.com/aniiyengar/fbpedia/api/handlers"
)

func main() {
    http.Handle("/api/fb/auth", utils.HttpCors(handlers.FbAuthHandler{}))

    fmt.Println("Listening on :9004")
    http.ListenAndServe(":9004", nil)
}

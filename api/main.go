
package main

import (
    "net/http"

    "github.com/aniiyengar/fbpedia/api/utils"
    "github.com/aniiyengar/fbpedia/api/handlers"
)

func main() {
    http.Handle("/api/fb_auth", utils.HttpCors(
        handlers.FbAuthHandler{},
    ))

    http.ListenAndServe(":9004", nil)
}

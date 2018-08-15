
// Just to make sure we're live

package handlers

import (
    "fmt"
    "net/http"

    "github.com/aniiyengar/dbpedia/api/dropbox"
    "github.com/aniiyengar/dbpedia/api/utils"
)

type PongHandler struct {}

func (h PongHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    shards, _ := dropbox.GetPageShards("satty")
    page, _ := dropbox.GetPageFromShards(shards)
    utils.Debug(page)
    if r.URL.Path == "/api/ping" {
        // Signal that we're live
        fmt.Fprintf(w, "pong")
    } else {
        // Not gonna service other routes
        w.WriteHeader(404)
    }
}

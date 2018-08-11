
package main

import (
    "os"
    "log"
    "net/http"

    "github.com/aniiyengar/fbpedia/api/utils"
    "github.com/aniiyengar/fbpedia/api/handlers"
)

func main() {
    if len(os.Args) != 2 {
        // Need to specify port
        log.Fatal("API: Must specify port")
    }

    port := os.Args[1]
    http.Handle("/api/fb/auth", utils.HttpCors(handlers.FbAuthHandler{}))
    http.Handle("/api/ping", utils.HttpCors(handlers.PongHandler{}))

    http.ListenAndServe(":" + port, nil)
}

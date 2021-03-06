
package main

import (
    "os"
    "net/http"

    "github.com/aniiyengar/dbpedia/api/utils"
    "github.com/aniiyengar/dbpedia/api/handlers"
)

var routes = map[string]http.Handler{
    "/api/dropbox/auth": handlers.DropboxAuthHandler{},
    "/api/ping": handlers.PongHandler{},
    "/api/write": handlers.WriteHandler{},
    "/api/read": handlers.ReadHandler{},
}

var middleware = []utils.Middleware{
    utils.CORSMiddleware,
    utils.LoggerMiddleware,
}

func main() {
    var port string
    if len(os.Args) != 2 {
        // Need to specify port
        port = "8004"
    } else {
        port = os.Args[1]
    }

    for route, handler := range routes {
        http.Handle(route, utils.ComposeMiddleware(middleware)(handler))
    }

    utils.Debug("Starting server on port " + port)
    http.ListenAndServe(":" + port, nil)
}

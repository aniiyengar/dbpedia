
// Reading from Dropbox.

package handlers

import (
    "net/http"
    "encoding/json"

    "github.com/aniiyengar/dbpedia/api/utils"
    "github.com/aniiyengar/dbpedia/api/dropbox"
)

type ReadHandler struct {}

func (h ReadHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    if r.Method == "GET" && r.URL.Path == "/api/read" {
        pageNames, ok := r.URL.Query()["name"]

        if !ok {
            utils.Abort(w, r, 400, "Request missing ?name= parameter")
            return
        }

        pageName := pageNames[0]

        type pageResponse struct {
            Title string `json:"page_name"`
            Data string `json:"page_data"`
        }

        pageData, err := dropbox.GetPageData(pageName)
        if err != nil {
            utils.Abort(w, r, 400, "Error retrieving page data.")
        }

        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(200)
        json.NewEncoder(w).Encode(pageResponse{
            Title: pageName,
            Data: pageData,
        })
    } else {
        w.WriteHeader(404)
    }
}

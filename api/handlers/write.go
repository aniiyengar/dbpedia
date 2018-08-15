
// Writing to Dropbox.

package handlers

import (
    "fmt"
    "net/http"
    "encoding/json"
    "strings"

    "github.com/aniiyengar/dbpedia/api/utils"
    "github.com/aniiyengar/dbpedia/api/dropbox"
)

type WriteHandler struct {}

func (h WriteHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    if r.Method == "POST" && r.URL.Path == "/api/write" {
        // When a user writes info, the API receives a JSON containing the
        // diffs (from diff_match_patch), page name, editor, and page hash.
        type writeRequest struct {
            PageName string `json:"page_name"`
            Diff string `json:"diff"`
            Editor string `json:"editor"`
            Hash string `json:"hash"`
        }

        var reqJson writeRequest
        err := json.NewDecoder(r.Body).Decode(&reqJson)
        if err != nil {
            utils.Error(err)
            utils.Abort(w, r, 500, "Could not decode JSON")
        } else {
            defer r.Body.Close()
        }

        // First, make sure the access token matches the editor's id.
        accountReqJson := []byte(`{"account_id": "` + reqJson.Editor + `"}`)
        resp, err := utils.MakeRequest(
            "https://api.dropboxapi.com/2/users/get_account",
            "POST",
            accountReqJson,
            map[string]string{
                "Authorization": r.Header.Get("Authorization"),
                "Content-Type": "application/json",
            },
        )

        if !strings.HasPrefix(resp.Status, "200") {
            utils.Abort(w, r, 401, "Unauthenticated request.")
            return
        }

        bearerStrings := strings.Split(r.Header.Get("Authorization"), "Bearer")
        authToken := strings.TrimSpace(bearerStrings[1])
        authToken = authToken

        err = dropbox.WriteStringToPageShard(
            reqJson.PageName,
            reqJson.Editor,
            reqJson.Diff,
            reqJson.Hash,
            authToken,
        )

        if err != nil {
            utils.Error(err)
            utils.Abort(w, r, 500, "Error writing to page.")
            return
        }

        // Don't really know what to put here
        w.WriteHeader(200)
        fmt.Fprint(w, "Write was successful.")
    } else {
        w.WriteHeader(404)
    }
}


// Dropbox authentication handler. Generates a Dropbox OAuth token.

package handlers

import (
    "net/http"
    "encoding/json"
    "bytes"

    "github.com/aniiyengar/dbpedia/api/utils"
    "github.com/aniiyengar/dbpedia/api/dropbox"
)

type DropboxAuthHandler struct {}

func (h DropboxAuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // Validate the request. Only POSTs can make it.
    if r.Method != "POST" {
        utils.Abort(w, r, 405, "Cannot POST /dropbox/auth")
        return
    }

    q := r.URL.Query()

    queryCode := q.Get("code")
    if queryCode == "" {
        // Auth code was not provided; abort request
        utils.Error("Invalid/missing auth code from Dropbox API")
        utils.Abort(w, r, 400, "Invalid/missing auth code")
        return
    }

    // Verify code and get access token from Dropbox
    dbSecret := utils.Config()["DROPBOX_CLIENT_SECRET"]
    dbClientId := utils.Config()["DROPBOX_CLIENT_ID"]

    reqString := "https://api.dropboxapi.com/oauth2/token?" +
        "client_id=" + dbClientId + "&" +
        "redirect_uri=" + "http://localhost:8005/dropbox_redirect" + "&" +
        "grant_type=" + "authorization_code" + "&" +
        "client_secret=" + dbSecret + "&" +
        "code=" + queryCode

    resp, err := http.Post(reqString, "application/json", bytes.NewReader([]byte{}))
    if err != nil {
        // Some error occurred making the request.
        utils.Error("Dropbox auth request failed")
        utils.Abort(w, r, 401, "Error authenticating code: Dropbox auth request failed")
        return
    }
    defer resp.Body.Close()

    type dropboxTokenResponse struct {
        AccessToken string `json:"access_token"`
        AccountId string `json:"account_id"`
    }

    var result dropboxTokenResponse
    err = json.NewDecoder(resp.Body).Decode(&result)
    if err != nil {
        // Error decoding JSON
        utils.Error("Could not decode JSON from Dropbox auth response")
        utils.Abort(w, r, 401, "Error authenticating code: Dropbox auth response decoding failed")
        return
    } else if result.AccessToken == "" {
        // No token received
        utils.Error("Dropbox auth response returned nil/blank token")
        utils.Abort(w, r, 401, "Error authenticating code: Dropbox auth returned blank token")
        return
    }

    type response struct {
        AccessToken string
        Username string
    }

    user, err := dropbox.GetUserFromToken(result.AccessToken, result.AccountId)
    if err != nil {
        // Error getting user info
        utils.Error("Error getting user info from Dropbox")
        utils.Abort(w, r, 401, "Error getting user info")
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response{
        AccessToken: result.AccessToken,
        Username: user.Name["given_name"].(string),
    })

    return
}

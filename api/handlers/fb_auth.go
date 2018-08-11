
// Facebook authentication handler. Generates a FB OAuth token.

package handlers

import (
    "fmt"
    "net/http"
    "encoding/json"

    "github.com/aniiyengar/fbpedia/api/utils"
    "github.com/aniiyengar/fbpedia/api/fb"
)

type FbAuthHandler struct {}

func (h FbAuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // Validate the request. Only POSTs can make it.
    if r.Method != "POST" {
        utils.Abort(w, r, 405, "Cannot POST /fb_auth")
        return
    }

    q := r.URL.Query()

    queryCode := q.Get("code")
    if queryCode == "" {
        // Auth code was not provided; abort request
        utils.Error("Invalid/missing auth code from FB API")
        utils.Abort(w, r, 400, "Invalid/missing auth code")
        return
    }

    // Verify code and get access token from FB
    fbSecret := utils.Config()["FB_CLIENT_SECRET"]
    fbClientId := utils.Config()["FB_CLIENT_ID"]

    reqString := fmt.Sprintf(
        "https://graph.facebook.com/v3.1/oauth/access_token?" +
            "client_id=%s&redirect_uri=%s&client_secret=%s&code=%s",
        fbClientId,
        "http://localhost:8005/fb_redirect",
        fbSecret,
        queryCode,
    )

    resp, err := http.Get(reqString)
    if err != nil {
        // Some error occurred making the request.
        utils.Error("FB auth request failed")
        utils.Abort(w, r, 401, "Error authenticating code: FB auth request failed")
        return
    }

    type fbTokenResponse struct {
        AccessToken string `json:"access_token"`
        TokenType string `json:"token_type"`
        ExpiresIn int `json:"expires_in"`
    }

    var result fbTokenResponse
    err = json.NewDecoder(resp.Body).Decode(&result)
    if err != nil {
        // Error decoding JSON
        utils.Error("Could not decode JSON from FB auth response")
        utils.Abort(w, r, 401, "Error authenticating code: FB auth response decoding failed")
        return
    } else if result.AccessToken == "" {
        // No token received
        utils.Error("FB auth response returned nil/blank token")
        utils.Abort(w, r, 401, "Error authenticating code: FB auth returned blank token")
        return
    }

    type response struct {
        AccessToken string
        UserId string
        UserName string
    }

    user, err := fb.GetUserFromToken(result.AccessToken)
    if err != nil {
        // Error getting user info
        utils.Error("Error getting user info from FB")
        utils.Abort(w, r, 401, "Error getting user info")
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response{
        AccessToken: result.AccessToken,
        UserId: user.Id,
        UserName: user.Name,
    })

    return
}

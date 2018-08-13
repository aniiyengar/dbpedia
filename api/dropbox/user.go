
// Utilities for Dropbox users.

package dropbox

import (
    "net/http"
    "encoding/json"
    "bytes"
)

type User struct {
    Id string
    Name map[string]interface{}
}

func GetUserFromToken(token string, accountId string) (User, error) {
    // Get the user's userId.
    accountRequestClient := &http.Client{}
    reqString := "https://api.dropboxapi.com/2/users/get_account"

    reqData := []byte("{ \"account_id\": \"" + accountId + "\" }")
    req, err := http.NewRequest("POST", reqString, bytes.NewReader(reqData))
    req.Header.Add("Content-Type", "application/json")
    req.Header.Add("Authorization", "Bearer " + token)
    resp, err := accountRequestClient.Do(req)
    defer resp.Body.Close()

    if err != nil {
        return User{}, err
    }

    type dropboxUserResponse struct {
        Name map[string]interface{} `json:"name"`
        Id string `json:"account_id"`
    }

    var result dropboxUserResponse
    err = json.NewDecoder(resp.Body).Decode(&result)
    if err != nil {
        return User{}, err
    }

    return User{
        Name: result.Name,
        Id: result.Id,
    }, nil
}

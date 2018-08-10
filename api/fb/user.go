
// Utilities for FB users.

package fb

import (
    "net/http"
    "encoding/json"
)

type User struct {
    Id string
    Name string
}

func GetUserFromToken(token string) (User, error) {
    // Get the user's userId.
    resp, err := http.Get(
        "https://graph.facebook.com/v3.1/me?" +
        "fields=name,id&" +
        "access_token=" + token,
    )
    if err != nil {
        return User{}, err
    }

    type fbUserResponse struct {
        Name string `json:"name"`
        Id string `json:"id"`
    }

    var result fbUserResponse
    err = json.NewDecoder(resp.Body).Decode(&result)
    if err != nil {
        return User{}, err
    }

    return User{
        Name: result.Name,
        Id: result.Id,
    }, nil
}

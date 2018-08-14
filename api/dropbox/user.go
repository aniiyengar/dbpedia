
// Utilities for Dropbox users.

package dropbox

import (
    "encoding/json"
    "errors"

    "github.com/aniiyengar/dbpedia/api/utils"
)

type User struct {
    Id string
    Name map[string]interface{}
}

type DropboxError struct {
    Error string `json:"error_summary"`
}

func GetUserFromToken(token string, accountId string) (User, error) {
    // Get the user's userId.
    reqData := []byte("{ \"account_id\": \"" + accountId + "\" }")

    resp, err := utils.MakeRequest(
        "https://api.dropboxapi.com/2/users/get_account",
        "POST",
        reqData,
        map[string]string{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
    )
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

func InitializeUser(token string, accountId string) error {
    // Creates a top-level folder dbpedia_data.
    centralToken := utils.Config()["DROPBOX_CENTRAL_ACCOUNT_TOKEN"]
    centralId := utils.Config()["DROPBOX_CENTRAL_ACCOUNT_ID"]

    // Create a shared folder
    reqData := []byte(`{
        "path": "/dbpedia_data:` + accountId + `"
    }`)
    resp, err := utils.MakeRequest(
        "https://api.dropboxapi.com/2/sharing/share_folder",
        "POST",
        reqData,
        map[string]string{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
    )

    if err != nil {
        utils.Error("Error creating shared folder for " + accountId)
        return err
    } else {
        defer resp.Body.Close()
    }

    type shareFolderResponse struct {
        FolderId string `json:"shared_folder_id"`
        Error string `json:"error_summary"`
    }
    var respJson shareFolderResponse
    err = json.NewDecoder(resp.Body).Decode(&respJson)
    if err != nil {
        utils.Error("Error decoding response body creating shared folder for " + accountId)
        return err
    }

    if respJson.Error != "" {
        utils.Error("Dropbox returned an error creating shared folder for " + accountId)
        return errors.New(respJson.Error)
    }

    folderId := respJson.FolderId
    utils.Debug(folderId)

    // Share the shareable folder with the central account.
    reqData = []byte(`{
        "shared_folder_id": "` + folderId + `",
        "members": [
            {
                "member": {
                    ".tag": "dropbox_id",
                    "dropbox_id": "` + centralId + `"
                },
                "access_level": "viewer"
            }
        ],
        "quiet": true,
        "custom_message": "Sharing with Pedia"
    }`)
    utils.Debug(string(reqData))
    resp, err = utils.MakeRequest(
        "https://api.dropboxapi.com/2/sharing/add_folder_member",
        "POST",
        reqData,
        map[string]string{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
    )
    if err != nil {
        utils.Error("Error sharing new folder for user " + accountId)
        return err
    } else {
        defer resp.Body.Close()
    }

    var shareError DropboxError
    err = json.NewDecoder(resp.Body).Decode(&shareError)
    if err != nil {
        utils.Error("Error decoding response data sharing new folder for user " + accountId)
        return err
    } else if shareError.Error != "" {
        utils.Error("Dropbox returned an error sharing new folder for user " + accountId)
        return errors.New(shareError.Error)
    }

    // Now mount the folder on the central account
    reqData = []byte(`{
        "shared_folder_id": "` + folderId + `"
    }`)
    resp, err = utils.MakeRequest(
        "https://api.dropboxapi.com/2/sharing/mount_folder",
        "POST",
        reqData,
        map[string]string{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + centralToken,
        },
    )
    if err != nil {
        return err
    } else {
        defer resp.Body.Close()
    }

    var mountError DropboxError
    err = json.NewDecoder(resp.Body).Decode(&shareError)
    if err != nil {
        return err
    } else if mountError.Error != "" {
        return errors.New(mountError.Error)
    }

    // Lastly, update our `dbpedia_index` to reflect we've
    // added a new user.
    err = AddUser(accountId)
    if err != nil {
        utils.Debug(err)
        return err
    }

    return nil
}

func CheckUserInitialized(accountId string) (bool, error) {
    indexData, err := GetIndex()
    if err != nil {
        utils.Error("Error getting index")
        return false, err
    }

    var initialized = false
    for _, userId := range indexData.Users {
        if userId == accountId {
            initialized = true
        }
    }

    return initialized, nil
}

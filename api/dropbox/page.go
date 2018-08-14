
// Functions for creating and editing pages.

package dropbox

import (
    "encoding/json"
    "io/ioutil"

    "github.com/aniiyengar/dbpedia/api/utils"
)

type Index struct {
    Users []string `json:"users"`
    Pages []string `json:"pages"`
}

// Get the dbpedia_index file on the central account.
// Returns a map from page name -> collaborators.
func GetIndex() (Index, error) {
    token := utils.Config()["DROPBOX_CENTRAL_ACCOUNT_TOKEN"]
    resp, err := utils.MakeRequest(
        "https://content.dropboxapi.com/2/files/download",
        "POST",
        []byte{},
        map[string]string{
            "Dropbox-API-Arg": "{ \"path\": \"/dbpedia_index.json\" }",
            "Authorization": "Bearer " + token,
        },
    )
    defer resp.Body.Close()

    readBytes, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        utils.Error("Error reading JSON for index")
        return Index{}, err
    }

    var result Index
    err = json.Unmarshal(readBytes, &result)
    if err != nil {
        utils.Error("Error decoding JSON for index")
        return Index{}, err
    }

    return result, nil
}

func AddUser(accountId string) error {
    indexData, err := GetIndex()

    var exists = false
    for _, userId := range indexData.Users {
        if userId == accountId {
            exists = true
        }
    }

    if exists {
        // User already exists; it's a sus no-op
        utils.Warning("User already exists in dbpedia_index: " + accountId)
        return nil
    }

    centralToken := utils.Config()["DROPBOX_CENTRAL_ACCOUNT_TOKEN"]

    jsonBytes, err := json.Marshal(indexData)
    reqJson := []byte(`{ "path": "/dbpedia_index.json", "mode": "overwrite", "mute": true }`)
    resp, err := utils.MakeRequest(
        "https://content.dropboxapi.com/2/files/upload",
        "POST",
        jsonBytes,
        map[string]string{
            "Content-Type": "application/octet-stream",
            "Dropbox-API-Arg": string(reqJson),
            "Authorization": "Bearer " + centralToken,
        },
    )

    if err != nil {
        return err
    } else {
        defer resp.Body.Close()
    }

    readBytes, err := ioutil.ReadAll(resp.Body)
    utils.Debug(string(readBytes))

    return nil
}

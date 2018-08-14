
// Utilities for the Index file.

package dropbox

import (
    "encoding/json"
    "io/ioutil"

    "github.com/aniiyengar/dbpedia/api/utils"
)

// Encodes the information in dbpedia_index.
type Index struct {
    Users []string `json:"users"`
    Pages map[string][]string `json:"pages"`
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


// Functions for creating and editing pages.

package dropbox

import (
    "encoding/json"
    "strings"
    "io/ioutil"
    "time"
    "strconv"
    "net/url"
    "errors"

    "github.com/aniiyengar/dbpedia/api/utils"
)

// A "page shard" is one editor's contribution to one page.
// It will have a certain number of edits.
type PageShard struct {
    PageName string
    Editor string
    Edits []PageEdit
}

// A page edit has a timestamp and associated diff
type PageEdit struct {
    PageName string     `json:"page_name"`
    Editor string       `json:"editor"`
    Timestamp string    `json:"timestamp"`
    Diff string         `json:"diff"`
}

// All this does is add page to index.
func AddPageToIndexIfNotExists(pageName string) error {
    indexData, err := GetIndex()
    if err != nil {
        return err
    }

    exists := false
    pageList := indexData.Pages
    for name, _ := range pageList {
        if strings.ToLower(name) == pageName {
            exists = true
            break
        }
    }

    if exists {
        // Nothing to do here.
        return nil
    } else {
        indexData.Pages[pageName] = []string{}
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

    return nil
}

// If a page exists, return the Page. Otherwise return Page{}.
func GetPageShards(pageName string) ([]PageShard, error) {
    // First, get the page from the index. If it doesn't exist,
    // return a blank Page.
    centralToken := utils.Config()["DROPBOX_CENTRAL_ACCOUNT_TOKEN"]
    indexData, err := GetIndex()
    if err != nil {
        return []PageShard{}, err
    }

    exists := false
    pageList := indexData.Pages
    for name, _ := range pageList {
        if strings.ToLower(name) == pageName {
            exists = true
            break
        }
    }

    if !exists {
        return []PageShard{}, nil
    }

    // If the page does exist, get the list of editors
    editors := indexData.Pages[pageName]
    var requestsToMake []utils.Request

    for _, editor := range editors {
        // The editor's contribution to the page will be in
        // /dbpedia_data:[dbid]/[pageName].
        fileName := "/dbpedia_data:" + editor + "/" + pageName
        newReq := utils.Request{
            Url: "https://content.dropboxapi.com/2/files/download",
            Method: "POST",
            Data: []byte{},
            Headers: map[string]string{
                "Authorization": "Bearer " + centralToken,
                "Dropbox-API-Arg": "{ \"path\": \"" + fileName + "\" }",
            },
        }
        requestsToMake = append(requestsToMake, newReq)
    }

    var reqResults []utils.ParallelRequestResponse
    reqResults = utils.MakeParallelRequests(requestsToMake, 8) // is this ok?

    // Turn each reqResult into a page shard
    var returnValue []PageShard
    for _, res := range reqResults {
        if res.Error != nil {
            return []PageShard{}, res.Error
        } else {
            defer res.Response.Body.Close()
        }

        resData, err := ioutil.ReadAll(res.Response.Body)
        if err != nil {
            return []PageShard{}, err
        }

        edits, err := BytesToPageEdits(resData)
        if err != nil {
            return []PageShard{}, err
        }

        pageShard := PageShard{
            PageName: pageName,
            Editor: editors[res.RequestIndex],
            Edits: edits,
        }
        returnValue = append(returnValue, pageShard)
    }

    return returnValue, nil
}

type pageEditSerialization struct {
    edits []PageEdit
}

// Turns page edits into data.
func PageEditsToBytes(edits []PageEdit) ([]byte, error) {
    var resultString string

    for _, edit := range edits {
        bts, err := PageEditToBytes(edit)
        if err != nil {
            return nil, err
        }

        resultString = resultString + string(bts)
    }

    return []byte(resultString), nil
}

// Turns data into list of page edits.
func BytesToPageEdits(data []byte) ([]PageEdit, error) {
    dataString := string(data)
    editStrings := strings.Split(dataString, "\n")
    var result []PageEdit

    for _, editString := range editStrings {
        // Each edit needs to first be url unescaped
        unescaped, err := url.QueryUnescape(editString)
        if err != nil {
            return []PageEdit{}, err
        }

        // Turn the unescaped string back to object
        var edit PageEdit
        err = json.Unmarshal([]byte(unescaped), &edit)
        if err != nil {
            return []PageEdit{}, err
        }

        result = append(result, edit)
    }

    return result, nil
}

// Turns one page edit into a byte array.
func PageEditToBytes(edit PageEdit) ([]byte, error) {
    // Turn the edit into JSON
    editJsonBytes, err := json.Marshal(edit)
    if err != nil {
        return nil, err
    }

    editJson := string(editJsonBytes)

    // Urlencode the JSON onto one line
    escaped := url.QueryEscape(editJson)

    return []byte(escaped + "\n"), nil
}

// Write to edit file.
func WriteStringToPageShard(pageName string, editor string, str string) error {
    ts := strconv.FormatUint(uint64(time.Now().UnixNano()), 10)
    centralToken := utils.Config()["DROPBOX_CENTRAL_ACCOUNT_TOKEN"]

    edit := PageEdit{
        PageName: pageName,
        Editor: editor,
        Timestamp: ts,
        Diff: str,
    }
    editBytes, err := PageEditToBytes(edit)
    if err != nil {
        return err
    }

    // Get the current file, append string, and reupload
    fileName := "/dbpedia_data:" + editor + "/" + pageName
    var shardExists = true

    // Get current file:
    resp, err := utils.MakeRequest(
        "https://content.dropboxapi.com/2/files/download",
        "POST",
        []byte{},
        map[string]string{
            "Authorization": "Bearer " + centralToken,
            "Dropbox-API-Arg": `{ "path": "` + fileName + `" }`,
        },
    )
    if err != nil {
        return err
    } else {
        defer resp.Body.Close()
    }

    currFileBody, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return err
    }

    // Get body; see if file exists
    var dbError DropboxError
    err = json.Unmarshal(currFileBody, &dbError)
    if err != nil {
        return err
    } else if strings.HasPrefix(dbError.Error, "path/not_found/") {
        // File not found; it's okay though
        shardExists = false
    } else if dbError.Error != "" {
        return errors.New(dbError.Error)
    }

    var currentShard string
    if shardExists {
        // currFileBody has the data
        currentShard = string(currFileBody)
    } else {
        currentShard = ""
    }

    newShard := currentShard + string(editBytes)

    // Finally write to page shard
    reqData := `{ "path": "` + fileName + `", "mode": "overwrite", "mute": true }`
    resp, err = utils.MakeRequest(
        "https://content.dropboxapi.com/2/files/upload",
        "POST",
        []byte(newShard),
        map[string]string{
            "Authorization": "Bearer " + centralToken,
            "Dropbox-API-Arg": reqData,
            "Content-Type": "application/octet-stream",
        },
    )
    if err != nil {
        return err
    } else {
        defer resp.Body.Close()
    }

    s, _ := ioutil.ReadAll(resp.Body)
    utils.Debug(string(s))

    return nil
}


// App-wide configuration. Loaded from ../conf.json

package utils

import (
    "sync"
    "os"
    "io/ioutil"
    "encoding/json"
)

type configType map[string]interface{}
var config configType
var once sync.Once

func Config() configType {
    // Efficient thread-safe singleton
    once.Do(func() {
        // Check if conf.json exists
        confJson, err := os.Open("./conf.json")
        if err != nil {
            Critical("API: Config file (conf.json) not found.")
        }

        // Read config file
        bytes, err := ioutil.ReadAll(confJson)
        if err != nil {
            Critical("API: Failed to read config file.")
        }

        // Load JSON into config map
        config := make(configType)
        err = json.Unmarshal(bytes, &config)
        if err != nil {
            Critical("API: Failed to marshal JSON from config object.")
        }
    })

    Debug("Configuration loaded from conf.json")
    return config
}

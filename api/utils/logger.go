
// Basic leveled logging utilities.

package utils

import (
    "fmt"
    "os"
    "time"
)

func colored(level string, text string) string {
    colors := map[string]string{
        "DEBUG": "\033[1;34m",
        "WARNING": "\033[1;33m",
        "ERROR": "\033[1;31m",
        "CRITICAL": "\033[1;35m",
        "WHITE": "\x1b[0m",
        "BOLD": "\033[1;0m",
    }
    color, ok := colors[level]
    if ok {
        return color + text + colors["WHITE"]
    } else {
        return colors["WHITE"] + text
    }
}

func logger(file *os.File, level string, args ...interface{}) {
    levelString := fmt.Sprintf("[%s]", level)
    timeString := fmt.Sprintf("[%s]", time.Now().Format(time.RFC822))
    logString := fmt.Sprint(args...)

    fmt.Fprintf(
        file,
        "%s %s %s\n",
        colored(level, levelString),
        colored(level, timeString),
        logString,
    )
}

func Debug(args ...interface{}) {
    logger(os.Stdout, "DEBUG", args...)
}

func Warning(args ...interface{}) {
    logger(os.Stderr, "WARNING", args...)
}

func Error(args ...interface{}) {
    logger(os.Stderr, "ERROR", args...)
}

// Has side-effect of panicking
func Critical(args ...interface{}) {
    logger(os.Stderr, "CRITICAL", args...)
    panic("")
}

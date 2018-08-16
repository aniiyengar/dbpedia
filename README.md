# dbpedia

**dbpedia** is a collaborative, distributed wiki built on top of Dropbox. It stores all its files by making HTTP calls to the Dropbox API, and doesn't touch a single database. It supports built-in edit conflict resolution, rich-text formatting with Markdown, chronological edit histories and reverts, and it only stores page diffs and hashes to an editor's Dropbox account. To learn more about how it works, go to https://wiki.aniruddh.co/about.

The app isn't stable now, but creating, editing and viewing pages works. A sample page looks like [this](https://wiki.aniruddh.co/w/ani).

## Running

To run a dev version, run `./scripts/dev.py`. The script runs `webpack-dev-server` and `go` on separate ports.

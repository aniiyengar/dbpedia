# About dbpedia

**dbpedia** is a distributed, collaborative wiki built on top of
the Dropbox API. It’s still in development.

## What it does:

dbpedia is a really simple wiki application. Users can create pages,
edit them collaboratively, and view past page edits, among other
things. Behind the scenes, dbpedia doesn’t store pages on its own
database; instead, it saves users’ page edits to their Dropbox account.

This is how dbpedia works:

1. When you first log in to dbpedia, the app creates a top-level folder on your Dropbox account called `dbpedia_data:[id]`, that it shares with a **central account** on Dropbox. It gets read-only access, so it can’t write/delete anything in your Dropbox without your authorization credentials.
2. At the same time, dbpedia also maintains an **index** with a list of all initialized Dropbox user IDs and the pages they’ve edited. This way, it’s able to find and retrieve pages quickly. Your public user ID is the only thing from your Dropbox account dbpedia stores.
3. When you create or edit a page, dbpedia writes a **diff**, some text describing the edits you made to that page, to your `dbpedia_data` folder (with your authorization). It also updates the central index to indicate that you’ve edited that page, to keep page retrieval fast.
4. When you navigate to a wiki page, dbpedia 1) finds all the users that have edited the page, 2) gets the relevant edit information from those users’ `dbpedia_data` folders, 3) splices those edits together to generate a Markdown string, and 4) renders the Markdown client-side. In effect, the data shown on one page could actually originate from multiple Dropbox accounts.

The app keeps a list of all the pages you create on a central repository located on its central Dropbox account. This is necessary, because making Dropbox API requests is slow, and storing a little extra data will speed up the process of gathering the necessary information to reconstruct the wiki pages.

## A technical overview:

Instead of being stored on one server/database, the wiki is stored across (potentially) lots of separate servers. It relies entirely on Dropbox as a persistence layer—abstracting away the difficult technical challenge of actually storing and maintaining large files securely. It serves a React frontend, which interfaces with dbpedia's Go-based REST API. The API makes requests to Dropbox's [HTTP API](https://www.dropbox.com/developers/documentation/http/overview), which handles reading, writing, and sharing files and folders.

The app constructs diffs using [Google's `diff-match-patch` library](https://github.com/google/diff-match-patch), and its [Go implementation `go-diff`](https://github.com/sergi/go-diff), which are really useful for creating compressed bits of text that optimally represent the edits that users make. Those edits get sent to the dbpedia API, which writes those edits inside the user's `dbpedia_data` folder. One user's edits to one page are stored in a single file, called a **page shard**, representing that user's contributions to the page's edit history. "Shard" probably isn't the best word for it—it's pretty likely a minority of users will contribute a majority of the edits, so the load isn't spread evenly across Dropboxes—but it does a good job of symbolizing the distributed nature of the wiki.

The page shard consists of a newline-delimited set of **edits**, first encoded into JSON, then URL-escaped to fit on a single line. Each edit contains the condensed edit diff, the page title, the editor of the file, the timestamp associated with the edit (on the API's clock), and a hash of the page data before the diff was applied.

The hash exists to solve edit conflicts; if two edits appear in sequence with inconsistent hashes, the second edit is discarded. Usually, this happens when User A loads a page, User B edits the page without User A refreshing, and then User A edits the page, sending the hash of the page before it was edited by User B. In User A's case, editing the page will force a reload, their edit will be discarded as an edit conflict, and they will see the up-to-date version of the page containing User B's edit.

## Source code

This is all on GitHub. To see how it works (and confirm it’s not doing anything weird with your data) you can view the source [here](https://github.com/aniiyengar/dbpedia). The app is written using Go and ES6, and the development and testing scripts are written in Python.

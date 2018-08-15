
import React from 'react';

export default class WikiAbout extends React.Component {
    render() {
        return (
            <div>
                <h1 className='dbp-wiki-title'>
                    About dbpedia...
                </h1>
                <p className='dbp-p'>
                    <b>dbpedia</b> is a distributed, collaborative wiki built on top of
                    the Dropbox API. It’s still in development.
                </p>

                <h2 className='dbp-wiki-title'>
                    What it does:
                </h2>
                <p className='dbp-p'>
                    dbpedia is a really simple wiki application. Users can create pages,
                    edit them collaboratively, and view past page edits, among other
                    things. Behind the scenes, dbpedia doesn’t store pages on its own
                    database; instead, it saves users’ page edits to their Dropbox account.
                </p>
                <p className='dbp-p'>
                    This is how dbpedia works:
                </p>
                <ol className='dbp-ol'>
                    <li className='dbp-li'>
                        When you first log in to dbpedia, the app creates a top-level
                        folder on your Dropbox account
                        called <span className='dbp-code'>dbpedia_data:[id]</span>, that it
                        shares with its own Dropbox account. It gets read-only access,
                        so it can’t write/delete anything in your Dropbox without your
                        authorization credentials.
                    </li>
                    <li className='dbp-li'>
                        At the same time, dbpedia also maintains an <b>index</b> with a list of all
                        initialized Dropbox user IDs and the pages they’ve edited. This way,
                        it’s able to find and retrieve pages quickly. Your public user ID
                        is the only thing from your Dropbox account dbpedia stores.
                    </li>
                    <li className='dbp-li'>
                        When you create or edit a page, dbpedia writes a <b>diff</b>, some text
                        describing the edits you made to that page, to
                        your <span className='dbp-code'>dbpedia_data</span> folder
                        (with your authorization). It also updates the central index to
                        indicate that you’ve edited that page, to keep page retrieval fast.
                    </li>
                    <li className='dbp-li'>
                        When you navigate to a wiki page, dbpedia 1) finds all the users that
                        have edited the page, 2) gets the relevant edit information from those
                        users’ <span className='dbp-code'>dbpedia_data</span> folders,
                        and 3) splices those edits together to
                        create the wiki page. This way, the data shown on one page could actually
                        originate from multiple Dropbox accounts.
                    </li>
                </ol>
                <p className='dbp-p'>
                    The app keeps a list of all the pages you create on a central repository
                    located on its central Dropbox account. This is necessary, because
                    making Dropbox API requests is slow, and storing a little extra data
                    will speed up the process of gathering the necessary information to
                    reconstruct the wiki pages.
                </p>

                <h2 className='dbp-wiki-title'>
                    A technical overview:
                </h2>
                <p className='dbp-p'>
                    Instead of being stored on one server/database, the
                    wiki is stored across (potentially) lots of separate servers.
                    It relies entirely on Dropbox
                    as a persistence layer&mdash;abstracting away the difficult technical
                    challenge of actually storing and maintaining large files securely. It
                    serves a React frontend, which interfaces with dbpedia's Go-based REST API.
                    The API makes requests to
                    Dropbox's <a
                        href="https://www.dropbox.com/developers/documentation/http/overview"
                        target="_blank">HTTP API</a>, which handles reading,
                    writing, and sharing files and folders.
                </p>
                <p className='dbp-p'>
                    The app constructs diffs
                    using <a
                        href="https://github.com/google/diff-match-patch"
                        target="_blank">
                        Google's <span
                            className='dbp-code'>
                            diff_match_patch
                        </span> library</a>,
                    and its <a
                        href="https://github.com/sergi/go-diff"
                        target="_blank">
                        Go implementation <span
                            className='dbp-code'>
                            go-diff
                        </span></a>,
                    which are really useful for creating compressed bits of text that optimally
                    represent the
                    edits that users make. Those edits get sent to the dbpedia API, which
                    writes those edits inside the
                    user's <span className='dbp-code'>dbpedia_data</span> folder. One user's
                    edits to one page are stored in a single file, called a <b>page shard</b>,
                    representing that user's contributions to the page's edit history.
                    "Shard" probably isn't the best word for it&mdash;it's pretty likely
                    a minority of users will contribute a majority of the edits,
                    so the load isn't spread evenly across Dropboxes&mdash;but it does a
                    good job of symbolizing the distributed nature of the wiki.
                </p>
                <p className='dbp-p'>
                    The page shard consists of a newline-delimited set of <b>edits</b>, first
                    encoded into JSON, then URL-escaped to fit on a single line. Each edit
                    contains the condensed edit diff, the page title, the editor of the file,
                    the timestamp associated with the edit (on the API's clock),
                    and a hash of the page data before the diff was applied.
                </p>
                <p className='dbp-p'>
                    The hash exists
                    to solve edit conflicts; if two edits appear in sequence with inconsistent
                    hashes, the second edit is discarded. Usually, this happens when User A
                    loads a page, User B edits the page without User A refreshing,
                    and then User A edits the page, sending the hash of the page
                    before it was edited by User B. In User A's case,
                    editing the page will force a reload, their edit will be discarded as
                    an edit conflict, and they will see the up-to-date version of the
                    page containing User B's edit.
                </p>
                <p className='dbp-p'>
                    Making lots of HTTP requests to Dropbox can be slow and costly; while
                    there is code to execute many requests in parallel, it doesn't
                    matter much when pages and edits get more complicated.
                    Additionally, the hash-based mechanism I used to solve edit conflicts
                    gets pretty restrictive when lots of edits are being made at once.
                    On top of that, any user who just edits or deletes
                    their <span className='dbp-code'>dbpedia_data</span> folder could corrupt
                    all pages that contain edits from that user. So, dbpedia isn't really
                    a viable wiki;
                    the <a href="https://ani.bz/r/l" target="_blank">many proposals</a> to
                    build decentralized Wikipedias haven't gone far either. That being said,
                    I think it's still an interesting one-off project to work on.
                </p>

                <h2 className='dbp-wiki-title'>
                    Source code:
                </h2>
                <p className='dbp-p'>
                    This is all on GitHub. To see how it works (and confirm it’s not
                    doing anything weird with your data) you can view the
                    source <a
                        href="https://github.com/aniiyengar/dbpedia"
                        target="_blank">here</a>.
                    The app is written using Go and ES6, and the development and
                    testing scripts are written in Python.
                </p>
            </div>
        )
    }
}

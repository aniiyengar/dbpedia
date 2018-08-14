
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
                    What does it do?
                </h2>
                <p className='dbp-p'>
                    dbpedia is a really simple wiki application. Users can create pages,
                    edit them collaboratively, and view past page edits, among other
                    things.
                </p>
                <p className='dbp-p'>
                    Most websites store their data on databases. They’re an easy, reliable
                    way of storing data locally. In many cases, shards of databases are spread
                    across servers, so that no single database server experiences a heavy load.
                    dbpedia, instead of storing the pages
                    on its own servers, hosts its pages on users’ Dropbox accounts.
                </p>
                <p className='dbp-p'>
                    When you log into the app for the first time, it <b>creates a folder</b> on
                    your Dropbox account; it then <b>shares that folder</b> with a central account
                    (owned by dbpedia). It makes sure that <b>access is read-only</b>.
                    We don’t look at any other data on your account. This access is necessary for
                    the app to work properly: when you create or edit a page, the app (with your
                    authorization) writes those edits, and some extra info, to your dbpedia folder.
                    (This also means that if you edit/delete your own dbpedia folder, it could get
                    corrupted and this site would be unable to build wiki pages correctly. Please
                    don’t spoil the party.)
                </p>
                <p className='dbp-p'>
                    The app also keeps a list of all the pages you create on a central repository
                    located on its central Dropbox account. This is necessary, because
                    making Dropbox API requests is slow, and storing a little extra data
                    will speed up the process of gathering the necessary information to
                    reconstruct the wiki pages.
                </p>
                <h2 className='dbp-wiki-title'>
                    What’s the point of this?
                </h2>
                <p className='dbp-p'>
                    There really isn’t one. Instead of being stored on one server/database, the
                    wiki is stored across (potentially) lots of separate servers, which is cool.
                    It relies entirely on Dropbox
                    as a persistence layer&mdash;abstracting away the difficult technical
                    challenge of actually storing and maintaining large files securely.
                </p>
                <p className='dbp-p'>
                    However, making HTTP requests to Dropbox can be slow and costly. Additionally,
                    there isn’t really a need for a decentralized wiki service;
                    the <a href="https://ani.bz/r/l" target="_blank">many attempts</a> to
                    build decentralized wikis in the past have failed. There’s also the issue
                    that anyone can just edit or delete their dbpedia folder and corrupt the whole
                    wiki. In all, it’s a pretty bad idea in practice, but I still think it’s
                    a cool idea to experiment with. I
                    built <a href="https://github.com/aniiyengar/twitterpedia" target="_blank">
                    something similar</a> a couple years ago using Twitter; it doesn’t work
                    anymore since Twitter closed off most of the API that I originally used.
                </p>
                <p className='dbp-p'>
                    This is all open source. To see how it works (and confirm it’s not
                    doing anything weird with your data) you can view the source
                    on <a href="https://github.com/aniiyengar/dbpedia" target="_blank">GitHub</a>.
                    The app is written using React and Go.
                </p>
            </div>
        )
    }
}

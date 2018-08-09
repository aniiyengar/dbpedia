
import React from 'react';

export default class extends React.Component {
    render() {
        return (
            <div>
                <h1 className='fp-wiki-title'>Welcome!</h1>
                <p className='fp-p'>
                    <b>fbpedia</b> is a user-editable wiki.
                </p>
                <p className='fp-p'>
                    List most wiki platforms, fbpedia users can edit pages, create new pages,
                    and view a page's edit history. Unlike most wiki platforms,
                    the pages aren't stored on our server; instead, they're encoded in
                    diffs that are posted to a Facebook group. To load a page, we make
                    requests to Facebook's Graph API, get all the diffs relevant to a page,
                    and reconstruct the page data from the diffs. To be an "editor" on
                    this wiki, all you need to do is login with Facebook.
                </p>
                <p className='fp-p'>
                    This project is totally experimental. It's not an attempt to subvert
                    Facebook's usage policies or abuse their platform; I just built it to
                    see if it was possible. The source code is hosted on GitHub; it's
                    written with React+Redux and Go with WebSockets.
                </p>
            </div>
        );
    }
};


import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class WikiHome extends React.Component {
    render() {
        let displayText;
        if (this.props.name) {
            displayText = `Welcome, ${this.props.name.split(' ')[0]}!`;
        } else {
            displayText = 'Welcome!'
        }

        return (
            <div>
                <h1 className='dbp-wiki-title'>
                    { displayText }
                </h1>
                <p className='dbp-p'>
                    <b>dbpedia</b> is a collaborative wiki. Development is in progress.
                </p>
                <p className='dbp-p'>
                    Like most wiki platforms, dbpedia users can edit pages, create new pages,
                    and view a page's edit history. Unlike most wiki platforms,
                    the pages aren't stored here; instead, they're encoded in
                    diffs that are uploaded to Dropbox. To load a page, we make
                    requests to Dropbox's folder API, get all the diffs relevant to a page,
                    and reconstruct the page data from the diffs. To be an editor, all you need
                    to do is <Link to='/login'>log in</Link> using your Dropbox account.
                </p>
                <p className='dbp-p'>
                    This project is totally experimental. The source code is hosted on GitHub; it's
                    written with React, Redux and Go.
                </p>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    name: state.auth.dropboxUsername,
});

export default connect(
    mapStateToProps,
    undefined,
)(WikiHome);


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
                    <b>dbpedia</b> is a user-editable wiki.
                </p>
                <p className='dbp-p'>
                    Like most wiki platforms, dbpedia users can edit pages, create new pages,
                    and view a page's edit history. Unlike most wiki platforms,
                    the pages aren't stored here; instead, they're encoded in
                    diffs that are posted
                    to <a href="https://www.facebook.com/groups/1004846313026482/" target="_blank">
                        this Facebook group
                    </a>. To load a page, we make
                    requests to Facebook's Graph API, get all the diffs relevant to a page,
                    and reconstruct the page data from the diffs. To be an editor, all you need
                    to do is <Link to='/login'>log in</Link>.
                </p>
                <p className='dbp-p'>
                    This project is totally experimental. It's not an attempt to subvert
                    Facebook's usage policies or abuse their platform; I just built it to
                    see if it was possible. The source code is hosted on GitHub; it's
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

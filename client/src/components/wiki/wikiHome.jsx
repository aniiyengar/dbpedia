
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
                    <strong>dbpedia</strong> is a collaborative wiki. Development is in progress.
                    Learn more <Link to='/about'>here</Link>.
                </p>
                <p className='dbp-p'>
                    To visit a page (or create one if it doesn't exist) go
                    to <span className='dbp-code'>https://wiki.aniruddh.co/w/[pagename]</span>.
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

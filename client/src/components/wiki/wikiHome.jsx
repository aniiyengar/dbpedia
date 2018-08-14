
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
                    Learn more <Link to='/about'>here</Link>.
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

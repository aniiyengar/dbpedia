
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'

class WikiNav extends React.Component {
    constructor(props) {
        super(props);

        this.getRightIcons = this.getRightIcons.bind(this);
    }

    getRightIcons() {
        if (this.props.loggedIn) {
            return [
                <div
                    key='nav-newpage'
                    className='dbp-wiki-nav-item dbp-wiki-nav-right'>
                    <FontAwesomeIcon icon={faPlus} />
                </div>,
                <div
                    key='nav-search'
                    className='dbp-wiki-nav-item dbp-wiki-nav-right'>
                    <FontAwesomeIcon icon={faSearch} />
                </div>,
            ]
        } else {
            return [
                <div
                    key='nav-search'
                    className='dbp-wiki-nav-item dbp-wiki-nav-right'>
                    <Link to='/login'>Login</Link>
                </div>
            ];
        }
    }

    render() {
        return (
            <div className='dbp-wiki-nav'>
                <div
                    className='dbp-wiki-nav-item dbp-wiki-nav-title'>
                    <Link to='/'>dbpedia</Link>
                </div>

                { this.getRightIcons() }

            </div>
        );
    }
};

const mapStateToProps = state => ({
    loggedIn: state.auth.dropboxAuthSecret !== '',
});

export default connect(
    mapStateToProps,
    undefined,
)(WikiNav);

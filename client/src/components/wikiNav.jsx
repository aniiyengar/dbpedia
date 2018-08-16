
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'

import {
    logout,
} from '../modules/auth';

class WikiNav extends React.Component {
    constructor(props) {
        super(props);

        this.getRightIcons = this.getRightIcons.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        this.props.logout();
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
                <div
                    key='nav-logout'
                    className='dbp-wiki-nav-item dbp-wiki-nav-right'>
                    <Link to='/' onClick={this.handleLogout}>Logout</Link>
                </div>
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
            <div>
                <div className='dbp-wiki-nav'>
                    <div
                        className='dbp-wiki-nav-item dbp-wiki-nav-title'>
                        <Link to='/'>dbpedia</Link>
                    </div>

                    { this.getRightIcons() }

                </div>
                <div className='dbp-wiki-nav-gradient'></div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    loggedIn: state.auth.dropboxAuthSecret !== '',
});

const mapDispatchToProps = dispatch => bindActionCreators({
    logout,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WikiNav);

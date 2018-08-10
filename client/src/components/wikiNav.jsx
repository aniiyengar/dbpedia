
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
                    className='fp-wiki-nav-item fp-wiki-nav-right'>
                    <FontAwesomeIcon icon={faPlus} />
                </div>,
                <div
                    key='nav-search'
                    className='fp-wiki-nav-item fp-wiki-nav-right'>
                    <FontAwesomeIcon icon={faSearch} />
                </div>,
            ]
        } else {
            return [
                <div
                    key='nav-search'
                    className='fp-wiki-nav-item fp-wiki-nav-right'>
                    <Link to='/login'>Login</Link>
                </div>
            ];
        }
    }

    render() {
        return (
            <div className='fp-wiki-nav'>
                <div
                    className='fp-wiki-nav-item fp-wiki-nav-title'>
                    <Link to='/'>fbpedia</Link>
                </div>

                { this.getRightIcons() }

            </div>
        );
    }
};

const mapStateToProps = state => ({
    loggedIn: state.auth.fbAuthSecret !== '',
});

export default connect(
    mapStateToProps,
    undefined,
)(WikiNav);

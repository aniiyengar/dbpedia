
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import WikiHome from './wiki/wikiHome';
import WikiPage from './wiki/wikiPage';
import WikiAbout from './wiki/wikiAbout';

import Login from './auth/login';
import DropboxRedirect from './auth/dropboxRedirect';

export default class extends React.Component {
    render() {
        return (
            <div className='dbp-wiki-wrapper'>

                <Switch>

                    <Route
                        exact
                        path='/'
                        component={ WikiHome } />

                    <Route
                        exact
                        path='/login'
                        component={ Login } />

                    <Route
                        exact
                        path='/about'
                        component={ WikiAbout } />

                    <Route
                        exact
                        path='/dropbox_redirect'
                        component={ DropboxRedirect } />

                    <Route
                        exact
                        path='/w/:title'
                        component={ WikiPage } />

                </Switch>
            </div>
        );
    }
};


import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import WikiHome from './wiki/wikiHome';
import WikiPage from './wiki/wikiPage';

import Login from './auth/login';
import FbRedirect from './auth/fbRedirect';

export default class extends React.Component {
    render() {
        return (
            <div className='fp-wiki-wrapper'>
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
                        path='/fb_redirect'
                        component={ FbRedirect } />

                    <Route
                        exact
                        path='/w/:title'
                        component={ WikiPage } />

                </Switch>
            </div>
        );
    }
};

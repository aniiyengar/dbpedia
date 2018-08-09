
import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WikiHome from './wiki/wikiHome';
import WikiPage from './wiki/wikiPage';

import Login from './auth/login';
import FbRedirect from './auth/fbRedirect';

class WikiMain extends React.Component {
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

export default withRouter(
    connect(undefined, undefined)(WikiMain)
);

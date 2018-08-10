
import React from 'react';
import { Provider } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import WikiNav from './wikiNav';
import WikiMain from './wikiMain';

import '../stylesheets/main';

class App extends React.Component {
    render() {
        return [
            <WikiNav key='wikiNav' />,
            <WikiMain key='wikiMain' />,
        ];
    }
};

export default withRouter(
    connect(undefined, undefined)(App)
);

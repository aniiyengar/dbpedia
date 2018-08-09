
import React from 'react';
import { Provider } from 'react-redux';

import WikiNav from './wikiNav';
import WikiMain from './wikiMain';

import '../stylesheets/main';

export default class extends React.Component {
    render() {
        return [
            <WikiNav key='wikiNav' />,
            <WikiMain key='wikiMain' />,
        ];
    }
};

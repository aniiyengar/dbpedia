
import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import history from './history';
import rootReducer from './modules';

const middleware = [
    thunk,
    routerMiddleware(history),
];

if (DBPEDIA_ENV === 'development') {
    middleware.push(logger);
}

const store = createStore(
    connectRouter(history)(rootReducer),
    JSON.parse(localStorage.getItem('state')) || {},
    compose(applyMiddleware(...middleware)),
);

const persistedState = state => {
    return {
        auth: state.auth,
    };
};

let lastCallTime;
store.subscribe(() => {
    let unset = false;
    if (!lastCallTime) {
        lastCallTime = (new Date()).getTime();
        unset = true;
    }
    if ((new Date()).getTime() - lastCallTime >= 500 || unset) {
        localStorage.setItem(
            'state',
            JSON.stringify(persistedState(store.getState())),
        );
    }
});

export default store;

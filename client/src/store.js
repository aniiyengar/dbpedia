
import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import history from './history';
import rootReducer from './modules';

const middleware = [
    thunk,
    routerMiddleware(history),
    logger,
];

export default createStore(
    connectRouter(history)(rootReducer),
    {},
    compose(applyMiddleware(...middleware)),
);

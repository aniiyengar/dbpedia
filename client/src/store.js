
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
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
    rootReducer,
    {},
    applyMiddleware(...middleware),
);


import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import page from './page';
import auth from './auth';

export default combineReducers({
    page,
    auth,
    router,
});


import { combineReducers } from 'redux';

import page from './page';
import auth from './auth';

export default combineReducers({
    page,
    auth,
});

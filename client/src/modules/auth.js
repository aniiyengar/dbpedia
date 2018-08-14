
import api from './api';

// Action type constants

export const DROPBOX_AUTH_REQUEST_SENT = 'AUTH::DROPBOX_AUTH_REQUEST_SENT';
export const DROPBOX_AUTH_REQUEST_SUCCESS = 'AUTH::DROPBOX_AUTH_REQUEST_SUCCESS';
export const DROPBOX_AUTH_REQUEST_FAIL = 'AUTH::DROPBOX_AUTH_REQUEST_FAIL';

// Initial state

export const authInitialState = {
    dropboxAuthSecret: '',
    dropboxUsername: '',
    dropboxAccountId: '',

    dropboxAuthRequestOut: false,
    dropboxAuthRequestError: null,
};

// Action creators

export const sendDropboxAuthRequest = (code, state) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: DROPBOX_AUTH_REQUEST_SENT,
        });

        api.post('/dropbox/auth?code=' + code)
        .then(({ data }) => {
            dispatch({
                type: DROPBOX_AUTH_REQUEST_SUCCESS,
                payload: data,
            });

            resolve();
        })
        .catch(err => {
            dispatch({
                type: DROPBOX_AUTH_REQUEST_FAIL,
                error: err,
            });

            reject();
        });
    });
};

// Reducer

export default (state = authInitialState, action) => {
    switch (action.type) {
        case DROPBOX_AUTH_REQUEST_SENT:
            return {
                ...state,
                dropboxAuthRequestOut: true,
            };
        case DROPBOX_AUTH_REQUEST_SUCCESS:
            return {
                ...state,
                dropboxAuthRequestOut: false,
                dropboxAuthSecret: action.payload.AccessToken,
                dropboxUsername: action.payload.Username,
                dropboxAccountId: action.payload.Id,
            };
        case DROPBOX_AUTH_REQUEST_FAIL:
            return {
                ...state,
                dropboxAuthRequestOut: false,
                dropboxAuthRequestError: action.error,
            };
        default:
            return state;
    }
};

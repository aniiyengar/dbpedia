
import api from './request';

// Action type constants

export const FB_AUTH_REQUEST_SENT = 'AUTH::FB_AUTH_REQUEST_SENT';
export const FB_AUTH_REQUEST_SUCCESS = 'AUTH::FB_AUTH_REQUEST_SUCCESS';
export const FB_AUTH_REQUEST_FAIL = 'AUTH::FB_AUTH_REQUEST_FAIL';

// Initial state

export const authInitialState = {
    fbAuthSecret: '',
    fbAuthRequestOut: false,
    fbAuthRequestError: null,
};

// Action creators

export const sendFbAuthRequest = (code, state) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: FB_AUTH_REQUEST_SENT,
        });

        api.get('/fb_auth?code=' + code + '?state=' + state)
        .then(({ data }) => {
            dispatch({
                type: FB_AUTH_REQUEST_SUCCESS,
                payload: data.AccessToken,
            });

            resolve();
        })
        .catch(err => {
            dispatch({
                type: FB_AUTH_REQUEST_FAIL,
                error: err,
            });

            reject();
        });
    });
};

// Reducer

export default (state = authInitialState, action) => {
    switch (action.type) {
        case FB_AUTH_REQUEST_SENT:
            return {
                ...state,
                fbAuthRequestOut: true,
            };
        case FB_AUTH_REQUEST_SUCCESS:
            return {
                ...state,
                fbAuthRequestOut: false,
                fbAuthSecret: action.payload,
            };
        case FB_AUTH_REQUEST_FAIL:
            return {
                ...state,
                fbAuthRequestOut: false,
                fbAuthRequestError: action.error,
            };
        default:
            return state;
    }
};

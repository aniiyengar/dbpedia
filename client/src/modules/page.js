
import api from './api';

// Action type constants

export const GET_PAGE_REQUEST_SENT = 'PAGE::GET_PAGE_REQUEST_SENT';
export const GET_PAGE_REQUEST_SUCCESS = 'PAGE::GET_PAGE_REQUEST_SUCCESS';
export const GET_PAGE_REQUEST_FAIL = 'PAGE::GET_PAGE_REQUEST_FAIL';

// Initial state

export const pageInitialState = {
    pageData: '',
    pageName: '',

    pageRequestOut: false,
    pageRequestError: null,
};

// Action creators

export const sendPageReadRequest = pageName => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: GET_PAGE_REQUEST_SENT,
        });

        api.get('/read?name=' + pageName)
        .then(({ data }) => {
            dispatch({
                type: GET_PAGE_REQUEST_SUCCESS,
                payload: data,
            });

            resolve();
        })
        .catch(err => {
            dispatch({
                type: GET_PAGE_REQUEST_FAIL,
                payload: err,
            });

            reject();
        });
    });
};

// Reducer

export default (state = pageInitialState, action) => {
    switch (action.type) {
        case GET_PAGE_REQUEST_SENT:
            return {
                ...state,
                pageRequestOut: true,
            }
        case GET_PAGE_REQUEST_SUCCESS:
            return {
                ...state,
                pageRequestOut: false,
                pageData: action.payload.page_data,
                pageName: action.payload.page_name,
                pageRequestError: null,
            };
        case GET_PAGE_REQUEST_FAIL:
            return {
                ...state,
                pageRequestOut: false,
                pageData: '',
                pageName: '',
                pageRequestError: action.payload.error,
            }
        default:
            return state;
    }
};

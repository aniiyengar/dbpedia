
import md5 from 'md5';
import dmp from 'diff-match-patch-node';

import api from './api';

// Action type constants

export const GET_PAGE_REQUEST_SENT = 'PAGE::GET_PAGE_REQUEST_SENT';
export const GET_PAGE_REQUEST_SUCCESS = 'PAGE::GET_PAGE_REQUEST_SUCCESS';
export const GET_PAGE_REQUEST_FAIL = 'PAGE::GET_PAGE_REQUEST_FAIL';

export const WRITE_PAGE_REQUEST_SENT = 'PAGE::WRITE_PAGE_REQUEST_SENT';
export const WRITE_PAGE_REQUEST_SUCCESS = 'PAGE::WRITE_PAGE_REQUEST_SUCCESS';
export const WRITE_PAGE_REQUEST_FAIL = 'PAGE::WRITE_PAGE_REQUEST_FAIL';

// Initial state

export const pageInitialState = {
    pageData: '',
    pageName: '',

    pageRequestOut: false,
    pageRequestError: null,

    pageWriteRequestOut: false,
    pageWriteRequestError: null,
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

export const sendPageWriteRequest = newText => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const currentPageData = getState().page.pageData;
        const hash = md5(currentPageData);
        const userId = getState().auth.dropboxAccountId;
        const token = getState().auth.dropboxAuthSecret;
        const pageName = getState().page.pageName;

        // Generate the diff.
        const diffs = dmp().diff_main(currentPageData, newText);
        dmp().diff_cleanupSemantic(diffs);

        const diffText = dmp().diff_toDelta(diffs);

        dispatch({
            type: WRITE_PAGE_REQUEST_SENT,
        });

        api.post('/write', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            data: {
                page_name: pageName,
                diff: diffText,
                editor: userId,
                hash,
            },
        })
        .then(({ data }) => {
            dispatch({
                type: WRITE_PAGE_REQUEST_SUCCESS,
                payload: data,
            });

            resolve();
        })
        .catch(err => {
            dispatch({
                type: WRITE_PAGE_REQUEST_FAIL,
                error: err,
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
                pageRequestError: action.error,
            }
        case WRITE_PAGE_REQUEST_SENT:
            return {
                ...state,
                pageWriteRequestOut: true,
            }
        case WRITE_PAGE_REQUEST_SUCCESS:
            return {
                ...state,
                pageWriteRequestOut: false,
                pageWriteRequestError: null,
                pageData: action.payload.page_data,
                pageName: action.payload.page_name,
            }
        default:
            return state;
    }
};

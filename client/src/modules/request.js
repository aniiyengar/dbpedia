
import axios from 'axios';

// No action creators/reducers, just a helper function for API calls

class API {
    constructor(baseUrl) {
        this.url = baseUrl;
    }

    get(endpoint, options) {
        return axios({
            ...options,
            method: 'get',
            url: this.url + endpoint,
        });
    }

    post(endpoint, options) {
        return axios({
            ...options,
            method: 'post',
            url: this.url + endpoint,
        });
    }

    put(endpoint, options) {
        return axios({
            ...options,
            method: 'put',
            url: this.url + endpoint,
        });
    }
};

export default new API('http://localhost:9004');

const axios = require('axios');

const defaultHeaders = {
    'Content-Type': 'application/json'
};

const sendGetRequest = (url, data = {}, additionalHeaders = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'GET',
                url,
                data,
                headers: { ...defaultHeaders, ...additionalHeaders }
            });
            resolve(response.data);
        } catch (err) {
            reject(err.response && err.response.data ? err.response.data : err.message);
        }
    });
}

const sendPostRequest = (url, data = {}, additionalHeaders = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'POST',
                url,
                data,
                headers: { ...defaultHeaders, ...additionalHeaders }
            });
            resolve(response.data);
        } catch (err) {
            reject(err.response && err.response.data ? err.response.data : err.message);
        }
    });
}

module.exports = {
    sendGetRequest,
    sendPostRequest
}

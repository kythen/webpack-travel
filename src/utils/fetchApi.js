import axios from 'axios';

export const callApi = (type, url, params = '', data = '') => {
    return axios({
        method: type,
        url,
        params,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true,
        data: data
    }).then(response => response.data);
};
import axios from 'axios';

export const callApi = (type, url, params = '', data = '', req={}) => {
    return axios({
        method: type,
        url,
        params,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true,
        data: data,
        cancelToken: new axios.CancelToken((c) => {
            req.cancel = c;
            req.a = this;
        })
    }).then(response => response.data);
};
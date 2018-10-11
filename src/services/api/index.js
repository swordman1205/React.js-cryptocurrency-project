import axios from 'axios';
import {API_URL} from '../../utils/config';
import apiError from './apiError';

axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');
const apiVersion = 'v0';

function getCookie(name) {
    let cookieValue = '';
    if (document.cookie && document.cookie != '') {
        let cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function createRequestPath(path, param = null, useApiVersion = true) {
    let paramStr = '';
    if (param) {
        let i = 0;
        for (const key in param) {
            const keyValue = `${key}=${param[key]}`;
            paramStr += i === 0 ? keyValue : `&${keyValue}`;
            i++;
        }
    }
    const defaultPath = useApiVersion ? `${apiVersion}${path}` : path;
    return paramStr ? `${defaultPath}?${paramStr}` : defaultPath;
}

function request(method = 'get', path, data = null, params = {}) {
    const requestPath = `${API_URL}${path}`;
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: requestPath,
            data: data,
            params: params,
        })
            .then((response) => {
                resolve({data: response.data});
            })
            .catch((error) => {
                apiError.parseHttpError(error).then(err => {
                    resolve(err);
                }).catch(err => {
                    reject(err);
                });
            });
    });
}

export function post(path = '', data = null, useVersion) {
    const url = createRequestPath(path, null, useVersion);
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    return request('post', url, formData);
}

export function del(path = '', data = null) {
    const url = createRequestPath(path, data);
    return request('delete', url, null);
}

export function put(path = '', data = null) {
    const url = createRequestPath(path);
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }
    return request('put', url, formData);
}


export function get(path = '', data = null,) {
    const url = createRequestPath(path);
    return request('get', url, null, data);
}

/****************************************
 * Gateway for all the api calls
 * implements get, post, put, delete calls
 ****************************************/

import GLOBAL from './../Constants/global.constants';
import { GetFireToken } from './../Utils/user.utils';

const defautlHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'App-Type': '313',
};

/**
 * Get call implementation
 * All get calls are made through this method
 * @param  {object} obj - contains url, params(optional){proccessed and attached to url}, 
 * headers(optional)
 */
export function Get(obj) {
    if (!(obj && obj.url)) {
        return false;
    }

    const params = getNecessaryParams(obj);
    return ApiCall(params);
}

/**
 * Post call implementation
 * All get calls are made through this method
 * @param  {object} obj - contains url, params(optional){proccessed and attached to url}, 
 * headers(optional), body(optional)
 */
export function Post(obj) {
    if (!(obj && obj.url)) {
        return false;
    }

    obj.method = 'POST';
    const params = getNecessaryParams(obj);
    return ApiCall(params);
}

/**
 * Put call implementation
 * All get calls are made through this method
 * @param  {object} obj - contains url, params(optional){proccessed and attached to url}, 
 * headers(optional), body(optional)
 */
export function Put(obj) {
    if (!(obj && obj.url)) {
        return false;
    }

    obj.method = 'PUT';
    const params = getNecessaryParams(obj);
    return ApiCall(params);
}

/**
* Delete call implementation
* All get calls are made through this method
* @param  {object} obj - contains url, params(optional){proccessed and attached to url}, 
* headers(optional)
*/
export function Delete(obj) {
    if (!(obj && obj.url)) {
        return false;
    }

    obj.method = 'DELETE';
    const params = getNecessaryParams(obj);
    return ApiCall(params);
}

/**
 * final level method to make api call
 * used for all kind of methods(get, put, post), except delete
 * @param  {string} {url
 * @param  {function} method
 * @param  {object} headers
 * @param  {function} resolve
 * @param  {function} reject}
 */
function ApiCall({ url, method, headers, body, resolve = defaultResolve, reject = defaultReject, params }) {
    const postDict = {
        headers, method
    };

    if (body) { // if body is attached
        postDict.body = body;
    }
    return fetch(url, { headers, body, method, params, credentials: 'include' })
        // .then((response) => {
        //     console.log('sfjsbhf', response);
        //     return resolve(response.json());
        // });
        .then((response) => response.json())
        .then((response) => {
            return resolve(response);
        })
        .catch((error) => {
            return reject(error);
        });
}


/**
 * prepares params for making api calls
 * including headers, url, params, resolve, reject
 * @param  {object} obj
 */
function getNecessaryParams(obj) {
    const url = createFinalUrl(obj);
    const method = obj.method || 'GET';
    const headers = createHeader(obj);

    const resolve = obj.hasOwnProperty('resolve') ? obj.resolve : resolve;
    const reject = obj.hasOwnProperty('reject') ? obj.reject : reject;

    const responseObj = {
        url, method, headers, resolve, reject
    };

    if (obj.body) {
        responseObj.body = JSON.stringify(obj.body);
    }
    return (responseObj);
}

/**
 * takes params along with end point, adds with prefix url and return final url
 * @param  {object} obj
 */
function createFinalUrl(obj) {
    // const url = GLOBAL.BASE_URL + obj.url;
    const url = (obj.urlPrefix || GLOBAL.API_HOST) + obj.url;
    return url;
}

/**
 * takes extra headers(optional) and extend with default header
 * @param  {object} obj
 */
function createHeader(obj) {
    const headers = defautlHeaders;

    const fireToken = GetFireToken();
    if (fireToken) {
        headers['Firebase-Id'] = fireToken;
    }
    // if headers are not passed
    if (!obj.headers) {
        return headers;
    }
    // extend default header options with one, passed with obj
    return { ...headers, ...obj.headers };
}

/**
 * default method to pass through on each success api call
 * @param  {object} response
 */
function defaultResolve(response) {
    return response;
}

/**
 * default method to pass through on each failure api call
 * @param  {object} response
 */
function defaultReject(response) {
    return response;
}

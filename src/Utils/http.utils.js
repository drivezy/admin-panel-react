/****************************************
 * Gateway for all the api calls
 * implements get, post, put, delete calls
 ****************************************/

import GLOBAL from './../Constants/global.constants';
import { GetFireToken } from './../Utils/user.utils';
import { IsUndefined, CheckInternet } from './../Utils/common.utils';
import { StoreEvent, SubscribeToEvent, IsEventAvailable } from './stateManager.utils';

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
    if (!CheckInternet()) {
        if (obj.persist) {
            const url = createFinalUrl(obj);
            SubscribeToEvent({ eventName: url, callback: obj.callback, objParams: obj.body, isMemoryStore: true, extraParams: obj.extraParams });
            if ((!obj.update) && IsEventAvailable({ eventName: url, isMemoryStore: true, objParams: obj.body })) {
                return;
            }
        } else {
            // OfflineNotification();
            return {};
        }
    }
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
    if (!CheckInternet()) {
        if (obj.persist) {
            const url = createFinalUrl(obj);
            SubscribeToEvent({ eventName: url, callback: obj.callback, objParams: obj.body, isMemoryStore: true, extraParams: obj.extraParams });
            if ((!obj.update) && IsEventAvailable({ eventName: url, isMemoryStore: true, objParams: obj.body })) {
                return;
            }
        } else {
            // OfflineNotification();
            return {};
        }
    }
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
* Upload file implementation
* All upload calls are made through this method
* @param  {object} obj - contains url, params(optional){proccessed and attached to url}, 
* headers(optional)
*/
export function Upload(url, file) {

    var formData = new FormData();
    formData.append('file', file);

    // const headers = createHeader({});


    return fetch(GLOBAL.API_HOST + url, { // Your POST endpoint
        method: 'POST',
        headers: {
            "Content-Type": "multipart/form-data",
            // 'admin-url': https://uatadmin.justride.in/#/modelDetails/42,
            'App-Type': 313,
            'App-Version': '1.0.1'
        },
        credentials: 'same-origin',
        body: formData
    }).then(
        response => response.json() // if the response is a JSON object
    ).then(
        success => console.log(success) // Handle the success response object
    ).catch(
        error => console.log(error) // Handle the error response object
    );
}


function StoreImageToAws(data, bookingId, type, nextIndex) {
    const { imagesArray, booking } = this.state;
    var photo = {
        uri: data,
        type: 'image/jpeg',
        name: 'file1' + nextIndex + '.jpg',
    };

    var formData = new FormData();
    formData.append('file', photo);

    return fetch(GLOBAL.BASE_URL + 'api/multipleUpload', {
        method: 'POST',
        headers: {
            'App-Type': GLOBAL.APP_ID,
            'Content-Type': 'multipart/form-data',
            'Firebase-Id': GLOBAL.FIRE_TOKEN
        },
        credentials: 'same-origin',
        body: formData
    })
        .then((response) => response.text())
        .then((responseText) => {
            var response = JSON.parse(responseText).response
            if (nextIndex < imagesArray.length) {
                this.StoreImageToAws(imagesArray[nextIndex], bookingId, type, nextIndex + 1)
            }
            return response[0].document_link
        })
        .catch((error) => {
            return ''
        });
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
function ApiCall({ url, method, headers, body, resolve = defaultResolve, reject = defaultReject, params, hideMessage, hideLoader, persist, callback, extraParams }) {
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
            return resolve(response, hideMessage, hideLoader, { url, body, persist, callback, extraParams });
        })
        .catch((error) => {
            return reject(error, hideMessage, hideLoader, { url, body, persist, callback, extraParams });
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
        url, method, headers, resolve, reject, hideMessage: obj.hideMessage || false, persist: obj.persist || false, callback: obj.callback, extraParams: obj.extraParams
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
function defaultResolve(response, hideMessage, hideLoader, { persist, url, body, callback, extraParams }) {
    if (!hideLoader) { // stop loader
        // @TODO end loader
    }
    // if response contains string, show same in message bar
    if (response && response.response == 'Request not authorized') {
        // @TODO clear navigation stack and send to login page
    } else if (!hideMessage && response && typeof response == 'object' && (typeof response.response == 'string' || typeof response.reason == 'string')) {
        const type = response.success ? 'success' : 'error';
        // @TODO show message -response.response
    }
    if (persist && !CheckInternet()) {
        StoreEvent({ eventName: url, data: response, objParams: body, isMemoryStore: true });
        // SubscribeToEvent({ eventName, callback, objParams: body, isMemoryStore: true });
    } else if (typeof callback == 'function') {
        callback(response, { eventName: url, extraParams });
    }
    return response;
}

/**
 * default method to pass through on each failure api call
 * @param  {object} response
 */
function defaultReject(response, hideMessage, hideLoader) {
    if (!hideLoader) { // stop loader
        // @TODO end loader
    }
    let message = null;
    // if response contains string, show same in message bar
    if (!hideMessage && response && typeof response == 'object') {
        if (response.response == 'string') {
            message = response.message;
        } else if (response.reason == 'string') {
            message = response.reason;
        }
        if (message) {
            // @TODO show error message - message
        }
    }
    return response;
}
/*
Implements utility functions to be used across project
*/
import _ from 'lodash';

/**
 * Check for internet connection
 * @todo as of now method returns true, implement method properly
 */
export function CheckInternet() {
    return true;
}

/**
 * returns matched option from array against mentioned attribute value(in case of array of objects)
 * or element(in case of plain array)
 * @param  {array} hayStack - array
 * @param  {} needle - value
 * @param  {string} element - attribute name
 * @param  {int} defaultElement - if element not found, returns element of default index
 */
export function SelectFromOptions(hayStack, needle, element, defaultElement, shouldNotSendDefaultElement) {
    defaultElement = defaultElement || 0;
    const isArray = IsUndefinedOrNull(element);
    for (let i in hayStack) {
        if (isArray) {
            if (hayStack[i] == needle)
                return hayStack[i];
        } else {
            if (hayStack[i][element] == needle)
                return hayStack[i];
        }
    }

    if (!shouldNotSendDefaultElement) {
        const finalElement = hayStack[defaultElement];

        return finalElement || hayStack[0];
    }
    return null;
}

export function IsUndefinedOrNull(value) {
    return value == null || value === '';
}

export function IsUndefined(value) {
    return typeof value == 'undefined';
    // return value === '';
}

export function isMobile() {
    const mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    return mobile;
}

/**
 * Converts array to object
 * @param  {Array} array
 * @param  {string} key (optional)
 */
// Array.prototype.ArrayToObject = function (key) {
export function ArrayToObject(array, key) {
    // const array = this;
    const obj = {};

    array.forEach((element, index) => {
        if (!key) {
            obj[index] = element;
        } else if ((element && typeof element == 'object' && element[key])) {
            obj[element[key]] = element;
        }
    });
    return obj;
}

export function CopyToClipBoard(text) {
    const temp = document.createElement("textarea");
    temp.innerHTML = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
}

/**
 * Checks if two given objects are same 
 * NOTE: Mainly used in persitance for identifying if two params are same
 * @param  {object} object
 * @param  {object} otherObject
 */
export function IsEqualObject(object, otherObject) {
    return _.isEqual(object, otherObject);
}

/**
 * query params in generic utils methods have by default ' and ' prefix
 * this method remove that prefix 
 * Used Before making api call, 
 * @param  {object} options
 */
export function TrimQueryString(options) {
    if (options.query && typeof options.query == 'string') {
        options.query = options.query.replace(/^ and /, '');
    } else {
        delete options.query;
    }
    return options;
}

/**
 * Accepts various params as object and prepare url for get call
 * @param  {string} url
 * @param  {object} params
 */
export function BuildUrlForGetCall(url, params) {
    let newUrl = url + "?";
    for (const i in params) {
        const value = params[i];
        if (value) {
            newUrl += i + "=" + value + "&";
        }
    };
    return newUrl.slice(0, -1);
}

/**
 * Returns true if object is having keys
 * false if object is empty 
 * @param  {Object} obj
 */
export function IsObjectHaveKeys(obj) {
    return obj && typeof obj == 'object' && Object.keys(obj).length;
}

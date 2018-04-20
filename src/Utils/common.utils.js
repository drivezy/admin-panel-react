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

export function isMobile() {
    const mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    return mobile;
}

/**
 * Converts array to object
 * @param  {Array} array
 * @param  {string} key (optional)
 */
Array.prototype.ArrayToObject = function (key) {
    const array = this;
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

/**
 * Checks if two given objects are same 
 * NOTE: Mainly used in persitance for identifying if two params are same
 * @param  {object} object
 * @param  {object} otherObject
 */
export function IsEqualObject(object, otherObject) {
    return _.isEqual(object, otherObject);
}

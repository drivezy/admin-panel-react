/**************************************************
 * Implements Location service same as angular have
 *************************************************/

/**
 * takes search string and converts to corresponding object
 * @param  {string} searchString=''
 */
export function GenerateObjectFromUrlParams(searchString = '') {
    var search = searchString.substring(1);
    return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : {};
}

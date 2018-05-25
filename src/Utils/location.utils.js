/**************************************************
 * Implements Location service same as angular have
 *************************************************/
// import History from './history.utils';
import createBrowserHistory from 'history/createBrowserHistory';

/**
 * takes search string and converts to corresponding object
 * @param  {string} searchString=''
 * e.x. ?query=menu_id=5 returns { menu_id: "5" }
 */
export function GenerateObjectFromUrlParams(searchString) {
    // let search = '';
    // if (searchString.includes('?query=')) {
    //     search = searchString.replace('?query=', '');
    // }
    // if (search.charAt(0) == '?') {
    //     search = search.substring(1);
    // }
    // try {
    //     return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    //         function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : {};
    // } catch (e) {
    //     console.log(e)
    //     return {};
    // }   
    // console.log((searchString).replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0]);
    if (searchString) {
        return (searchString).replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split(/=(.+)/), this[n[0]] = n[1], this }.bind({}))[0];
        // return (searchString).replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
    } else {
        return {};
    }
}

export function SerializeObj(obj) {
    const queryString = Object.entries(obj).map(i => [i[0], encodeURIComponent(i[1])].join('=')).join('&');
    if (queryString) {
        return `?${queryString}`
    }
}

export function GetUrlParams(props) {
    return {
        queryString: GenerateObjectFromUrlParams(decodeURIComponent(props.location.search)),
        params: props.match.params
    }
}

export class Location {
    historyFetchMethod;

    static getHistoryMethod(method) {
        this.historyFetchMethod = method;
    }
    
    /**
     * used to get and set query strings
     * if obj is empty, works as getter, else as setter
     * @param  {object} obj - object params to be set as query param
     * @param  {boolean} reset=false}={} - if true, overrides existing query else extend previous query
     */
    static search(obj, {  reset = false } = {}) {
        const location = window.location;
        let urlParams = GenerateObjectFromUrlParams(decodeURIComponent(location.search))

        if (!obj) {
            return urlParams;
        }

        const { history: History } = this.historyFetchMethod();
        const finalObj = {};

        Object.keys(obj).forEach((key) => {
            if (obj[key] == null && urlParams[key]) { // if any attribute is null, will remove from existing query
                delete urlParams[key];
            } else {
                finalObj[key] = obj[key];
            }
        });

        urlParams = reset ? { ...{}, finalObj } : { ...urlParams, ...finalObj };

        if (!Object.keys(urlParams).length || (!Object.keys(finalObj).length)) {
            History.push(location.pathname);
            // History.push(props.match.url);
            return;
        }
        if (History) {
            const queryUrl = SerializeObj(urlParams);
            History.push(queryUrl);
        }
    }

    /**
     * used for navigating to different routes
     * @param  {string} {url}
     * @param  {string} {method} - used to select method for navigation, can be push, pop, replace
     */
    static navigate({ url, method = 'push' }) {
        const { history: History } = this.historyFetchMethod();
        History[method](url);
    }
}
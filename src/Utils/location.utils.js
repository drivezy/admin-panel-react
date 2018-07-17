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
    // let urlParams = GenerateObjectFromUrlParams(decodeURIComponent(props.location.search));
    // let hash = window.location.hash.replace('#', '');

    // if (hash) {
    //     urlParams = urlParams[hash] ? JSON.parse(urlParams[hash]) : {};
    // }
    return {
        queryString: Location.search(),
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
    static search(obj, { reset = false } = {}) {
        const location = window.location;
        let hash = window.location.hash.replace('#', '');
        let urlParams = GenerateObjectFromUrlParams(decodeURIComponent(location.search))

        if (hash) {
            urlParams = urlParams[hash] ? JSON.parse(urlParams[hash]) : {};
        }
        if (!obj) {
            hash = window.location.hash.replace('#', '');
            // if (hash) {
            //     const params = urlParams[hash] ? JSON.parse(urlParams[hash]) : {};
            //     console.log(params);
            //     return params;
            // }
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
            let obj = {};
            // obj = urlParams;
            if (hash) {
                obj[hash] = JSON.stringify(urlParams);
            } else {
                obj = urlParams;
            }
            let queryUrl = SerializeObj(obj);
            if (hash) {
                queryUrl = queryUrl + '#' + hash;
            }
            History.push(queryUrl);
        }
    }

    /**
     * used for navigating to different routes
     * @param  {string} {url}
     * @param  {string} {method} - used to select method for navigation, can be push, goBack (for pop operation), replace
     */
    static navigate({ url, method = 'push' }) {
        const { history: History } = this.historyFetchMethod();
        History[method](url);
    }

    static back() {
        if (window.history.length > 2) {
            // if history is not empty, go back:
            this.navigate({ method: 'goBack' });
        } else {
            // go home:
            this.navigate({ method: 'push', url: '/' });
        }
    }
}
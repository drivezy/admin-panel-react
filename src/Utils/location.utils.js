/**************************************************
 * Implements Location service same as angular have
 *************************************************/

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
        return (searchString).replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
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
        queryString: GenerateObjectFromUrlParams(props.location.search),
        params: props.match.params
    }
}

export class Location {
    static search(obj, { props = {}, reset = false } = {}) {
        if (!props.location) {
            props.location = window.location;
        }
        let urlParams = GenerateObjectFromUrlParams(props.location.search)
        if (!(obj && Object.keys(obj).length)) {
            return urlParams;
        }

        urlParams = reset ? { ...{}, obj } : { ...urlParams, ...obj };
        if (props.history) {
            const queryUrl = SerializeObj(urlParams);
            props.history.push(props.match.url + queryUrl);
        }
    }
}
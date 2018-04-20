/**************************************************
 * Implements Location service same as angular have
 *************************************************/

/**
 * takes search string and converts to corresponding object
 * @param  {string} searchString=''
 * e.x. ?query=menu_id=5 returns { menu_id: "5" }
 */
export function GenerateObjectFromUrlParams(searchString = '') {
    let search = '';
    if(searchString.includes('?query=')) { 
        search = searchString.replace('?query=', '');
    }
    if(search.charAt(0) == '?') { 
        search = search.substring(1);
    }
    try {
        return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
            function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : {};
    } catch (e) { 
        console.log(e)
        return {};
    }
}
    
export function GetUrlParams(props) {
    // return match.params;
    return {
        queryString: GenerateObjectFromUrlParams(props.location.search),
        params: props.match.params
    }
}
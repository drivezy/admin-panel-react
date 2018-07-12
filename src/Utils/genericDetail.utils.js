import { IsUndefinedOrNull, BuildUrlForGetCall, IsObjectHaveKeys } from './common.utils';
import { CreateFinalColumns, GetPreSelectedMethods, RegisterMethod, GetColumnsForListing, ConvertMenuDetailForGenericPage, GetParsedLayoutScript } from './generic.utils';
import { Get } from './http.utils';

import { ROUTE_URL } from './../Constants/global.constants';

/**
 * Fetches data for detail page
 * same as ConfigureDataForDirective
 * @param  {object} genericDetailObject - urlParameter
 */
export function GetDetailRecord({ configuration: genericDetailObject, callback, data, urlParameter }) {
    const params = Initialization(genericDetailObject);
    const options = {};

    options.list = true;
    if (params.includes) {
        options.includes = params.includes;
    }
    options.dictionary = params.dictionary ? false : true;

    options.request_identifier = data.request_identifier;
    const module = CreateUrlForFetchingDetailRecords({ url: genericDetailObject.url, urlParameter });
    if (!module) {
        alert("No Url has been set for this menu, Contact Admin");
        return false;
    }

    // flag to check promise

    const url = BuildUrlForGetCall(module, options);
    Get({ url, callback: PrepareObjectForDetailPage, extraParams: { callback, params, data, genericDetailObject }, urlPrefix: ROUTE_URL });
}

/**
 * Invoked when actual data for generic detail is fetched to process further and again callbacks with final data and columns list
 * @param  {object} result
 * @param  {object} {extraParams}
 */
function PrepareObjectForDetailPage(result, { extraParams }) {
    const { callback, params, genericDetailObject, data: portletData } = extraParams;
    const data = result.response;
    if (IsUndefinedOrNull(data)) {
        // swl.info("No Data Returned for this menu");
        alert("No Data Returned for this menu");
        return false;
    }

    const portletDetail = data.record;
    let tabs;   

    // if fetching data for the first time, process tabs object and attach extra properties
    if (data.tabs && Object.keys(data.tabs).length) { 
        tabs = data.tabs
        tabs = GetDataForTabs({ tabs });
    } else { // else take from previously fetched data
        tabs = portletData.tabs;
    }

    portletData.tabs = { ...tabs };

    const portlet = GetDataForPortlet({ portletDetail, genericDetailObject, portletData });

    const tabDetail = {
        tabs
    }
   
    const preDefinedmethods = GetPreSelectedMethods();
    const methods = RegisterMethod(genericDetailObject.nextActions)
    portlet.methods = methods;
    // tabs.methods = methods;
    portlet.preDefinedmethods = preDefinedmethods;
    // tabs.preDefinedmethods = preDefinedmethods;

    if (typeof callback == 'function') {
        callback({
            portlet,
            tabDetail
        });
    }
}


/**
 * same as ConfigureDataForPortlet.getData
 * @param  {} genericDetailObject
 * @param  {object} portletDetail - current object returned from api
 * @param  {object} portletData - previous data object 
 */
export function GetDataForPortlet({ portletDetail, genericDetailObject, portletData }) {
    var obj = {};
    obj.data = portletDetail.data;

    obj.modelClass = portletDetail.model_class;
    // obj.base = portletDetail.base;

    let { relationship, dictionary } = portletDetail;

    dictionary = dictionary && Object.keys(dictionary).length ? dictionary : portletData.dictionary;
    relationship = relationship && Object.keys(relationship).length ? relationship : portletData.relationship;

    // obj.listName = genericDetailObject.listName + ".detail.list";


    const params = {
        dictionary, relationship, includesList: Object.keys(dictionary) //@TODO improve this part
    }

    obj.portletColumns = GetColumnsForListing(params);
    if (genericDetailObject.layout && genericDetailObject.layout.column_definition) {
        obj.finalColumns = CreateFinalColumns(obj.portletColumns, genericDetailObject.layout.column_definition, relationship);
    } else {
        obj.finalColumns = [];
    }

    obj.tabs = portletData.tabs;
    obj.starter = portletDetail.base || portletData.starter;
    obj.request_identifier = portletDetail.request_identifier;
    obj.relationship = relationship;
    obj.dictionary = dictionary;
    const model = obj.model = relationship[obj.starter];
    obj.nextActions = [...obj.model.actions, ...genericDetailObject.uiActions];
    obj.model = model;
    const formPreferences = GetParsedLayoutScript(model.form_layouts);

    const formPreference = formPreferences[0] || {};
    if (IsObjectHaveKeys(formPreference) && typeof formPreference.column_definition == 'string') {
        formPreference.column_definition = JSON.parse(formPreference.column_definition);
    }

    obj.formPreference = formPreference;
    obj.formPreferences = formPreferences;

    return obj;
}

export function GetDataForTabs({ tabs }) {
    // const { route, restricted_column, query, includes, display_name, id } = tab;

    // const options = {
    //     includes: includes.join(','),
    //     query
    // }
    for (let i in tabs) {
        tabs[i] = ConvertMenuDetailForGenericPage(tabs[i]);
    }
    // console.log(tabs);
    return tabs;
}

//@TODO remove this method
/**
 * returns columns array
 * same as menu service' getColumns
 * @param  {} params - should contain includes, relationship, starter, dictionary, 
 * @param  {} excludeStarter
 */
export function GetColumnsForDetail(params, excludeStarter) {
    var columns = [];
    var selectedColumns = {};
    if (!params && typeof (params) != "object") {
        alert("Expected Params as object, Contact Admin");
        return false;
    }

    var relationship = params.relationship;

    var includes = params.includes.split(",");
    for (var i in includes) {
        includes[i] = params.starter + "." + includes[i];
        includes[i] = includes[i].toLowerCase();
    } !excludeStarter ? includes.unshift(params.starter) : null;
    for (var i in includes) {
        columns[includes[i]] = params.dictionary[(includes[i])];
    }
    // columns = params.dictionary;
    for (var i in columns) {
        var data = columns[i];
        for (var j in columns[i]) {
            var element = i + "." + columns[i][j].name;

            columns[i][j]["absPath"] = element.replace(/\.?([A-Z]+)/g, function (x, y) {
                return "_" + y.toLowerCase();
            }).replace(/^_/, "").replace(params.starter, "").replace(".", "");
            columns[i][j]["path"] = columns[i][j]["absPath"].split(/\.(.+)?/)[1];
            columns[i][j]["parent"] = i;

            var relationIndex = columns[i][j]["parent"];
            if (!IsUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex) && relationship[relationIndex].hasOwnProperty('related_model')) {
                columns[i][j].reference_route = relationship[relationIndex].related_model.state_name;
                columns[i][j].parentColumn = relationship[relationIndex].related_column ? relationship[relationIndex].related_column.name : null;
            }

            selectedColumns[columns[i][j].parent + "." + columns[i][j].id] = columns[i][j];
        }
    }
    return selectedColumns;
};


/**
 * Evaluates value against url
 * @param  {} url
 */
function CreateUrlForFetchingDetailRecords({ url, urlParameter }) {
    if (!url) {
        return false;
    }
    var reg = /([:$])\w+/g;
    var params = url.match(reg);
    if (!params || !params.length) {
        return url;
    }
    for (var i in params) {
        // url = url.replace(params[i], $stateParams[params[i].split(":")[1]]);
        const key = params[i];

        url = url.replace(key, urlParameter[key.substr(1)]);
    }
    return url;
}

function Initialization(genericDetailObject) {
    return {
        includes: genericDetailObject.includes, starter: genericDetailObject.starter
    };
}

/**
 * Creates array of inclusion string attached with starter
 * @param  {} includes
 */
function CreateInclusions(includesString) {
    const arr = [];
    let starter = "";
    const includes = includesString.split(",");
    for (const k in includes) {
        const inclusions = includes[k].split(".");
        for (const i in inclusions) {
            const name = parseInt(i) ? starter + "." + inclusions[i] : inclusions[i];
            starter = name;
            if (arr.indexOf(name) == -1) {
                arr.push(name);
            }
        }
    }
    return arr.join(",");
}


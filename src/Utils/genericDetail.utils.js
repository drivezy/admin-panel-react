import { IsUndefinedOrNull, BuildUrlForGetCall, IsObjectHaveKeys } from './common.utils';
import { CreateFinalColumns, GetPreSelectedMethods, RegisterMethod, GetColumnsForListing, ConvertMenuDetailForGenericPage } from './generic.utils';
import { Get } from './http.utils';

import { ROUTE_URL } from './../Constants/global.constants';

/**
 * Fetches data for detail page
 * same as ConfigureDataForDirective
 * @param  {object} genericDetailObject - urlParameter
 */
export function GetDetailRecord({ configuration: genericDetailObject, callback, urlParameter }) {
    const params = Initialization(genericDetailObject);
    const options = {};

    options.list = true;
    if (params.includes) {
        options.includes = params.includes;
    }
    options.dictionary = params.dictionary ? false : true;
    const module = CreateUrlForFetchingDetailRecords({ url: genericDetailObject.url, urlParameter });
    if (!module) {
        alert("No Url has been set for this menu, Contact Admin");
        return false;
    }

    // flag to check promise

    const url = BuildUrlForGetCall(module, options);
    Get({ url, callback: PrepareObjectForDetailPage, extraParams: { callback, params, genericDetailObject }, urlPrefix: ROUTE_URL });
}

/**
 * Invoked when actual data for generic detail is fetched to process further and again callbacks with final data and columns list
 * @param  {object} result
 * @param  {object} {extraParams}
 */
function PrepareObjectForDetailPage(result, { extraParams }) {
    const { callback, params, genericDetailObject } = extraParams;
    const data = result.response;
    if (IsUndefinedOrNull(data)) {
        // swl.info("No Data Returned for this menu");
        alert("No Data Returned for this menu");
        return false;
    }

    const portletDetail = data.record;

    const portlet = GetDataForPortlet({ portletDetail, genericDetailObject });
    const tabs = GetDataForTabs({ tabs: data.tabs });
    const tabDetail = {
        tabs
    }
    // console.log(tabDetail);

    // flag to check promise
    // params.dictionary = data.dictionary || params.dictionary;

    // var previousColumns = MenuService.getPreviousColumns(params);
    // genericDetailObject.preference = HealPreferenceFactory.listing(genericDetailObject.preference, previousColumns);
    // for (var i in data.relationship) {
    //     previousColumns = MenuService.getPreviousColumnsForListing(params);
    //     if (typeof data.relationship[i] == "object" && data.relationship[i].hasOwnProperty("preferences")) {
    //         data.relationship[i].preferences = HealPreferenceFactory.listing(data.relationship[i].preferences, previousColumns);
    //     }
    // }

    // const listPortlet = genericDetailObject.listName + ".detail.list";
    // portlet.listName = listPortlet;
    // const selectedColumns = genericDetailObject.preference[listPortlet] ? JSON.parse(genericDetailObject.preference[listPortlet]) : null;


    // tabs.parentData = data.response;
    // tabs.fixedParams = EvalQuery.eval(genericDetailObject.query, data.response);


    // tabs.callFunction = {
    //     callback: configureDataForDirective
    // };

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
 * @param  {} data
 * @param  {} genericDetailObject
 * @param  {} params
 * @param  {} configuration
 */
export function GetDataForPortlet({ portletDetail, genericDetailObject }) {
    var obj = {};
    obj.data = portletDetail.data;
    // obj.base = portletDetail.base;

    const { relationship, dictionary } = portletDetail;
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

    obj.starter = portletDetail.base;
    obj.relationship = relationship;
    const model = obj.model = relationship[obj.starter];
    obj.nextActions = obj.model.actions;
    obj.model = model;
    const formPreference = model.form_layouts[0] || {};
    if (IsObjectHaveKeys(formPreference)) {
        formPreference.column_definition = JSON.parse(formPreference.column_definition);
    }

    obj.formPreference = formPreference;

    // obj.dictionary = {};
    // obj.relationship = {};

    // obj.dictionary[genericDetailObject.starter] = data.dictionary[genericDetailObject.starter];
    // obj.relationship[genericDetailObject.starter] = data.relationship[genericDetailObject.starter];

    // params.dictionary = obj.dictionary;
    // params.relationship = data.relationship;


    // const includes = genericDetailObject.includes.split(",");
    // const inclusions = [];
    // includes.forEach(item => {
    //     const toCheckColumn = item.split(".");
    //     let index = genericDetailObject.starter + "." + toCheckColumn[0];
    //     if (data.relationship[index] && data.relationship[index].alias_type == 164) {
    //         for (var i in toCheckColumn) {
    //             var name = parseInt(i) ? inclusions[inclusions.length - 1] + "." + toCheckColumn[i] : toCheckColumn[i];
    //             inclusions.push(name);
    //         }
    //     } else {
    //         delete obj.data[index];
    //     }

    //     for (i in inclusions) {
    //         index = genericDetailObject.starter + "." + inclusions[i];
    //         obj.relationship[index] = data.relationship[index];
    //         obj.dictionary[index] = data.dictionary[index];
    //     }
    // });
    // obj.includes = inclusions.join(",");
    // params.includes = obj.includes;

    // const tempParams = params;
    // obj.portletColumns = GetColumnsForDetail(tempParams);


    // obj.scripts = InjectScriptFactory.returnMatchingScripts({
    //     preference: genericDetailObject.listName, scripts: genericDetailObject.scripts
    // });

    // console.log(obj);
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

// /**
//  * same as ConfigureDataForTab.getData
//  * @param  {Object} {data - actual data object
//  * @param  {Object} genericDetailObject} - meta data about menu
//  */
// function GetDataForTabs({ data, genericDetailObject }) {
//     if (IsUndefinedOrNull(data)) {
//         alert("No Data Returned for this menu");
//         // swl.info("No Data Returned for this menu");
//         return false;
//     }

//     const obj = {};

//     obj.includes =

//     // obj.data = {};
//     // obj.relationship = {};
//     // obj.dictionary = {};
//     // obj.includes = {};
//     // obj.scripts = [];

//     // if (!genericDetailObject.includes) {
//     //     return obj;
//     // }

//     // var includes = genericDetailObject.includes.split(",");
//     // var inclusions = [];
//     // includes.forEach(item => {
//     //     const toCheckColumn = item.split(".");
//     //     const index = genericDetailObject.starter + "." + toCheckColumn[0];

//     //     // const scripts = InjectScriptFactory.returnMatchingScripts({
//     //     //     preference: index, scripts: genericDetailObject.scripts, searchConstraint: "startsWith"
//     //     // });
//     //     // if (scripts.length) {
//     //     //     Array.prototype.push.apply(obj.scripts, scripts);
//     //     // }

//     //     if (data.relationship[index] && data.relationship[index].alias_type == 163) {
//     //         inclusions.push(item);
//     //         let name = genericDetailObject.starter;
//     //         for (var i in toCheckColumn) {
//     //             name += "." + toCheckColumn[i];
//     //             obj.relationship[name] = data.relationship[name];
//     //             obj.dictionary[name] = data.dictionary[name];
//     //         }
//     //         obj.data[index] = data.response[toCheckColumn[0]];
//     //     }
//     // });
//     // obj.includes = inclusions.join(",");
//     // obj.starter = genericDetailObject.starter;

//     // obj.scripts =

//     return obj;
// };


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


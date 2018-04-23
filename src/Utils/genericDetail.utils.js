import { IsUndefinedOrNull, BuildUrlForGetCall } from './common.utils';
import { CreateFinalColumns } from './generic.utils';
import { Get } from './http.utils';

/**
 * same as ConfigureDataForPortlet.getData
 * @param  {} data
 * @param  {} genericDetailObject
 * @param  {} params
 * @param  {} configuration
 */
export function GetDataForPortlet({ data, genericDetailObject, params, selectedColumns }) {
    var obj = {};
    obj.data = data.response;

    obj.dictionary = {};
    obj.relationship = {};

    obj.dictionary[genericDetailObject.starter] = data.dictionary[genericDetailObject.starter];
    obj.relationship[genericDetailObject.starter] = data.relationship[genericDetailObject.starter];

    if (!genericDetailObject.includes) {
        return obj;
    }

    const includes = genericDetailObject.includes.split(",");
    const inclusions = [];
    includes.forEach(item => {
        const toCheckColumn = item.split(".");
        let index = genericDetailObject.starter + "." + toCheckColumn[0];
        if (data.relationship[index] && data.relationship[index].alias_type == 164) {
            for (var i in toCheckColumn) {
                var name = parseInt(i) ? inclusions[inclusions.length - 1] + "." + toCheckColumn[i] : toCheckColumn[i];
                inclusions.push(name);
            }
        } else {
            delete obj.data[index];
        }

        for (i in inclusions) {
            index = genericDetailObject.starter + "." + inclusions[i];
            obj.relationship[index] = data.relationship[index];
            obj.dictionary[index] = data.dictionary[index];
        }
    });
    obj.includes = inclusions.join(",");
    params.includes = obj.includes;
    params.dictionary = obj.dictionary;
    params.relationship = data.relationship;
    const tempParams = params;
    obj.portletColumns = GetColumnsForDetail(tempParams);
    obj.finalColumns = CreateFinalColumns(obj.portletColumns, selectedColumns);

    // obj.scripts = InjectScriptFactory.returnMatchingScripts({
    //     preference: genericDetailObject.listName, scripts: genericDetailObject.scripts
    // });

    obj.starter = genericDetailObject.starter;
    return obj;
}

/**
 * returns columns array
 * same as menu service' getColumns
 * @param  {} params
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
            var element = i + "." + columns[i][j].column_name;

            columns[i][j]["absPath"] = element.replace(/\.?([A-Z]+)/g, function (x, y) {
                return "_" + y.toLowerCase();
            }).replace(/^_/, "").replace(params.starter, "").replace(".", "");
            columns[i][j]["path"] = columns[i][j]["absPath"].split(/\.(.+)?/)[1];
            columns[i][j]["parent"] = i;

            var relationIndex = columns[i][j]["parent"];
            if (!IsUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex) && relationship[relationIndex].hasOwnProperty('related_model')) {
                columns[i][j].reference_route = relationship[relationIndex].related_model.state_name;
                columns[i][j].parentColumn = relationship[relationIndex].related_column ? relationship[relationIndex].related_column.column_name : null;
            }

            selectedColumns[columns[i][j].parent + "." + columns[i][j].id] = columns[i][j];
        }
    }
    return selectedColumns;
};

/**
 * Fetches data for detail page
 * same as ConfigureDataForDirective
 * @param  {object} genericDetailObject - urlParameter
 */
export function GetDetailRecord({ configuration: genericDetailObject, callback, urlParameter }) {
    const params = Initialization(genericDetailObject);
    const options = {};

    if (params.includes) {
        options.includes = params.includes;
    }
    options.dictionary = params.dictionary ? false : true;
    const module = CreateUrl({ url: genericDetailObject.url, urlParameter });
    if (!module) {
        alert("No Url has been set for this menu, Contact Admin");
        return false;
    }

    // flag to check promise

    const url = BuildUrlForGetCall(module, options);
    Get({ url, callback: PrepareObjectForDetailPage, extraParams: { callback, params, genericDetailObject } });
}

/**
 * Invoked when actual data for generic detail is fetched to process further and again callbacks with final data and columns list
 * @param  {object} result
 * @param  {object} {extraParams}
 */
function PrepareObjectForDetailPage(result, { extraParams }) {
    const { callback, params, genericDetailObject } = extraParams;
    const data = result;
    if (IsUndefinedOrNull(data)) {
        // swl.info("No Data Returned for this menu");
        alert("No Data Returned for this menu");
        return false;
    }
    // flag to check promise
    params.dictionary = data.dictionary || params.dictionary;

    // var previousColumns = MenuService.getPreviousColumns(params);
    // genericDetailObject.preference = HealPreferenceFactory.listing(genericDetailObject.preference, previousColumns);
    // for (var i in data.relationship) {
    //     previousColumns = MenuService.getPreviousColumnsForListing(params);
    //     if (typeof data.relationship[i] == "object" && data.relationship[i].hasOwnProperty("preferences")) {
    //         data.relationship[i].preferences = HealPreferenceFactory.listing(data.relationship[i].preferences, previousColumns);
    //     }
    // }

    const listPortlet = genericDetailObject.listName + ".detail.list";
    const selectedColumns = genericDetailObject.preference[listPortlet] ? JSON.parse(genericDetailObject.preference[listPortlet]) : null;

    // tabs = ConfigureDataForTab.getData(data, genericDetailObject);
    // tabs.parentData = data.response;
    // tabs.fixedParams = EvalQuery.eval(genericDetailObject.query, data.response);

    // portlet = configureDataForPortlet(data);
    const portlet = GetDataForPortlet({ data, genericDetailObject, params, selectedColumns });
    portlet.listName = listPortlet;
    // tabs.callFunction = {
    //     callback: configureDataForDirective
    // };

    if (typeof callback == 'function') {
        callback({
            portlet,
            // tabs
        });
    }
}

/**
 * Evaluates value against url
 * @param  {} url
 */
function CreateUrl({ url, urlParameter }) {
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
        url = url.replace(params[i], urlParameter.menu_id);
    }
    return url;
}

function Initialization(genericDetailObject) {
    return {
        includes: genericDetailObject.includes, starter: genericDetailObject.starter
    };
}
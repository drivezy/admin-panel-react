import React, { Component } from 'react';
import { Get } from './http.utils';
import { IsUndefinedOrNull } from './common.utils';
import ToastNotifications from './../Utils/toast.utils';
import {Delete} from './../Utils/http.utils';

import ModalManager from './../Wrappers/Modal-Wrapper/modalManager';
import { GetMenuDetailEndPoint } from './../Constants/api.constants';

import FormCreator from './../Components/Form-Creator/formCreator.component'
/**
 * Fetches Menu detail to render generic page
 * @param  {id} menuId
 * @param  {function} callback
 */
export function GetMenuDetail(menuId, callback) {
    const url = GetMenuDetailEndPoint + menuId;
    return Get({ url, callback, persist: callback ? true : false });
}

/**
 * takes query as string & evaluates them
 * replace string variable to their value
 * @param  {string} params
 * @returns evaluated query
 */
export function ConvertToQuery(params) {
    const reg = /(:[$\w.]*)\w+/g;
    const tempArr = params.match(reg);

    for (const i in tempArr) {
        if (tempArr[i] && typeof tempArr[i] == 'string') {
            const a = eval('this.' + tempArr[i].split(':')[1]);
            const b = tempArr[i];
            params = params.replace(b, a);
        }
    }
    return params;
}

/**
 * takes dictionary and relationship and create object having key combination of its parent and id
 * used for getting list of columns in above explained format which is again used by CreateFinalColumns method to return selected columns
 * @param  {string} {includes
 * @param  {object} relationship
 * @param  {string} starter
 * @param  {object} dictionary
 * @param  {boolean} excludeStarter}
 */
export function GetColumnsForListing({ includes, relationship, starter, dictionary, excludeStarter }) {
    const columns = [];
    const selectedColumns = {};
    const includesList = [];
    const includesArr = includes.split(',');

    for (const i in includesArr) {
        const tempIncludes = includesArr[i].split('.');
        let newStarter = starter;
        for (const j in tempIncludes) {
            newStarter += `.${tempIncludes[j]}`;
            includesList.push(newStarter);
        }
    }

    !excludeStarter ? includesList.unshift(starter) : null;
    for (const i in includesList) {
        columns[includesList[i]] = dictionary[(includesList[i])];
    }
    // columns = dictionary;
    for (const i in columns) {
        // const data = columns[i];
        for (const j in columns[i]) {
            const element = `${i}.${columns[i][j].column_name}`;

            columns[i][j].path = element.replace(/\.?([A-Z]+)/g, (x, y) => {
                return `_${y.toLowerCase()}`;
            }).replace(/^_/, '').replace(starter, '').replace('.', '');
            columns[i][j].parent = i;

            const relationIndex = columns[i][j].parent;
            if (!IsUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex) && relationship[relationIndex].hasOwnProperty('related_model')) {
                columns[i][j].reference_route = relationship[relationIndex].related_model.state_name;
                columns[i][j].parentColumn = relationship[relationIndex].related_column ? relationship[relationIndex].related_column.column_name : null;
            }

            selectedColumns[`${columns[i][j].parent}.${columns[i][j].id}`] = columns[i][j];
            // selectedColumns[columns[i][j].id] = columns[i][j];
        }
    }
    return selectedColumns;
}

/**
 * returns final list of selected columns to be shown on each car for each row
 * Takes columns list being prepared by 'GetColumnsForListing' method, preference list and relationship
 * same as TableFactory.createFinalObject
 * @param  {object} columns
 * @param  {object} selectedColumns
 * @param  {object} relationship
 */
export function CreateFinalColumns(columns, selectedColumns, relationship) {
    const finalColumnDefinition = [];
    let splitEnabled = false;

    for (const i in selectedColumns) {
        const selected = selectedColumns[i];
        if (typeof (selected) == "object") {
            const dict = columns[selected.column];
            if (dict) {
                finalColumnDefinition[i] = dict;
                finalColumnDefinition[i].route = selected.route ? selected.route : false;
                finalColumnDefinition[i].display_name = selected.columnTitle ? selected.columnTitle : finalColumnDefinition[i].display_name;
                finalColumnDefinition[i].split = splitEnabled;
                if (selected.filter) {
                    finalColumnDefinition[i].filter = selected.filter;
                }

                // const relationIndex                  = dict.parent.split('.');
                const relationIndex = dict.parent;
                if (!IsUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex) && relationship[relationIndex].hasOwnProperty('related_model')) {
                    finalColumnDefinition[i].reference_route = relationship[relationIndex].related_model.state_name;
                }
            }
        } else {
            finalColumnDefinition[i] = {
                column_name: selected, column_type: null
            };
            splitEnabled = !splitEnabled;
        }

        // if it is a seperator
        if (selected.column_name == "seperator") {
            finalColumnDefinition[i] = selected;
        }
    }

    return finalColumnDefinition;
}

/**
 * Returns meta data about menus to be used to fetch actual listing data
 * This method is invoked, Once menu detail is fetched 
 * @param  {object} menuDetail
 */
export function ConvertMenuDetailForGenericPage(menuDetail) {
    if (menuDetail.default_order) {
        var splits = menuDetail.default_order.split(",");
    }

    /**
     * Preparing obj to build template
     */
    return {
        includes: menuDetail.includes,
        url: menuDetail.base_url,
        starter: menuDetail.starter,
        restricted_query: menuDetail.restricted_query,
        restrictColumnFilter: menuDetail.restricted_column,
        userMethod: menuDetail.method,
        formPreferenceName: menuDetail.state_name.toLowerCase(),
        order: menuDetail.default_order ? splits[0].trim() : "id",
        sort: menuDetail.default_order ? splits[1].trim() : "desc",
        menuId: menuDetail.id,
        model: menuDetail.data_model,
        preference: menuDetail.preference,
        listName: menuDetail.state_name.toLowerCase(),
        nextActions: menuDetail.actions,
        userFilter: menuDetail.user_filter,
        pageName: menuDetail.name,
        image: menuDetail.image,
        stateName: menuDetail.state_name,
        module: menuDetail.base_url,
        // actions: menuDetail.actions,
        // method: menuDetail.method,
        // search: menuDetail.search,
        // scripts: menuDetail.scripts,
    };
}


export function CreateInclusions(includes) {
    const arr = [];
    let starter = "";
    includes = includes.split(",");
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


/**
 * parse url string to actual one
 * this method seek for ':', whenever it encounters one, replace with actual data
 * for e.g. booking/:id is converted to booking/12
 * @param  {string} url='' 
 * @param  {object} obj
 */
export function CreateUrl({ url = '', obj }) {
    const reg = /(:)\w+/g;
    const params = url.match(reg);
    if (!params.length) {
        return url;
    }
    for (let i in params) {
        const attr = params[i].substr(1);
        url = url.replace(params[i], obj[attr]);
    }
    return url;
}

export function ConvertDependencyInjectionToArgs(dependencies) {
    if (!dependencies) {
        return [];
    }

    var args = [];
    var dependency = dependencies.split(",");
    for (var i in dependency) {
        args.push('this.'+eval(dependency[i]));
    }

    return args;
}

/**
 * Register all the methods coming from db
 * @param  {} method
 */
export function RegisterMethod(methodArr) {
    const methods = {};
    for (var i in methodArr) {
        const methodObj = methodArr[i];
        if (methodObj.definition && typeof methodObj.definition == 'object' && methodObj.definition.script) {
            if (methodObj.dependency) {
                methods[methodObj.name] = new Function("callback", methodObj.dependency, methodObj.definition.script);
            } else {
                methods[methodObj.name] = new Function("callback", methodObj.definition.script);
            }
        }
    }
    return methods;
}

export function GetPreSelectedMethods() {
    const methods = {};
    methods.redirect = ({ action, listingRow, history, genericData }) => {
        let url = CreateUrl({ url: action.parameter, obj: listingRow });
        // var urlParams;
        // var userQuery = 0;

        url = createQueryUrl(url, genericData.restrictQuery, genericData);
        history.push(url);
        // if (angular.isDefined(event)) {
        //     if (event.metaKey || event.ctrlKey) {
        //         window.open("#/" + url, "_blank");
        //     } else {
        // $location.url(url);
        // location.hash = "#/" + url;
        //     }
        // }
    };

    methods.add = ({ action, listingRow, genericData }) => {
        const payload = { action, listingRow, columns: genericData.columns, formPreference: genericData.formPreference, modelName: genericData.modelName, module: genericData.module, dataModel: genericData.dataModel };
        ModalManager.openModal({
            payload,
            headerText: 'Add modal',
            // modalHeader: () => (<ModalHeader payload={payload}></ModalHeader>),
            modalBody: () => (<FormCreator payload={payload} />),
            // modalFooter: () => (<ModalFooter payload={payload}></ModalFooter>)
        });
    }

    methods.edit = ({ action, listingRow, genericData }) => {
        const payload = { method: 'edit', action, listingRow, columns: genericData.columns, formPreference: genericData.formPreference, modelName: genericData.modelName, module: genericData.module, dataModel: genericData.dataModel };
        ModalManager.openModal({
            payload,
            // modalHeader: () => (<ModalHeader payload={payload}></ModalHeader>),
            headerText: 'Edit modal',
            modalBody: () => (<FormCreator payload={payload} />)
        });
    }

    methods.delete = async ({ action, listingRow, genericData }) => {
        const deletekey = IsUndefinedOrNull(action.redirectValueName) ? listingRow.id : listingRow[action.redirectValueName];
        if (window.confirm('Are you sure you want to delete this record?')) {
            const result = await Delete({ url: `${genericData.module}/${deletekey}` });
            if (result.success) {
                action.callback();
                ToastNotifications.success('Records has been deleted');
            }
        }
    }

    function createQueryUrl(url, restrictQuery, genericData) {

        var query = '';
        var orderMethod;

        // If query is present 
        // we add it ,
        // else we check if there is a filter in the url , 
        // then append the respective filter query 
        // if (urlParams.query) {
        //     query += urlParams.query;
        // } else {
        //     if (urlParams.filter) {
        //         var filter = this.props.genericData.userFilter.filter(function (userFilter) {
        //             return userFilter.id == urlParams.filter;
        //         })[0];
        //         query += filter.filter_query;
        //     }
        // }

        if (restrictQuery) {
            if (query) {
                query += restrictQuery;
            } else {
                query += restrictQuery.split('and ')[1];
            }
        }

        if (query) {
            query = '?redirectQuery=' + query;
            orderMethod = '&';
        } else {
            orderMethod = '?';
        }
        // if (urlParams.order) {
        //     url += query + orderMethod + "listingOrder=" + urlParams.order + ',' + (urlParams.sort || 'desc');
        // } else if (this.props.genericData.defaultOrder) {
        //     url += query + orderMethod + "listingOrder=" + this.props.genericData.defaultOrder;
        // } else {
        //     url += query;
        // }

        return url;
    }
    return methods;
}
import { Get } from './http.utils';
import { IsUndefinedOrNull } from './common.utils';

import { GetMenuDetailEndPoint } from './../Constants/api.constants';

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
            const a = eval(tempArr[i].split(':')[1]);
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
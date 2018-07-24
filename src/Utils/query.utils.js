import { Get,Post } from 'common-js-util';
import { IsUndefinedOrNull } from './../Utils/common.utils';
import { RECORD_URL } from './../Constants/global.constants';

export function QueryData(queryId) {
    return Get({ url: "reportingQuery/" + queryId + "?includes=parameters.referenced_model,parameters.param_type,user_filter,actions.definition,user_view.group_filter,assets" });
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

            selectedColumns[`${columns[i][j].parent}.${columns[i][j].id}`] = columns[i][j];
            // selectedColumns[columns[i][j].id] = columns[i][j];
        }

    }
    return selectedColumns;
}

/**
 * accepts source_type = JRAPP, source_id (menuId), user_id, name = default, query = null, column_definition
 * @param  {} key
 * @param  {} value
 * @param  {} override_all
 */
   export function SetPreference({ parameter, selectedColumns, override_all }) {
    // const source_type = GetSourceMorphMap(source);

    // const methods = { Post, Put };
    // let method = 'Post';

    const body = {
        // query,
        parameter,
        value: JSON.stringify(selectedColumns)
    };


    //return methods[method]({ url, body, urlPrefix: RECORD_URL });
    return Post({ url: 'userPreference', body: body });
}

/**
 * returns final list of selected columns to be shown on each car for each row
 * Takes columns list being prepared by 'GetColumnsForListing' method, preference list and relationship
 * same as TableFactory.createFinalObject
 * @param  {object} columns
 * @param  {object} selectedColumns
 * @param  {object} relationship
 */
export function CreateFinalColumns(columns, selectedColumns) {
    const finalColumnDefinition = [];
   

    for (const i in selectedColumns) {
        const selected = selectedColumns[i];
        if (typeof (selected) == "object") {
            const value = selected.object+'.'+selected.id;
            const dict = columns[value];
            if (dict) {
                finalColumnDefinition[i] = dict;
                finalColumnDefinition[i].route = selected.route ? selected.route : false;
                finalColumnDefinition[i].display_name = selected.columnTitle ? selected.columnTitle : finalColumnDefinition[i].display_name;
                if (selected.filter) {
                    finalColumnDefinition[i].filter = selected.filter;
                }

                // @Relation not required for query managing
                // const relationIndex                  = dict.parent.split('.');
                // const relationIndex = dict.parent;
                // if (!IsUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex) && relationship[relationIndex].hasOwnProperty('related_model')) {
                //     finalColumnDefinition[i].reference_route = relationship[relationIndex].related_model.state_name;
                // }


                // if (!IsUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex)) {
                //     if (relationship[relationIndex].hasOwnProperty('related_model')) {
                //         finalColumnDefinition[i].reference_route = relationship[relationIndex].related_model.state_name;
                //     } else if (relationship[relationIndex].state_name) {
                //         finalColumnDefinition[i].reference_route = relationship[relationIndex].state_name;
                //     }
                // }
            }
        } else {
            finalColumnDefinition[i] = {
                column_name: selected, column_type: null
            };

        }
    }

    return finalColumnDefinition;
    
}

/**
 * Returns default option for get call params
 */
export function GetDefaultOptionsForQuery() {
    return {
        includes: '',
        order: '1,asc',
        query: '',
        limit: 20,
        page: 1,
        dictionary: false,
        stats: true
    };
}

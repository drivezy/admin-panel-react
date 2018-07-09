import { Get } from './../Utils/http.utils';
import { IsUndefinedOrNull } from './../Utils/common.utils';

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

            const relationIndex = columns[i][j].parent;
            if (!IsUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex)) {
                if (relationship[relationIndex].hasOwnProperty('related_model')) {
                    columns[i][j].reference_route = relationship[relationIndex].related_model.state_name;
                    columns[i][j].parentColumn = relationship[relationIndex].related_column ? relationship[relationIndex].related_column.column_name : null;
                } else if (relationship[relationIndex].state_name) {
                    columns[i][j].reference_route = relationship[relationIndex].state_name;
                }
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
            splitEnabled = !splitEnabled;
        }

        // if it is a seperator
        if (selected.column_name == "seperator") {
            finalColumnDefinition[i] = selected;
        }
    }

    return finalColumnDefinition;
}


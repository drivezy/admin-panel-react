/**
 * Utility methods to be used by configureFilter or dynamic components
 */
import { BuildUrlForGetCall, SelectFromOptions } from './common.utils';
import { Get } from './http.utils';
import { GetTime } from './time.utils';
import GLOBAL from './../Constants/global.constants';

/**
 * Takes raw string query and convert them to object
 * @param  {string} rawQueryString
 */
export function RawStringQueryToObject(rawQueryString) {
    let rawQuery = rawQueryString.replace(/[()]/g, "");
    const reg = /'.*'$/g;
    const selectedColumn = rawQuery.split(" ", 1)[0];
    let inputFields = rawQuery.match(reg);

    if (inputFields) {
        inputFields = inputFields[0];

        inputFields = inputFields.split(" and ");
        var selectedInput = inputFields[0];
        selectedInput = selectedInput.slice(1, -1);
        if (inputFields[1]) {
            inputFields[1] = inputFields[1].slice(1, -1);
            var secondInputField = inputFields[1];
        }
    } else {
        selectedInput = null;
    }
    rawQuery = rawQuery.replace(reg, "");
    const selectedFilter = rawQuery.replace(selectedColumn, "");
    return {
        selectedFilter,
        selectedInput,
        selectedColumn,
        secondInputField
    };
};

export function RemoveLastWord(query, loop) {
    for (let i = 0; i < loop; i++) {
        const lastIndex = query.lastIndexOf(" ");
        query = query.substring(0, lastIndex);
    }
    return query;
};

export async function GetInputRecord({ input: val, currentUser = null, column, queryField: queryFieldName }) {
    if (val == "currentUser" && currentUser) {
        val = currentUser.id;
    }
    const queryField = queryFieldName ? queryFieldName : column.referenced_model.display_column;
    let url = column.referenced_model.route_name;
    var options = { query: queryField + ' like %22%25' + val + '%25%22' };

    url = BuildUrlForGetCall(url, options);
    return await Get({ url, urlPrefix: GLOBAL.ROUTE_URL });
}

/**
 * takes query param from url and convert into array of queries
 * @param  {string} {rawQuery
 * @param  {object} dictionary=[]
 * @param  {function} finalSql
 * @param  {object} currentUser}
 */
export async function CreateQuery({ rawQuery, dictionary = {}, finalSql: FinalSql, currentUser }) {
    // const {sqlArray} = this.state;
    // arr = [];
    const parentQueries = rawQuery.split(' AND ');
    const sqlArray = [];
    const arr = [];

    parentQueries.forEach(async (parentValue, parentKey) => {
        const queries = parentValue.split(' OR ');
        queries.forEach(async (value, key) => {
            let showSql = '';
            const queryObj = RawStringQueryToObject(value);

            const regexForPickingAfterLastDot = /[^\.]+$/;
            const regexForStringWithinTilde = /(?<=\`).*(?=\`)/g;

            const columnName = queryObj.selectedColumn.match(regexForPickingAfterLastDot)[0];
            const parentName = queryObj.selectedColumn.match(regexForStringWithinTilde)[0];


            dictionary = Object.values(dictionary);
            const column = dictionary.filter(dictionaryObj => dictionaryObj.parent == parentName && dictionaryObj.name == columnName)[0] || {};
            // const column = SelectFromOptions(dictionary, columnName, 'name');

            // const column = SelectFromOptions(dictionary, queryObj.selectedColumn, 'name');

            showSql += column.path + queryObj.selectedFilter;

            if (!queryObj.selectedFilter.includes('IS NULL') && !queryObj.selectedFilter.includes('IS NOT NULL')) {
                switch (column.column_type) {
                    // if column type is select type
                    case 116:
                        const res = await GetInputRecord({ input: queryObj.selectedInput, column, queryField: 'id' });
                        if (res && res.success) {
                            showSql += res.response[0][column.referenced_model.display_column];
                            FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        }
                        break;

                    // if column type is referenced
                    case 117:
                        const result = await GetInputRecord({ input: queryObj.selectedInput, column, queryField: 'id' })
                        // If its a currentUser show Current User instead of showing the display_column
                        if (queryObj.selectedInput == 'currentUser') {
                            showSql += 'Current User';
                        } else if (Array.isArray(result.response) && result.response.length) {
                            showSql += result.response[0][column.referenced_model.display_column];
                        }
                        // appendOr(showSql, queries, key, parentKey);
                        FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        break;
                    // if column type is datetime
                    case 109:
                        showSql += GetTime({ dateTime: queryObj.selectedInput, format: "YYYY-MMM-DD" });
                        showSql += queryObj.secondInputField ? " and " + GetTime({ dateTime: queryObj.secondInputField, format: 'YYYY-MMM-DD' }) : '';
                        // appendOr(showSql, queries, key, parentKey);
                        FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        break;

                    case 110:
                        showSql += GetTime({ dateTime: queryObj.selectedInput, format: 'YYYY-MMM-DD HH:mm:ss' });
                        showSql += queryObj.secondInputField ? " and " + GetTime({ dateTime: queryObj.secondInputField, format: 'YYYY-MMM-DD HH:mm:ss' }) : "";
                        // appendOr(showSql, queries, key, parentKey);
                        FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        break;

                    case 111:
                        showSql += parseInt(queryObj.selectedInput) ? "True" : "False";
                        // appendOr(showSql, queries, key, parentKey);
                        FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        break;

                    default:
                        showSql += queryObj.selectedInput;
                        // appendOr(showSql, queries, key, parentKey);
                        FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        break;
                }
            } else {
                // appendOr(showSql, queries, key, parentKey);
                FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
            }
        });
    });
}
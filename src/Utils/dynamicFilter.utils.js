/**
 * Utility methods to be used by configureFilter or dynamic components
 */
import { Get, BuildUrlForGetCall } from 'common-js-util';
import { GetTime } from './time.utils';
import GLOBAL from './../Constants/global.constants';
import { STRING_WITHIN_TILDE, PICK_AFTER_LAST_DOTS } from './../Constants/regex.constants';
import COLUMN_TYPE from './../Constants/columnType.constants';

/**
 * Takes raw string query and convert them to object
 * @param  {string} rawQueryString
 */
export function RawStringQueryToObject(rawQueryString) {
    let rawQuery = rawQueryString.replace(/[()]/g, "");
    const reg = /'.*'$/g;
    const selectedColumn = rawQuery.split(" ", 1)[0];
    let inputFields = rawQuery.match(reg);

    // @TODO temporary fix for tackling restricted_query issue
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

    if (!inputFields && (rawQuery.indexOf('IS NULL') == -1 && rawQuery.indexOf('IS NOT NULL') == -1)) {
        inputFields = rawQuery.match(/\S*$/ig, "");
        var selectedInput = inputFields[0];
        rawQuery = rawQuery.replace(/\S*$/ig, "");
    }
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
    const queryField = queryFieldName ? queryFieldName : column.reference_model.display_column;
    let url = column.reference_model.route_name;
    var options = { query: queryField + ' like %22%25' + val + '%25%22' };

    url = BuildUrlForGetCall(url, options);
    return await Get({ url, urlPrefix: GLOBAL.ROUTE_URL });
}

export function GetSelectedColumn({ selectedColumnQuery, dictionary = {} }) {

    const columnName = selectedColumnQuery.match(PICK_AFTER_LAST_DOTS)[0];
    const parentName = selectedColumnQuery.match(STRING_WITHIN_TILDE)[0];

    if (dictionary && !Array.isArray(dictionary)) {
        dictionary = Object.values(dictionary);
    }
    return dictionary.filter(dictionaryObj => dictionaryObj.parent == parentName && dictionaryObj.name == columnName)[0] || {};
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
    if (!rawQuery) {
        return;
    }

    const parentQueries = rawQuery.split(' AND ');
    const sqlArray = [];
    const arr = [];

    parentQueries.forEach(async (parentValue, parentKey) => {
        const queries = parentValue.split(' OR ');
        queries.forEach(async (value, key) => {
            let showSql = '';
            const queryObj = RawStringQueryToObject(value);

            // const regexForPickingAfterLastDot = /[^\.]+$/;
            // const regexForStringWithinTilde = /(?<=\`).*(?=\`)/g;

            // const columnName = queryObj.selectedColumn.match(regexForPickingAfterLastDot)[0];
            // const parentName = queryObj.selectedColumn.match(regexForStringWithinTilde)[0];


            dictionary = Object.values(dictionary);
            // const column = dictionary.filter(dictionaryObj => dictionaryObj.parent == parentName && dictionaryObj.name == columnName)[0] || {};
            // const column = SelectFromOptions(dictionary, columnName, 'name');
            // const column = SelectFromOptions(dictionary, queryObj.selectedColumn, 'name');
            const column = GetSelectedColumn({ selectedColumnQuery: queryObj.selectedColumn, dictionary });

            showSql += column.path + queryObj.selectedFilter;

            if (!queryObj.selectedFilter.includes('IS NULL') && !queryObj.selectedFilter.includes('IS NOT NULL')) {
                console.log(column.column_type_id);
                switch (column.column_type_id) {
                    // if column type is select type
                    case COLUMN_TYPE.SELECT:
                        const res = await GetInputRecord({ input: queryObj.selectedInput, column, queryField: 'id' });
                        if (res && res.success) {
                            showSql += res.response[0][column.reference_model.display_column];
                            FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        }
                        break;

                    // if column type is referenced
                    // case COLUMN_TYPE.REFERENCE:
                    //     console.log('reference');
                    //     const result = await GetInputRecord({ input: queryObj.selectedInput, column, queryField: 'id' })
                    //     // If its a currentUser show Current User instead of showing the display_column
                    //     if (queryObj.selectedInput == 'currentUser') {
                    //         showSql += 'Current User';
                    //     } else if (Array.isArray(result.response) && result.response.length) {
                    //         showSql += result.response[0][column.reference_model.display_column];
                    //     }
                    //     // appendOr(showSql, queries, key, parentKey);
                    //     FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                    //     break;
                    // if column type is datetime
                    case COLUMN_TYPE.DATETIME:
                        showSql += GetTime({ dateTime: queryObj.selectedInput, format: "YYYY-MMM-DD" });
                        showSql += queryObj.secondInputField ? " and " + GetTime({ dateTime: queryObj.secondInputField, format: 'YYYY-MMM-DD' }) : '';
                        // appendOr(showSql, queries, key, parentKey);
                        FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        break;

                    case COLUMN_TYPE.DATE:
                        showSql += GetTime({ dateTime: queryObj.selectedInput, format: 'YYYY-MMM-DD HH:mm:ss' });
                        showSql += queryObj.secondInputField ? " and " + GetTime({ dateTime: queryObj.secondInputField, format: 'YYYY-MMM-DD HH:mm:ss' }) : "";
                        // appendOr(showSql, queries, key, parentKey);
                        FinalSql({ sql: showSql, key, parentKey, arr, sqlArray });
                        break;

                    case COLUMN_TYPE.BOOLEAN:
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
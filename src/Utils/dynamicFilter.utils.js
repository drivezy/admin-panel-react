/**
 * Utility methods to be used by configureFilter or dynamic components
 */

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
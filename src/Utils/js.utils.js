


/**
 * Returns the columns for building tabs
 * @param  {id} menuId
 * @param  {function} callback
 */
export function changeArrayPosition(array, from, to) {
    if (to >= 0 && to < array.length) {
        var temp = array[from];
        array[from] = array[to];
        array[to] = temp;
        return { array: array, index: to };
    } else {
        return { array: array, index: from };
    }
}



let content = {};

/**
 * Returns the columns for building tabs
 * @param  {id} menuId
 * @param  {function} callback
 */
export function changeArrayPosition(array, from, to) {
    const tempArray = [...array];
    if (to >= 0 && to < array.length) {
        var temp = tempArray[from];
        tempArray[from] = tempArray[to];
        tempArray[to] = temp;
        return { array: tempArray, index: to };
    } else {
        return { array: tempArray, index: from };
    }
}


export function Setter(key, value) {
    content[key] = value;
}

export function Getter(key) {
    return content[key];
}

export function TruncateDecimal(value){
    return value.toFixed(2);
}
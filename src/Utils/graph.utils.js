/*
Implements utility functions to be used across project
*/
import _ from 'lodash';

import { IsUndefinedOrNull } from './../../Utils/common.utils';


/**
 * Returns true if object is having keys
 * false if object is empty 
 * @param  {Object} obj
 */
export function GetGraphData(tableContents, formContent) {

    let graphContent = {
        graphType: formContent.graph.graphType,
        title: formContent.title,
        xAxis: formContent.xAxis,
        yAxis: formContent.yAxis
    };

    let graphData = GetBarGraphData(tableContents, formContent);

    graphContent.graphData = graphData.data;
    graphContent.categories = graphData.categories;

    return graphContent;
}


/**
 * Get Data for bar graph
 */
function GetBarGraphData(tableContents, formContent) {
    let data = tableContents;

    let groupBy = formContent.xAxis;
    let field = formContent.field;

    let groupedData = _.groupBy(tableContents, groupBy);

    let xAxis = _.orderByy(Object.keys(groupedData));
    let result = { data: [], name: 'City' };

    xAxis.forEach((axis) => {
        result.data.push(FindOperatorData(groupedData[axis], field));
    });

    return { data: [result], categories: xAxis };

}

/**
 * 
 * Find the operator Data 
 * 
 * @param {*} array 
 * @param {*} field 
 */
function FindOperatorData(array, field) {

    // iterate through the array 
    // and find the min , max , sum accoridng to whichever operate is there
    if (field.indexOf('Max') != -1) {
        var max = 0;

        array.forEach((element, index) => {
            if (!IsUndefinedOrNull(element[field])) {
                if (index == 0) {
                    max = parseFloat(element[field]) || 0;
                } else {
                    max = Math.max(max, parseFloat(element[field])) || 0;
                }
            }
        })

        return max;
    } else if (field.indexOf('Min') != -1) {
        var lowest = 0;

        array.forEach((element, index) => {
            // if field value is null , we should skip the iteration
            // lowest will get the value 0
            if (!IsUndefinedOrNull(element[field])) {
                if (index == 0) {
                    lowest = parseFloat(element[field]);
                } else {
                    lowest = Math.min(lowest, parseFloat(element[field]));
                }
            } else {
                lowest = 0;
            }
        })

        return lowest;
    } else if (field.indexOf('Avg') != -1) {
        var sum = 0;

        array.forEach((element, index) => {
            if (!IsUndefinedOrNull(element[field])) {
                sum += parseFloat(element[field])
            }
        })

        return (sum / array.length);
    } else {
        var sum = 0;

        array.forEach((element, index) => {
            if (!IsUndefinedOrNull(element[field])) {
                sum += parseFloat(element[field])
            }
        })

        return sum;
    }

}


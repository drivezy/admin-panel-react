/*
Implements utility functions to be used across project
*/
import _ from 'lodash';

import { IsUndefinedOrNull } from './common.utils';


/**
 * Returns true if object is having keys
 * false if object is empty 
 * @param  {Object} obj
 */
export function GetGraphData(tableContents, formContent) {

    let graphContent = {
        graphType: formContent.graphType,
        title: formContent.title,
        xAxis: formContent.xAxis,
        yAxis: formContent.yAxis
    };

    if (formContent.graphType == 'bar') {

        let graphData = GetBarGraphData(tableContents, formContent);

        graphContent.graphData = graphData.data;
        graphContent.categories = graphData.categories;

    } else if (formContent.graphType == 'pie') {

        let graphData = GetPieGraphData(tableContents, formContent);

        graphContent.graphData = graphData;

    } else if (formContent.graphType == 'column' || formContent.graphType == 'line') {

        let graphData = GetColumnGraphData(tableContents, formContent);

        graphContent.zAxis = formContent.zAxis;
        graphContent.categories = graphData.categories;
        graphContent.graphData = graphData.data;

    }

    return graphContent;
}


/**
 * Get Data for bar graph
 */
function GetBarGraphData(tableContents, formContent) {
    let data = tableContents;

    let groupBy = formContent.xAxis;
    let field = formContent.yAxis;

    let groupedData = _.groupBy(tableContents, groupBy);

    let xAxis = _.orderBy(Object.keys(groupedData));
    let result = { data: [], name: 'City' };

    xAxis.forEach((axis) => {
        result.data.push(FindOperatorData(groupedData[axis], field));
    });

    return { data: [result], categories: xAxis };
}

/**
 * Get Data for Pie Graph 
 * 
 * @param {*} tableContents 
 * @param {*} formContent 
 */
function GetPieGraphData(tableContents, formContent) {
    let graphContent = [];
    let groupedContent = _.groupBy(tableContents, formContent.xAxis);

    _.forEach(groupedContent, (contents, groupBy) => {
        let entry = {};

        entry[formContent.xAxis] = groupBy;
        entry[formContent.yAxis] = FindOperatorData(contents, formContent.yAxis);
        graphContent.push(entry);
    });

    return graphContent.map((entry) => {
        return { name: entry[formContent.xAxis], y: parseInt(entry[formContent.yAxis]) };
    });
}

/**
 * Get the Column Graph
 * 
 * @param {*} tableContents 
 * @param {*} formContent 
 */
function GetColumnGraphData(tableContents, formContent) {
    let groupBy = formContent.zAxis;
    let field = formContent.yAxis;
    let groupColumn = formContent.xAxis;

    let dayGroup = _.groupBy(tableContents, groupColumn);
    let xAxis = _.orderBy(Object.keys(dayGroup));

    let cityGroup = _.groupBy(tableContents, groupBy);

    let cities = [];

    _.forEach(cityGroup, (dayEntry, key) => {
        let cityArray = [];

        dayEntry.forEach((entry) => {
            // According to the field the data assigned to cityArray should change
            cityArray[entry[groupColumn]] = FindSeriesDataforColumn(parseFloat(entry[field]), parseFloat(cityArray[entry[groupColumn]]), field);
        });

        // Push cities
        cities.push({ name: key, data: GetSeriesDataForColumn(cityArray, field, _.groupBy(dayEntry, groupColumn)) });
    });

    let graphData = [];

    cities.forEach((entry) => {
        let city = { data: [], name: entry.name };

        xAxis.forEach((axis) => {
            if (entry.data[axis]) {
                city.data.push(parseInt(entry.data[axis]));
            } else {
                city.data.push(0);
            }
        });
        graphData.push(city);
    });

    return { data: graphData, categories: xAxis };
}

/**
 * 
 * @param {*} entry 
 * @param {*} previousValue 
 * @param {*} field 
 */
function FindSeriesDataforColumn(entry, previousValue, field) {
    // var previousValue = JSUtil.isUndefinedOrNull(previousValue)?0;
    if (field.indexOf('Max') != -1) {
        var previousValue = (previousValue || 0);
        return Math.max(entry, previousValue);
        // return entry > previousValue ? entry : previousValue;
    } else if (field.indexOf('Min') != -1) {
        if (isNaN(previousValue)) {
            return entry;
        } else {
            var previousValue = (previousValue || 0);
            return Math.min(entry, previousValue);
        }
    } else {
        return entry + (previousValue || 0);
    }
}

/**
 * 
 * @param {*} array 
 * @param {*} field 
 * @param {*} groupedArray 
 */
function GetSeriesDataForColumn(array, field, groupedArray) {
    if (field.indexOf('Avg') != -1) {
        Object.keys(array).forEach((index) => {
            array[index] = array[index] / groupedArray[index].length;
        });
        return array;
    } else {
        return array;
    }

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


import React, { Component } from 'react';
import { IsUndefinedOrNull } from './../Utils/common.utils';



export function getColumnsForListing(params, excludeStarter) {
    var columns = [];
    var selectedColumns = {};
    var includes = [];
    var includesArr = params.includes.split(",");
    var relationship = params.relationship;

    for (var i in includesArr) {
        var tempIncludes = includesArr[i].split(".");
        var starter = params.starter;
        for (var j in tempIncludes) {
            starter += "." + tempIncludes[j];
            includes.push(starter);
        }
    }

    !excludeStarter ? includes.unshift(params.starter) : null;
    for (var i in includes) {
        columns[includes[i]] = params.dictionary[(includes[i])];
    }
    // columns = params.dictionary;
    for (var i in columns) {
        var data = columns[i];
        for (var j in columns[i]) {
            var element = i + "." + columns[i][j].column_name;

            columns[i][j]["path"] = element.replace(/\.?([A-Z]+)/g, function (x, y) {
                return "_" + y.toLowerCase();
            }).replace(/^_/, "").replace(params.starter, "").replace(".", "");
            columns[i][j]["parent"] = i;

            var relationIndex = columns[i][j]["parent"];

            if (!IsUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex)&& relationship[relationIndex].hasOwnProperty('related_model')) {
                columns[i][j].reference_route = relationship[relationIndex].related_model.state_name;
                columns[i][j].parentColumn = relationship[relationIndex].related_column ? relationship[relationIndex].related_column.column_name : null;
            }

            selectedColumns[columns[i][j].parent + "." + columns[i][j].id] = columns[i][j];
            // selectedColumns[columns[i][j].id] = columns[i][j];
        }
    }
    return selectedColumns;
};


/**
 * returns final list of selected columns to be shown on each car for each row
 * Takes columns list being prepared by 'GetColumnsForListing' method, preference list and relationship
 * same as TableFactory.createFinalObject
 * @param  {object} columns
 * @param  {object} selectedColumns
 * @param  {object} relationship
 */
export function CreateFinalColumnsForQueryListing(columns, selectedColumns, relationship) {
    const finalColumnDefinition = [];
    let splitEnabled = false;

    for (let i in selectedColumns) {
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

            }
        } else {
            finalColumnDefinition[i] = {
                column_name: selected, column_type: null
            };
            splitEnabled = !splitEnabled;
        }

        // if it is a seperator
        // Shubham please fix this
        if (selected.column_name == "seperator") {
            finalColumnDefinition[i] = selected;
        }
    }

    return finalColumnDefinition;
}
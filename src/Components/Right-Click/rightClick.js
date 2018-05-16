import React, { Component } from 'react';
import './rightClick.css';

import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";


export default class RightClick extends Component {

    constructor(props) {
        super(props);
    }

    rowOptions = [{
        id: 0,
        name: "Copy Row Id",
        icon: 'fa-copy',
        onClick: (data) => {
            let id = data.id;
            CopyToClipBoard(id);
            ToastNotifications.success("Id - " + id + " has been copied");
        }
    }, {
        id: 1,
        name: "Show Matching",
        icon: 'fa-retweet',
        onClick: (data) => {
            this.filterTable(data, [" LIKE ", " = "]);
            return data.selectedColumn.path.split(".").length < 3;

        }
    }, {
        id: 2,
        name: "Filter Out",
        icon: 'fa-columns',
        onClick: function (data) {

        }
    }, {
        id: 3,
        name: "Filter More",
        icon: 'fa-filter',
        onClick: function (data) {

        }
    }, {
        id: 4,
        name: "Aggregation",
        icon: 'fa-chart-line',
        onClick: function (data) {

        }
    }];

    filterTable = (data, method) => {
        console.log(data, method);
        // if (data.selectedColumn.path.split(".").length == 1) { // for columns which is child of table itself
        //     var url = $location.search();
        //     if (url.query) { // if previous query present then it will executed                    var newquery = data.selectedColumn.column_name;
        //         var a = {};
        //         var f = 0;
        //         a = url.query.split(" AND ");
        //         for (var i = 0; i < a.length; i++) { // for checking overlapping query
        //             var b = {};
        //             b = a[i].split(" LIKE ");
        //             if (newquery == b[0]) {
        //                 f = 1;
        //             }
        //         }
        //         if (f == 0) { // if not overlappin
        //             query = url.query + ' AND ' + data.selectedColumn.column_name + method[0] + "'" + data.$parent.listingRow[data.selectedColumn.column_name] + "'";
        //             $location.search({
        //                 query: query
        //             });
        //         } else { // if overlappin
        //             query = url.query;
        //             $location.search({
        //                 query: query
        //             });
        //         }
        //     } else { // if previous query not present then it will executed
        //         query = data.selectedColumn.column_name + method[0] + "'" + data.$parent.listingRow[data.selectedColumn.column_name] + "'";
        //         $location.search({
        //             query: query
        //         });
        //     }
        // } else if (data.selectedColumn.path.split(".").length == 2) { // This will executed when showmatching clicked second time
        //     var url = $location.search();
        //     var regex = /.([^.]*)$/; // filters out anything before first '.'
        //     var path = data.selectedColumn.path.replace(regex, "");
        //     if (url.query) { // if previous query present then it will executed
        //         var newquery = data.selectedColumn["parentColumn"];
        //         var a = {};
        //         var f = 0;
        //         a = url.query.split(" AND ");
        //         for (var i = 0; i < a.length; i++) { // for checking overlapping query
        //             var b = {};
        //             b = a[i].split(" = ");
        //             if (newquery == b[0]) {
        //                 f = 1;
        //             }
        //         }
        //         if (f == 0) { // if not overlapping
        //             query = url.query + ' AND ' + data.selectedColumn["parentColumn"] + method[1] + "'" + data.$parent.listingRow[path]["id"] + "'";
        //             $location.search({
        //                 query: query
        //             });
        //         } else { // if overlapping
        //             query = url.query;
        //             $location.search({
        //                 query: query
        //             });
        //         }
        //     } else { // if previous query not present then it will executed
        //         query = data.selectedColumn["parentColumn"] + method[1] + "'" + data.$parent.listingRow[path]["id"] + "'";
        //         $location.search({
        //             query: query
        //         });
        //     }
        // }
    }


    render() {

        const { rowTemplate, renderTag, selectedColumn, listingRow } = this.props;

        return (
            <div>
                <ContextMenuTrigger renderTag={renderTag} name={listingRow.name} id={listingRow.id + selectedColumn.path} holdToDisplay={1000}>
                    <span>
                        {
                            rowTemplate ?
                                rowTemplate({ listingRow, selectedColumn }) :
                                eval('listingRow.' + selectedColumn.path)
                        }
                    </span>
                </ContextMenuTrigger>

                <ContextMenu id={listingRow.id + selectedColumn.path} className="context-menu">
                    {
                        this.rowOptions.map((rowOption, key) => {
                            return (
                                <MenuItem key={key} onClick={() => rowOption.onClick(listingRow)} data={listingRow}>
                                    <i className={`fas ${rowOption.icon}`} /> {rowOption.name}
                                </MenuItem>
                            )
                        })
                    }
                </ContextMenu>
            </div>
        )
    }
}
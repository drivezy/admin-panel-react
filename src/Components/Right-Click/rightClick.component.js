import React, { Component } from 'react';
import './rightClick.css';

import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { Location } from './../../Utils/location.utils';

export default class RightClick extends Component {

    urlParams = Location.search();

    constructor(props) {
        super(props);
    }

    rowOptions = [{
        id: 0,
        name: "Copy Row Id",
        icon: 'fa-copy',
        onClick: (data) => {
            let id = data.listingRow.id;
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
        onClick: (data) => {
            this.filterTable(data, [" NOT LIKE ", " != "]);
            return data.selectedColumn.path.split(".").length < 3;
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

        const paramProps = {
            history: data.history, match: data.match
        };

        console.log(data, method);
        let query = '';
        if (data.selectedColumn.path.split(".").length == 1) { // for columns which is child of table itself
            // var url = Location.search();
            if (this.urlParams.query) { // if previous query present then it will executed                    var newquery = data.selectedColumn.column_name;
                var a = {};
                var f = 0;
                a = this.urlParams.query.split(" AND ");
                for (var i = 0; i < a.length; i++) { // for checking overlapping query
                    var b = {};
                    b = a[i].split(" LIKE ");
                    if (newquery == b[0]) {
                        f = 1;
                    }
                }
                if (f == 0) { // if not overlappin
                    query = this.urlParams.query + ' AND ' + data.selectedColumn.column_name + method[0] + "'" + data.$parent.listingRow[data.selectedColumn.column_name] + "'";
                    Location.search({
                        query: query
                    });
                } else { // if overlappin
                    query = this.urlParams.query;
                    Location.search({
                        query: query
                    });
                }
            } else { // if previous query not present then it will executed
                query = data.selectedColumn.column_name + method[0] + "'" + data.$parent.listingRow[data.selectedColumn.column_name] + "'";
                Location.search({
                    query: query
                });
            }
        } else if (data.selectedColumn.path.split(".").length == 2) { // This will executed when showmatching clicked second time
            var regex = /.([^.]*)$/; // filters out anything before first '.'
            var path = data.selectedColumn.path.replace(regex, "");
            if (this.urlParams.query) { // if previous query present then it will executed
                var newquery = data.selectedColumn["parentColumn"];
                var a = {};
                var f = 0;
                a = this.urlParams.query.split(" AND ");
                for (var i = 0; i < a.length; i++) { // for checking overlapping query
                    var b = {};
                    b = a[i].split(" = ");
                    if (newquery == b[0]) {
                        f = 1;
                    }
                }
                if (f == 0) { // if not overlapping
                    query = this.urlParams.query + ' AND ' + data.selectedColumn["parentColumn"] + method[1] + "'" + data.$parent.listingRow[path]["id"] + "'";
                    Location.search({
                        query: query
                    });
                } else { // if overlapping
                    query = this.urlParams.query;
                    Location.search({
                        query: query
                    });
                }
            } else { // if previous query not present then it will executed

                const urlParams = this.urlParams;

                query = data.selectedColumn["parentColumn"] + method[1] + "'" + data.listingRow[path]["id"] + "'";
                // Location.search({
                //     query: query
                // });
                urlParams.query = query;
                Location.search(this.urlParams, { props: paramProps });
            }
        }
    }


    render() {

        const { rowTemplate, renderTag, selectedColumn, listingRow, history, match } = this.props;

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
                                <MenuItem key={key} onClick={() => rowOption.onClick(this.props)} data={this.props}>
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
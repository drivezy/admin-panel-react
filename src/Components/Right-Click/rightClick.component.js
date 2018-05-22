import React, { Component } from 'react';
import './rightClick.css';

import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";

import GLOBAL from './../../Constants/global.constants';

import { Get } from './../../Utils/http.utils';
import { BuildUrlForGetCall } from './../../Utils/common.utils';
import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { Location } from './../../Utils/location.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';

export default class RightClick extends Component {

    urlParams = Location.search();

    aggregationOperators = [{ name: 'Sum' }, { name: 'Avg' }, { name: 'Max' }, { name: 'Min' }];

    constructor(props) {
        super(props);
    }

    rowOptions = [{
        id: 0,
        name: "Copy Row Id",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let id = data.listingRow.id;
            CopyToClipBoard(id);
            ToastNotifications.success("Id - " + id + " has been copied");
        }
    }, { subMenu: null }, {
        id: 1,
        name: "Show Matching",
        icon: 'fa-retweet',
        subMenu: false,
        onClick: (data) => {
            this.filterTable(data, [" LIKE ", " = "]);
            return data.selectedColumn.path.split(".").length < 3;
        }
    }, {
        id: 2,
        name: "Filter Out",
        icon: 'fa-columns',
        subMenu: false,
        onClick: (data) => {
            this.filterTable(data, [" NOT LIKE ", " != "]);
            return data.selectedColumn.path.split(".").length < 3;
        }
    }, {
        id: 3,
        name: "Filter More",
        icon: 'fa-filter',
        subMenu: false,
        onClick: (data) => {
            this.props.filteredColumn(data.selectedColumn);
            return data.selectedColumn.path.split(".").length < 3;
        }
    }, {
        id: 4,
        name: "Aggregation",
        icon: 'fa-bar-chart',
        subMenu: true,
        onClick: (data, operator) => {
            console.log(data, operator);
            this.openAggregationResult(operator.name.toLowerCase(), operator.name + ' of ' + data.selectedColumn.display_name + ' equals : ', data)
        }
    }, { subMenu: null },
    {
        id: 4,
        name: "Redirect Menu Detail",
        icon: 'fa-deaf',
        subMenu: false,
        onClick: (data) => {
            const { history, match } = this.props;

            let pageUrl = "/menuDef/" + data.menuDetail.menuId

            history.push(`${pageUrl}`);
        }
    }, {
        id: 4,
        name: "Redirect Model Detail",
        icon: 'fa-info-circle',
        subMenu: false,
        onClick: (data) => {
            const { history, match } = this.props;

            let pageUrl = "/modelDetails/" + data.menuDetail.model.id

            history.push(`${pageUrl}`);
        }
    }];

    openAggregationResult = async (operator, caption, data) => {

        let options = GetDefaultOptions();
        options.aggregation_column = data.selectedColumn.column_name;
        options.aggregation_operator = operator;

        const url = BuildUrlForGetCall(data.menuDetail.url, options);

        const result = await Get({ url });

        if (result.success) {
            ToastNotifications.success(caption + result.response);
        }
    }

    filterTable = (data, method) => {

        const paramProps = {
            history: data.history, match: data.match
        };

        console.log(data, method);
        let query = '';
        if (data.selectedColumn.path.split(".").length == 1) { // for columns which is child of table itself
            if (this.urlParams.query) { // if previous query present then it will executed
                let a = {};
                let f = 0;
                a = this.urlParams.query.split(" AND ");
                for (let i = 0; i < a.length; i++) { // for checking overlapping query
                    let b = {};
                    let newquery;
                    b = a[i].split(" LIKE ");
                    if (newquery == b[0]) {
                        f = 1;
                    }
                }
                if (f == 0) { // if not overlappin

                    query = this.urlParams.query + ' AND ' + data.selectedColumn.column_name + method[0] + "'" + data.listingRow[data.selectedColumn.column_name] + "'";

                    this.urlParams.query = query;
                    Location.search(this.urlParams, { props: paramProps });
                } else { // if overlappin

                    query = this.urlParams.query;

                    this.urlParams.query = query;
                    Location.search(this.urlParams, { props: paramProps });
                }
            } else { // if previous query not present then it will executed

                query = data.selectedColumn.column_name + method[0] + "'" + data.listingRow[data.selectedColumn.column_name] + "'";

                this.urlParams.query = query;
                Location.search(this.urlParams, { props: paramProps });
            }
        } else if (data.selectedColumn.path.split(".").length == 2) { // This will executed when showmatching clicked second time
            let regex = /.([^.]*)$/; // filters out anything before first '.'
            let path = data.selectedColumn.path.replace(regex, "");
            if (this.urlParams.query) { // if previous query present then it will executed
                let newquery = data.selectedColumn["parentColumn"];
                let a = {};
                let f = 0;
                a = this.urlParams.query.split(" AND ");
                for (let i = 0; i < a.length; i++) { // for checking overlapping query
                    let b = {};
                    b = a[i].split(" = ");
                    if (newquery == b[0]) {
                        f = 1;
                    }
                }
                if (f == 0) { // if not overlapping
                    query = this.urlParams.query + ' AND ' + data.selectedColumn["parentColumn"] + method[1] + "'" + data.listingRow[path]["id"] + "'";
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

                query = data.selectedColumn["parentColumn"] + method[1] + "'" + data.listingRow[path]["id"] + "'";

                this.urlParams.query = query;

                Location.search(this.urlParams, { props: paramProps });
            }
        }
    }


    render() {

        const { rowTemplate, renderTag, selectedColumn, listingRow, history, match, menuDetail, filteredColumn } = this.props;
        let displayName;
        try {
            displayName = eval('listingRow.' + selectedColumn.path)
        } catch (e) {
            displayName = ''
        }
        return (
            <div>
                <ContextMenuTrigger renderTag={renderTag} id={listingRow.id + selectedColumn.path} holdToDisplay={1000}>
                    <span>
                        {
                            rowTemplate ?
                                rowTemplate({ listingRow, selectedColumn }) :
                                displayName
                        }
                    </span>
                </ContextMenuTrigger>

                <ContextMenu id={listingRow.id + selectedColumn.path}>
                    {
                        this.rowOptions.map((rowOption, key) => {
                            if (rowOption.name) {
                                return (
                                    !rowOption.subMenu ?
                                        <MenuItem key={key} onClick={() => rowOption.onClick(this.props)} data={this.props}>
                                            <i className={`fa ${rowOption.icon}`} /> &nbsp;
                                            <span className="space-icon">{rowOption.name}</span>
                                        </MenuItem> :
                                        <SubMenu key={key} title={[<i key={1} className={`fa ${rowOption.icon}`} />, <span key={2}> {rowOption.name}</span>]}>
                                            {
                                                this.aggregationOperators.map((operator, index) => {
                                                    return (
                                                        <MenuItem key={index} onClick={() => rowOption.onClick(this.props, operator)} data={this.props}>
                                                            {operator.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </SubMenu>
                                )
                            } else {
                                return (<MenuItem key={key} divider />);
                            }
                        })
                    }
                </ContextMenu>
            </div>
        )
    }
}
import React, { Component } from 'react';
import './PortletTable.css';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import RightClick from './../../Components/Right-Click/rightClick.component';

import { Location } from './../../Utils/location.utils';
import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { Get } from './../../Utils/http.utils';
import { BuildUrlForGetCall } from './../../Utils/common.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';


export default class PortletTable extends Component {

    urlParams = Location.search();

    sortTypes = [{
        id: 0,
        icon: 'fa-sort-numeric-asc',
        caption: 'Sort Asc',
        type: 'asc'
    }, {
        id: 1,
        icon: 'fa-sort-numeric-desc',
        caption: 'Sort Desc',
        type: 'desc'
    }];

    // Preparing option for right click
    rowOptions = [{
        id: 0,
        name: "Copy Row Id",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let id = data.listingRow.id;
            CopyToClipBoard(id);
            ToastNotifications.success("Id - " + id + " has been copied");
        },
        disabled: false
    }, { subMenu: null }, {
        id: 1,
        name: "Show Matching",
        icon: 'fa-retweet',
        subMenu: false,
        onClick: (data) => {
            this.filterTable(data, [" LIKE ", " = "]);
            return data.selectedColumn.path.split(".").length < 3;
        },
        disabled: false
    }, {
        id: 2,
        name: "Filter Out",
        icon: 'fa-columns',
        subMenu: false,
        onClick: (data) => {
            this.filterTable(data, [" NOT LIKE ", " != "]);
            return data.selectedColumn.path.split(".").length < 3;
        },
        disabled: false
    }, {
        id: 3,
        name: "Filter More",
        icon: 'fa-filter',
        subMenu: false,
        onClick: (data) => {
            this.filterColumn(data.selectedColumn);
            return data.selectedColumn.path.split(".").length < 3;
        },
        disabled: false
    }, {
        id: 4,
        name: "Aggregation",
        icon: 'fa-chart-line',
        subMenu: true,
        onClick: (data, operator) => {
            console.log(data, operator);
            this.openAggregationResult(operator.name.toLowerCase(), operator.name + ' of ' + data.selectedColumn.display_name + ' equals : ', data)
        }, disabled: (data) => {
            return (data.selectedColumn.path.split('.').length != 1)
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
        },
        disabled: false
    }, {
        id: 4,
        name: "Redirect Model Detail",
        icon: 'fa-info-circle',
        subMenu: false,
        onClick: (data) => {
            const { history, match } = this.props;

            let pageUrl = "/modelDetails/" + data.menuDetail.model.id

            history.push(`${pageUrl}`);
        },
        disabled: false
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

    filterColumn = (column) => {
        let selected;
        if (column.path.split(".").length == 1) { // for columns which is child of table itself
            selected = column.column_name;
        } else if (column.path.split(".").length == 2) { // for reference columns (for e.g. Created by table in with any menu)
            selected = column.parentColumn;
        }

        if (typeof this.props.toggleAdvancedFilter == 'function') {
            this.props.toggleAdvancedFilter({ single: selected });
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            finalColumns: this.props.finalColumns,
            listing: this.props.listing,
            genericData: this.props.genericData,
            sortKey: '',
            reverse: false,
            dropdownOpen: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            finalColumns: nextProps.finalColumns,
            listing: nextProps.listing,
            genericData: nextProps.genericData
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.adjustWidth();
        }, 300)
    }


    // According to action width 
    // width of table is assigned
    adjustWidth = () => {
        const actionColumnEle = document.getElementsByClassName('action-column')[0];
        if (actionColumnEle) {
            var actionColumnWidth = actionColumnEle.clientWidth;
            var table = document.getElementsByClassName('table')[0];
            var tableWidth = table.clientWidth;

            var percent = (100 - (actionColumnWidth / tableWidth) * 100);

            table.setAttribute('style', 'width:calc(' + percent + '% - 2px )');
        }
    }

    dropdownToggle = (column) => {
        let dropdownOpen = this.state.dropdownOpen;

        dropdownOpen[column.id] = !dropdownOpen[column.id]

        this.setState({
            dropdownOpen
        });
    }

    onSort = (event, sortKey) => {
        const listing = this.state.listing;

        function generateSortFn(prop, reverse) {
            return function (a, b) {
                if (eval('a.' + prop) < eval('b.' + prop)) return reverse ? 1 : -1;
                if (eval('a.' + prop) > eval('b.' + prop)) return reverse ? -1 : 1;
                return 0;
            };
        }

        let reverse = this.state.reverse;

        if (this.state.sortKey == sortKey) {

            reverse = !reverse;
            listing.sort(generateSortFn(sortKey, reverse));

        } else {
            reverse = false;
            listing.sort(generateSortFn(sortKey, reverse));
        }

        this.setState({ listing, sortKey, reverse })
    }

    dropdownSortOnDB = (sort, column) => {
        const paramProps = {
            history: this.props.history, match: this.props.match
        };

        const urlParams = this.urlParams;

        urlParams.order = column.path;
        urlParams.sort = sort.type;
        Location.search(urlParams, { props: paramProps });

        if (sort.type === 'asc') {
            this.state.reverse = true;
        } else {
            this.state.reverse = false;
        }

        this.setState({
            sortKey: column.path,
        })

        this.dropdownToggle(column);
    };

    render() {

        const { genericData, finalColumns, listing } = this.state;
        const { history, match, menuDetail, rowTemplate, callback } = this.props;

        let renderItem;
        if (listing.length) {
            renderItem = <Table striped className="sortable">
                <thead>
                    <tr>
                        <th>
                        </th>
                        {
                            finalColumns.map((selectedColumn, key) => {
                                let conditionForSorting = (this.state.sortKey === (selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.column_name))) ? (this.state.reverse ? 'fa-long-arrow-up' : 'fa-long-arrow-down') : ''
                                return (
                                    <th className="column-header" key={key}>
                                        {/* Column Wrapper */}
                                        <div className="column-wrapper">
                                            {/* Column Title */}
                                            <div className="column-title printable">
                                                <a onClick={e => this.onSort(e, selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.headerName))}>
                                                    <span>{selectedColumn.display_name}</span>
                                                    <i className={`fa ${conditionForSorting}`} />
                                                </a>
                                            </div>
                                            {/* Column Title Ends */}

                                            {/* Filter Column */}
                                            {
                                                selectedColumn.path.split('.').length < 3 &&
                                                <div className="filter-column">
                                                    <a onClick={e => this.filterColumn(selectedColumn)}>
                                                        <i className="fa fa-filter"></i>
                                                    </a>
                                                </div>
                                            }
                                            {/* Filter Ends */}
                                            {/* DB Level */}

                                            {
                                                (selectedColumn.path.split('.').length == 1) && (selectedColumn.column_type != 118) &&
                                                (

                                                    <div className="db-level-sort">
                                                        {
                                                            <Dropdown isOpen={this.state.dropdownOpen[selectedColumn.id]} toggle={() => this.dropdownToggle(selectedColumn)}>
                                                                <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}>
                                                                    <a className="dropdown-link">
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                    </a>
                                                                </DropdownToggle>
                                                                <DropdownMenu>
                                                                    {
                                                                        this.sortTypes.map((sort, key) => {
                                                                            return (
                                                                                <div className="dropdown-item" key={key} onClick={e => this.dropdownSortOnDB(sort, selectedColumn)}>
                                                                                    <i className={`fa ${sort.icon}`} /> {sort.caption}
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </th>
                                )
                            })
                        }
                        <th className="action-header">
                            <span className="fa fa-cog fa-lg"></span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listing.map((listingRow, rowKey) => {

                            return (
                                <tr className="table-row" key={rowKey}>

                                    <td className="row-key">
                                        {rowKey + 1}
                                    </td>
                                    {
                                        finalColumns.map((selectedColumn, key) => {

                                            let displayName;
                                            try {
                                                displayName = eval('listingRow.' + selectedColumn.path)
                                            } catch (e) {
                                                displayName = ''
                                            }
                                            const html =
                                                rowTemplate ?
                                                    rowTemplate({ listingRow, selectedColumn }) :
                                                    displayName

                                            return (
                                                <td key={key} className='no-padding-strict'>
                                                    <RightClick html={html} history={history} match={match} key={key} renderTag="div" className='generic-table-td' rowOptions={this.rowOptions} listingRow={listingRow} selectedColumn={selectedColumn} menuDetail={menuDetail}></RightClick>
                                                </td>
                                            )
                                        })
                                    }
                                    <td className="action-column">
                                        <CustomAction history={history} genericData={genericData} actions={genericData.nextActions} listingRow={listingRow} placement={167} callback={callback} />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </Table>
        } else {
            renderItem = (
                <div className='no-data-to-show'>
                    No Data to show
                </div>
            )
        }


        return (
            <div>
                {renderItem}
            </div>
        );
    }
}

import React, { Component } from 'react';
import './queryTable.css';

import {
    Table, Dropdown, DropdownToggle, DropdownMenu
} from 'reactstrap';


import { RowTemplate } from './../../../Utils/generic.utils';
import { Location } from './../../../Utils/location.utils';


export default class QueryTable extends Component {

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

    constructor(props) {
        super(props);

        this.state = {
            filters: this.props.filters,
            finalColumns: this.props.finalColumns,
            listing: this.props.listing,
            queryData: this.props.queryData,
            sortKey: '',
            reverse: false,
            dropdownOpen: {},
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            finalColumns: nextProps.finalColumns,
            listing: nextProps.listing,
            queryData: nextProps.queryData
        });
    }

    componentDidMount() {

        // set zoom event
        window.onzoom = () => this.adjustWidth();


        // detect resize
        var oldresize = window.onresize;

        window.onresize = (e) => {
            // console.log(e);
            var event = window.event || e;
            if (typeof (oldresize) === 'function' && !oldresize.call(window, event)) {
                return false;
            }
            if (typeof (window.onzoom) === 'function') {
                return window.onzoom.call(window, event);
            }
        }
    }

    // According to action width 
    // width of table is assigned
    adjustWidth = () => {

        const tableBody = document.getElementsByClassName('table-body')[0];

        if (tableBody) {
            var bodyWidth = tableBody.clientWidth;
            var action = document.getElementsByClassName('table-actions')[0];
            var actionWidth = action.clientWidth;
            var percent = bodyWidth - actionWidth;

            var tableContent = document.getElementsByClassName('table-content')[0];
            tableContent.setAttribute('style', 'width:' + percent + 'px');
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
        const { queryData, finalColumns, listing } = this.state;

        const { history, match, menuDetail, rowTemplate, callback, tableType, rowOptions } = this.props;

        // As soon as rendering is done adjust the width according to action columns
        setTimeout(() => this.adjustWidth());

        let renderItem;

        if (listing.length) {
            renderItem = <div className="table-body">

                {/* Contents Table */}
                <div className="table-content">
                    <Table striped className="sortable">
                        <thead>
                            <tr>
                                <th>
                                </th>
                                {
                                    finalColumns &&
                                    finalColumns.map((selectedColumn, key) => {
                                        // let conditionForSorting = (this.state.sortKey === (selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.column_name))) ? (this.state.reverse ? 'fa-long-arrow-up' : 'fa-long-arrow-down') : ''
                                        return (
                                            <th className="column-header" key={key}>
                                                {selectedColumn.display_name}

                                            </th>
                                        )
                                    })
                                }
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
                                                 finalColumns &&
                                                 finalColumns.map((selectedColumn, key) => {
                                                    // const html =
                                                    //     rowTemplate ?
                                                    //         rowTemplate({ listingRow, selectedColumn })
                                                    //         :
                                                    //         RowTemplate({ listingRow, selectedColumn });

                                                    return (
                                                        <td key={key} className=''>
                                                            {eval('listingRow.' + selectedColumn.column_name)}
                                                        </td>
                                                    )
                                                })
                                            }


                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
                {/* Content Table Ends */}

                {/* Actions Table */}
                <div className="table-actions">
                    <Table striped className="sortable">
                        <thead>
                            <tr>
                                <th className="action-header">
                                    <span className="fa fa-cog fa-lg"></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listing.map((listingRow, rowKey) => (
                                    <tr className="table-row" key={rowKey}>
                                        <td className="action-column">
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
                {/* Actions Table Ends */}
            </div>
        } else {
            renderItem = (
                <div className='no-data-to-show'>
                    No Data to show
                </div>
            )
        }

        return (
            <div className="table-container">
                {renderItem}
            </div>
        );
    }
}
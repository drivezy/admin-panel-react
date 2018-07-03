import React, { Component } from 'react';
import './PortletTable.css';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import RightClick from './../../Components/Right-Click/rightClick.component';

import { RowTemplate } from './../../Utils/generic.utils';
import { Location } from './../../Utils/location.utils';
import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastUtils from './../../Utils/toast.utils';

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

    headerOptions = [{
        id: 0,
        name: "Copy Actual Name",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let prop = data.selectedColumn.name;
            CopyToClipBoard(prop);
            ToastUtils.success({ description: "Actual name " + data.selectedColumn.name + " has been copied", title: 'Actual Name' });
        }
    }];

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

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            finalColumns: nextProps.finalColumns,
            listing: nextProps.listing,
            genericData: nextProps.genericData
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

        dropdownOpen[column.name] = !dropdownOpen[column.name]

        this.setState({
            dropdownOpen
        });
    }

    onSort = (event, sortKey) => {
        const listing = this.state.listing;

        function generateSortFn(prop, reverse) {
            return function (a, b) {
                if (a[prop] < b[prop]) return reverse ? 1 : -1;
                // if (eval('a.' + prop) < eval('b.' + prop)) return reverse ? 1 : -1;
                if (a[prop] > b[prop]) return reverse ? -1 : 1;
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

        urlParams.order = column.name;
        urlParams.sort = sort.type;
        Location.search(urlParams, { props: paramProps });

        if (sort.type === 'asc') {
            this.state.reverse = true;
        } else {
            this.state.reverse = false;
        }

        this.setState({
            sortKey: column.name,
        })

        this.dropdownToggle(column);
    };

    render() {
        const { genericData, finalColumns, listing } = this.state;

        const { history, match, menuDetail, rowTemplate, callback, tableType, rowOptions, source = 'model', parentData } = this.props;


        let rightClickOptions = [];

        if (genericData.nextActions.length) {
            for (let i in genericData.nextActions) {
                if (genericData.nextActions[i].as_context == 1) {
                    rightClickOptions = rightClickOptions.concat(rowOptions, genericData.nextActions[i]);
                }
            }
        } else {
            rightClickOptions = rightClickOptions.concat(rowOptions, []);
        }

        console.log(rightClickOptions);

        // As soon as rendering is done adjust the width according to action columns
        setTimeout(() => this.adjustWidth());

        let renderItem;
        // console.log(finalColumns);

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
                                    finalColumns.map((selectedColumn, key) => {
                                        let conditionForSorting = (this.state.sortKey === (selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.name))) ? (this.state.reverse ? 'fa-long-arrow-up' : 'fa-long-arrow-down') : ''
                                        const html = <div className="column-wrapper">
                                            {/* Column Title */}
                                            <div className="column-title printable">
                                                <a onClick={e => this.onSort(e, selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.headerName))}>
                                                    <span>{selectedColumn.display_name}</span> &nbsp;
                                                <i className={`fa ${conditionForSorting}`} />
                                                </a>
                                            </div>
                                            {/* Column Title Ends */}

                                            {/* Filter Column */}
                                            {
                                                tableType == "listing" && selectedColumn && selectedColumn.path && selectedColumn.path.split('.').length < 3 &&
                                                <div className="filter-column">
                                                    <a onClick={e => this.filterColumn(selectedColumn)}>
                                                        <i className="fa fa-filter"></i>
                                                    </a>
                                                </div>
                                            }
                                            {/* Filter Ends */}
                                            {/* DB Level */}

                                            {
                                                (selectedColumn && selectedColumn.path.split('.').length == 2) && (selectedColumn.column_type != 118) &&
                                                (
                                                    tableType == "listing" &&
                                                    <div className="db-level-sort">
                                                        {
                                                            <Dropdown isOpen={this.state.dropdownOpen[selectedColumn.name]} toggle={() => this.dropdownToggle(selectedColumn)}>
                                                                <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}>
                                                                    <a className="dropdown-link">
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                    </a>
                                                                </DropdownToggle>
                                                                <DropdownMenu>
                                                                    {
                                                                        this.sortTypes.map((sort, key) =>
                                                                            <div className="dropdown-item" key={key} onClick={e => this.dropdownSortOnDB(sort, selectedColumn)}>
                                                                                <i className={`fa ${sort.icon}`} /> {sort.caption}
                                                                            </div>
                                                                        )
                                                                    }
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                        return (
                                            <th key={key} className=''>
                                                <RightClick html={html} history={history} match={match} key={key} renderTag="div" className='generic-table-td' rowOptions={this.headerOptions} selectedColumn={selectedColumn} menuDetail={menuDetail} starter={genericData.starter} />
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listing.map((listingRow, rowKey) =>


                                    <tr className="table-row" key={rowKey}>

                                        <td className="row-key">
                                            {rowKey + 1}
                                        </td>

                                        {
                                            finalColumns.map((selectedColumn, key) => {
                                                const html =
                                                    rowTemplate ?
                                                        rowTemplate({ listingRow, selectedColumn })
                                                        :
                                                        RowTemplate({ listingRow, selectedColumn });

                                                return (
                                                    <td key={key} className=''>
                                                        <RightClick html={html} history={history} match={match} key={key} renderTag="div" className='generic-table-td' rowOptions={rightClickOptions} listingRow={listingRow} selectedColumn={selectedColumn} menuDetail={menuDetail} starter={genericData.starter} callback={callback} source={source} genericData={genericData} />
                                                    </td>
                                                )
                                            })
                                        }


                                    </tr>

                                )
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
                                            <CustomAction parentData={parentData} menuDetail={menuDetail} history={history} source={source} genericData={genericData} actions={genericData.nextActions} listingRow={listingRow} callback={callback} />
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

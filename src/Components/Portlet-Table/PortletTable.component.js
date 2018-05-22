import React, { Component } from 'react';
import './PortletTable.css';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import RightClick from './../../Components/Right-Click/rightClick.component';

import { Location } from './../../Utils/location.utils';

export default class PortletTable extends Component {

    urlParams = Location.search();

    sortTypes = [{
        id: 0,
        icon: 'fa-sort-numeric-down',
        caption: 'Sort Asc',
        type: 'asc'
    }, {
        id: 1,
        icon: 'fa-sort-numeric-up',
        caption: 'Sort Desc',
        type: 'desc'
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
            var table = document.getElementsByClassName('table-container')[0];
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

    render() {

        const sortTypes = [{
            id: 0,
            icon: 'fa-sort-numeric-down',
            caption: 'Sort Asc',
            type: 'asc'
        }, {
            id: 1,
            icon: 'fa-sort-numeric-up',
            caption: 'Sort Desc',
            type: 'desc'
        }];

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
                                let conditionForSorting = (this.state.sortKey === (selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.column_name))) ? (this.state.reverse ? 'fa-chevron-up' : 'fa-chevron-down') : ''
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
                                                                        <i className="fa fa-sort-amount-down"></i>
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
                                        finalColumns.map((selectedColumn, key) => (
                                            <td key={key}>
                                                <RightClick history={history} match={match} key={key} renderTag="div" rowTemplate={rowTemplate} listingRow={listingRow} selectedColumn={selectedColumn} menuDetail={menuDetail} filteredColumn={this.filterColumn}></RightClick>
                                            </td>
                                        ))
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
            <div className="table-container">
                {renderItem}
            </div>
        );
    }
}

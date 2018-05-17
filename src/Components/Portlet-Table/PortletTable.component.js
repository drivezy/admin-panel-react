import React, { Component } from 'react';
import './PortletTable.css';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import RightClick from './../../Components/Right-Click/rightClick.component';

export default class PortletTable extends Component {

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
            var table = document.getElementsByClassName('table')[0];
            var tableWidth = table.clientWidth;

            var percent = (100 - (actionColumnWidth / tableWidth) * 100);

            table.setAttribute('style', 'width:calc(' + percent + '% - 2px )');
        }
    }

    toggle = (column) => {
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


    render() {

        const { genericData, finalColumns, listing, callback, rowTemplate } = this.state;
        const { history, match } = this.props;
        return (
            <Table striped className="sortable">
                <thead>
                    <tr>
                        <th>
                        </th>
                        {
                            finalColumns.map((selectedColumn, key) => {
                                return (
                                    <th className="column-header" key={key}>
                                        {/* Column Wrapper */}
                                        <div className="column-wrapper">
                                            {/* Column Title */}
                                            <div className="column-title printable">
                                                <a onClick={e => this.onSort(e, selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.headerName))}>
                                                    <span>{selectedColumn.display_name}</span>
                                                    <i className={`fas ${(this.state.sortKey === (selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.column_name))) ? (this.state.reverse ? 'fa-chevron-up' : 'fa-chevron-down') : ''}`} />
                                                </a>
                                            </div>
                                            {/* Column Title Ends */}

                                            {/* Filter Column */}
                                            {
                                                selectedColumn.path.split('.').length < 3 &&
                                                <div className="filter-column">
                                                    <a ng-click="portlet.preventDefault($event);portlet.filterColumn(select-edColumn)">
                                                        <i className="fas fa-filter"></i>
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
                                                            <Dropdown isOpen={this.state.dropdownOpen[selectedColumn.id]} toggle={() => this.toggle(selectedColumn)}>
                                                                <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}>
                                                                    <a className="dropdown-link">
                                                                        <i className="fas fa-sort-amount-down"></i>
                                                                    </a>
                                                                </DropdownToggle>
                                                                <DropdownMenu>
                                                                    {
                                                                        this.sortTypes.map((sort, key) => {
                                                                            return (
                                                                                <div className="dropdown-item" key={key} onClick={e => this.sortOnDB(sort, selectedColumn.path)}>
                                                                                    <i className={`fas ${sort.icon}`} /> {sort.caption}
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
                                                <RightClick history={history} match={match} key={key} renderTag="div" rowTemplate={rowTemplate} listingRow={listingRow} selectedColumn={selectedColumn}></RightClick>
                                            </td>
                                        ))
                                    }
                                    <td className="custom-action action-column">
                                        <CustomAction history={history} genericData={genericData} actions={genericData.nextActions} listingRow={listingRow} placement={167} callback={callback} />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </Table>
        );
    }
}

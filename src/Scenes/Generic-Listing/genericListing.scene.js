import React, { Component } from 'react';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle,
} from 'reactstrap';

import './genericListing.css';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { GetListingRecord } from './../../Utils/genericListing.utils';

export default class GenericListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            genericData: {}
        };
    }

    componentDidMount() {
        this.getMenuData();
    }

    getMenuData = async () => {
        const { queryString } = this.state;
        const { menuId } = this.props;
        const result = await GetMenuDetail(menuId);
        if (result.success) {
            console.log(result.response);
            const { response = {} } = result;
            const menuDetail = ConvertMenuDetailForGenericPage(response || {});
            if (typeof response.controller_path == 'string' && response.controller_path.includes('genericListingController.js') != -1) {
                // this.setState({ menuDetail });
                this.state.menuDetail = menuDetail
                this.getListingData();
            }
        }
    }

    getListingData = () => {
        const { menuDetail, genericData, urlParameter } = this.state;
        GetListingRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, urlParameter });
    }

    dataFetched = (genericData) => {
        // const totalPages = Math.ceil((genericData.stats.records / genericData.stats.count));

        // if (totalPages > 7) {
        //     // this.setState({ pagesOnDisplay: 7 });
        //     this.state.pagesOnDisplay = 7;
        // } else {
        //     // this.setState({ pagesOnDisplay: totalPages });
        //     this.state.pagesOnDisplay = Math.ceil(totalPages);
        // }
        console.log('genericData', genericData);
        this.setState({ genericData });
    }

    render() {
        const { genericData = {}, pagesOnDisplay, menuDetail = {} } = this.state;
        const { listing = [], finalColumns = [] } = genericData;

        return (
            <div className="generic-listing-container">
                <Card>
                    <CardBody>
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>
                                    </th>
                                    {
                                        finalColumns.map((selectedColumn, key) => (
                                            <th className="column-header" key={key}>
                                                {/* Column Wrapper */}
                                                <div className="column-wrapper">
                                                    {/* Column Title */}
                                                    <div className="column-title printable">
                                                        {selectedColumn.display_name}
                                                        {/* {{ b.columnTitle || selectedColumn.display_name }} */}
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
                                                                <span>
                                                                    <a className="dropdown-link" id="simple-dropdown">
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                    </a>

                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                    {/* <div class="db-level-sort" ng-if="selectedColumn.path.split('.').length==1&&selectedColumn.column_type!=118">
                                                        <span uib-dropdown on-toggle="toggled(open)">
                                                            <a class="dropdown-link" id="simple-dropdown" uib-dropdown-toggle>
                                                                <i class="fa fa-sort-amount-asc"></i>
                                                            </a>
                                                            <ul class="dropdown-menu" uib-dropdown-menu aria-labelledby="simple-dropdown">
                                                                <li ng-repeat="sort in portlet.sortTypes" ng-click="portlet.sortOnDB(sort, selectedColumn.path)">
                                                                    <a>
                                                                        <i class="fa {{sort.icon}}"></i>
                                                                        {{ sort.caption }}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </span>
                                                    </div> */}
                                                    {/* DB Level Ends */}
                                                </div>
                                            </th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listing.map((listingRow, rowKey) => (
                                        <tr className="table-row" key={rowKey}>

                                            <td>
                                                {rowKey + 1}
                                            </td>

                                            {
                                                finalColumns.map((selectedColumn, key) => (
                                                    <td key={key}>
                                                        {eval('listingRow.' + selectedColumn.path)}
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        );
    }
}
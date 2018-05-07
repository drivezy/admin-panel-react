import React, { Component } from 'react';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import './genericListing.css';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage, CreateFinalColumns } from './../../Utils/generic.utils';
import { GetListingRecord } from './../../Utils/genericListing.utils';


import TableSettings from './../../Components/Table-Settings/TableSettings';

import PortletTable from './../../Components/Portlet-Table/PortletTable';

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
        this.setState({ genericData });
    }



    layoutChanges = (selectedColumns) => {

        let { genericData } = this.state;
        genericData.selectedColumns = selectedColumns;
        genericData.finalColumns = CreateFinalColumns(genericData.columns, selectedColumns, genericData.relationship);
        this.setState({ genericData });
    }

    render() {
        const { genericData = {}, pagesOnDisplay, menuDetail = {} } = this.state;
        const { listing = [], finalColumns = [] } = genericData;

        return (
            <div className="generic-listing-container">
                <div className="page-bar">
                    <div className="search-wrapper">

                    </div>
                    <div className="header-actions">

                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-sm btn-secondary">Left</button>
                            <button type="button" className="btn btn-sm btn-secondary">Middle</button>
                            <button type="button" className="btn btn-sm btn-secondary">Right</button>

                            {genericData.columns ? <TableSettings onSubmit={this.layoutChanges} listName={genericData.listName} selectedColumns={genericData.selectedColumns} columns={genericData.columns}>
                            </TableSettings>
                                : null}
                        </div>
                    </div>
                </div>
                <Card>
                    <CardBody>
                        {
                            (finalColumns && finalColumns.length) ?
                                <PortletTable genericData={genericData} finalColumns={finalColumns} listing={listing}></PortletTable> : null
                        }
                    </CardBody>
                </Card>
            </div>
        );
    }
}
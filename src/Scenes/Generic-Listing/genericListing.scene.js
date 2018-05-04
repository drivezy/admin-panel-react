import React, { Component } from 'react';

import { Table } from 'reactstrap';

import './genericListing.css';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { GetListingRecord } from './../../Utils/genericListing.utils';

import CustomAction from './../../Components/Custom-Action/CustomAction';
import ListingPagination from './../../Components/Listing-Pagination/ListingPagination';

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
        const { menuId, limit, page } = this.props;
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
        const { menuDetail, genericData, queryString } = this.state;
        GetListingRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, queryString });
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

                <Table striped>
                    <thead>
                        <tr>
                            {
                                finalColumns.map((selectedColumn, key) => (
                                    <th key={key}> {selectedColumn.display_name}</th>
                                ))
                            }
                            <th>
                                <span className="fa fa-cog fa-lg"></span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listing.map((listingRow, rowKey) => (
                                <tr key={rowKey}>
                                    {
                                        finalColumns.map((selectedColumn, key) => (
                                            <td key={key}>
                                                {listingRow[selectedColumn.path]}
                                                {/* {eval('listingRow.' + selectedColumn.path)} */}
                                            </td>
                                        ))
                                    }
                                    <CustomAction genericData={genericData} actions={genericData.nextActions} listingRow={listingRow} />
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <ListingPagination genericData={genericData} />
            </div>
        );
    }
}
import React, { Component } from 'react';

import { Table } from 'reactstrap';

import './genericListing.css';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { GetListingRecord } from './../../Utils/genericListing.utils';

import CustomAction from './../../Components/Custom-Action/CustomAction';

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
        const { menu_id } = queryString;
        const result = await GetMenuDetail(menu_id);
        if (result.success) {
            console.log(result.response);
            const { response = {} } = result;
            const menuDetail = ConvertMenuDetailForGenericPage(response || {});
            if (typeof response.controller_path == 'string' && response.controller_path.includes('genericListingController.js') != -1) {
                this.setState({ menuDetail });
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
                <h1 className="table-column-header">
                    Generic listing
                </h1>
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
                                    <CustomAction actions={genericData.nextActions} listingContent={listingRow} />
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}
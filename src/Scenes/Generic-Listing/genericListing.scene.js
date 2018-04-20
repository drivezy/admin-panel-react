import React, { Component } from 'react';
import './genericListing.css';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail } from './../../Utils/generic.utils';
import { ConvertMenuDetailForGenericListing, GetListingRecord } from './../../Utils/genericListing.utils';

export default class GenericListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            genericData: {}
        };
        console.log(this.state);
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
            const menuDetail = ConvertMenuDetailForGenericListing(response || {});
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
        return (
            <h1 className="generic-listing-container">
                Generic listing
            </h1>
        );
    }
}
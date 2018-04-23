import React, { Component } from 'react';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { GetDetailRecord } from './../../Utils/genericDetail.utils';

export default class GenericDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            portlet: {},
            tabs: {}
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
            const menuDetail = ConvertMenuDetailForGenericPage(response || {});
            if (typeof response.controller_path == 'string' && response.controller_path.includes('genericListingController.js') != -1) {
                menuDetail.listName = menuDetail.stateName.toLowerCase();
                this.setState({ menuDetail });
                this.getDetailRecord();
            }
        }
    }

    getDetailRecord = () => {
        const { menuDetail, genericData, urlParameter, params, queryString } = this.state;
        GetDetailRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, urlParameter: queryString });
    }

    dataFetched = ({ tabs, portlet }) => {
        console.log('genericData', tabs, portlet);
        this.setState({ portlet, tabs });
    }

    render() {
        return (
            <h1>
                Generic detail
            </h1>
        )
    }
}
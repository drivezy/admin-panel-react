import React, { Component } from 'react';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { GetDetailRecord } from './../../Utils/genericDetail.utils';

import { createFinalObject } from './../../Utils/table.utils';

import DetailPortlet from './../../Components/Detail-Portlet/DetailPortlet';
import DetailIncludes from './../../Components/Detail-Includes/DetailIncludes';

import TableSettings from './../../Components/Table-Settings/TableSettings';

import { TabContent, TabPane, Nav, NavItem, NavLink, Table } from 'reactstrap';


import './genericDetail.css';


import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';

export default class GenericDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            portlet: {},
            tabs: {},
            tabsPreference: {}
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
        const { menuDetail, genericData, urlParameter, params } = this.state;
        GetDetailRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, urlParameter: params });
    }

    dataFetched = ({ tabs, portlet }) => {
        this.setState({ portlet, tabs });
    }

    getColumn = (preference, dictionary) => {
        // return preference.column
    }

    layoutChanges = (changes) => {
        let { portlet } = this.state;
        portlet.finalColumns = changes;
        this.setState({ portlet });
    }

    render() {

        const { menuDetail = {}, portlet = {}, tabs = {} } = this.state;

        const { finalColumns = [], data = {} } = portlet;

        let selectedColumns = {};

        if (menuDetail.preference) {
            selectedColumns = JSON.parse(menuDetail.preference['menudef.detail.list'])
        }

        return (
            <div className="generic-detail-container">

                <div className="header">

                    <div className="left">
                    </div>
                    <div className="right">

                        {portlet.portletColumns ? <TableSettings onSubmit={this.layoutChanges} listName={portlet.listName} selectedColumns={selectedColumns} columns={portlet.portletColumns} finalColumns={finalColumns}>
                        </TableSettings>
                            : null}
                    </div>
                </div>


                {
                    finalColumns.length ?
                        <DetailPortlet data={data} finalColumns={finalColumns}>
                        </DetailPortlet> : null}

                {
                    tabs && tabs.includes ?
                        <DetailIncludes tabs={tabs} >
                        </DetailIncludes> : null
                }
            </div>
        )
    }
}
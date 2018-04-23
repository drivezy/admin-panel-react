import React, { Component } from 'react';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { GetDetailRecord } from './../../Utils/genericDetail.utils';

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
            tabs: {}
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
        console.log(tabs);
        this.setState({ portlet, tabs });
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {

        // console.log(portlet);
        const { portlet = {}, tabs = {} } = this.state;

        if (tabs.data) { }
        const { finalColumns = [], data = {} } = portlet;
        const tabsContent = this.state.tabs;

        // console.log(tabsContent);
        return (
            <div className="generic-detail-container">
                <Card>

                    {/* <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" /> */}
                    <CardBody>
                        <CardTitle>
                            {data.name}
                        </CardTitle>
                        <Row>
                            {finalColumns.map((selectedColumn, key) => (
                                <Col key={key} xs={selectedColumn.split ? '6' : '12'}>
                                    {selectedColumn.absPath ?

                                        <Row className="detail-entry" >
                                            <Col>
                                                <strong>
                                                    {selectedColumn.display_name}
                                                </strong>

                                            </Col>
                                            <Col>
                                                {data[selectedColumn.column_name]}
                                            </Col>
                                        </Row>
                                        : null}
                                </Col>
                            ))}
                        </Row>


                    </CardBody>
                </Card>

                <div className="tabs-container">



                    <Nav tabs>
                        {
                            tabs.data ?
                                Object.keys(tabs.data).map((tab, key) => (
                                    <NavItem key={key} >
                                        <NavLink
                                            className={`${this.state.activeTab === tabs.relationship[tab].id ? 'active' : ''}`}
                                            onClick={() => { this.toggle(tabs.relationship[tab].id); }}>
                                            {tabs.relationship[tab].display_name}
                                        </NavLink>
                                    </NavItem>
                                ))
                                : null}
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        {
                            tabs.data ?
                                Object.keys(tabs.data).map((tab, key) => (
                                    <TabPane key={key} tabId={tabs.relationship[tab].id}>

                                        {/* <Table striped>
                                            <thead>
                                                <tr>
                                                    {
                                                        finalColumns.map((selectedColumn, key) => (
                                                            <th key={key}> {selectedColumn.display_name}</th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    listing.map((listingRow, rowKey) => (
                                                        <tr key={rowKey}>
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
                                        </Table> */}


                                    </TabPane>
                                ))
                                : null}
                    </TabContent>
                </div>
            </div>
        )
    }
}
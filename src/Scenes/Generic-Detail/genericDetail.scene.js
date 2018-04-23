import React, { Component } from 'react';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { GetDetailRecord } from './../../Utils/genericDetail.utils';

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
        const { menuDetail, genericData, urlParameter, params } = this.state;
        GetDetailRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, urlParameter: params });
    }

    dataFetched = ({ tabs, portlet }) => {
        console.log('tabs', tabs);
        console.log('portlet', portlet);
        this.setState({ portlet, tabs });
    }

    render() {

        // console.log(portlet);
        const { portlet = {} } = this.state;

        const { finalColumns = [], data = {} } = portlet;

        console.log(finalColumns, data);

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
            </div>
        )
    }
}
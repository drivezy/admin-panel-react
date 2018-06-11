import React, { Component } from 'react';
import {
    Card, CardHeader, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col, Progress, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import classnames from 'classnames';

import GLOBAL from './../../Constants/global.constants';
import { Get } from './../../Utils/http.utils';

import TableWrapper from './../../Components/Table-Wrapper/tableWrapper.component';
import VehicleCard from './../../Components/Vehicle-Card/vehicleCard.component';


import './vehicleDetail.scene.css';


export default class VehicleDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vehicleDetail: {},
            tabContent: [],
            activeTab: 0
        };
    }

    componentDidMount() {
        this.getVehicleDetail();
    }

    getVehicleDetail = async () => {
        const { vehicleId } = this.props.match.params;
        const url = 'vehicle/' + parseInt(vehicleId) + '?includes=car,tracker,venue,vehicle_detail.vendor.vendor_user,permits.state,bookings.type,bookings.user,bookings.pickup_venue,bookings.drop_venue,bookings.status,documents.type,servicing.status,fueling,defects.severity,defects.damage_type,bookings.ride_return,bookings.feedback'
        const result = await Get({ url });

        if (result.success) {
            let vehicleDetail = result.response;
            let bookings = result.response.bookings;
            let defects = result.response.defects;
            let documents = result.response.documents;
            let servicing = result.response.servicing;
            let fueling = result.response.fueling;

            this.setState({
                vehicleDetail, tabContent: [
                    {
                        name: 'Bookings',
                        data: bookings,
                        columns: [{
                            field: "type.value",
                            label: "Type"
                        }, {
                            field: "token",
                            label: "PNR",
                            sref: "/booking/",
                            type: "sref",
                            id: "id"
                        }, {
                            field: "pickup_time",
                            label: "Pickup Time"
                        }, {
                            field: "drop_time",
                            label: "Drop Time"
                        }, {
                            field: "pickup_venue.name",
                            label: "Pickup Venue"
                        }, {
                            field: "drop_venue.name",
                            label: "Drop Venue"
                        }, {
                            field: "status.name",
                            label: "Status"
                        }]
                    }, {
                        name: 'Defects',
                        data: defects,
                        columns: [{
                            field: "severity.value",
                            label: "Severity"
                        }, {
                            field: "damage_type.value",
                            label: "Damage Type"
                        }, {
                            field: "defect_description",
                            label: "Defect Description"
                        }, {
                            field: "completion_comments",
                            label: "Completion Comments"
                        }, {
                            field: "completed_on",
                            label: "Completed On"
                        }]
                    }, {
                        name: 'Documents',
                        data: documents,
                        columns: [{
                            field: "document_link",
                            label: "Url",
                            href: "document_link",
                            type: "link"
                        }]
                    }, {
                        name: 'Servicing',
                        data: servicing,
                        columns: [{
                            field: "actual_service_date",
                            label: "Service Due Date"
                        }, {
                            field: "service_dueKms",
                            label: "Service Due Km"
                        }, {
                            field: "actual_service_date",
                            label: "Actual Service Date"
                        }, {
                            field: "actual_service_km",
                            label: "Actual Service Km"
                        }, {
                            field: "status.value",
                            label: "Servicing Status"
                        }, {
                            field: "id",
                            label: "Servicing Id"
                        }]
                    }, {
                        name: 'Fueling',
                        data: fueling,
                        columns: [{
                            field: "odo_reading",
                            label: "Odo Reading"
                        }, {
                            field: "amount",
                            label: "Amount"
                        }, {
                            field: "litres",
                            label: "Litres"
                        }, {
                            field: "fueling_time",
                            label: "Fueling Time"
                        }, {
                            field: "approved==1 ? 'Yes' : 'No'",
                            label: "Approved"
                        }]
                    }
                ]
            });


        }
    }

    toggle = (key, tab) => {
        this.setState({
            activeTab: key
        });
    }

    render() {
        const { vehicleDetail = {}, activeTab, tabContent = [] } = this.state;

        if (vehicleDetail.id) {
            return (
                <div className="vehicle-detail">
                    <br/>
                    <div className="vehicle-card-content">
                        <VehicleCard vehicle={vehicleDetail} />
                    </div>
                    <div className="vehicle-tabs">
                        <Card className="tabs-card">
                            <Nav tabs>
                                {
                                    tabContent.length ?
                                        tabContent.map((tab, key) => (
                                            <NavItem key={key}>
                                                <NavLink
                                                    className={classnames({ active: activeTab === key ? 'active' : '' })}
                                                    onClick={() => { this.toggle(key, tab); }}>
                                                    <i className="fa fa-bars"></i> {tab.name}
                                                </NavLink>
                                            </NavItem>
                                        ))
                                        : null
                                }
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                {
                                    tabContent.length ?
                                        tabContent.map((tab, key) => {
                                            if (activeTab == key) {
                                                return (
                                                    <TabPane className='relative' key={key} tabId={key}>
                                                        <TableWrapper listing={tab.data} columns={tab.columns}></TableWrapper>
                                                    </TabPane>
                                                )
                                            }
                                        })
                                        : null}
                            </TabContent>
                        </Card>
                    </div>
                </div>
            )
        } else {
            return (<div>No Data</div>);
        }
    }
}




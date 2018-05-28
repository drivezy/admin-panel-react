import React, { Component } from 'react';
import {
    Card, CardHeader, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col, Progress
} from 'reactstrap';
import classnames from 'classnames';

import GLOBAL from './../../Constants/global.constants';
import { Get } from './../../Utils/http.utils';



import './vehicleDetail.scene.css';

export default class VehicleDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vehicleDetail: {}
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
            const vehicleDetail = result.response;
            this.setState({ vehicleDetail });
        }
    }

    render() {

        const { vehicleDetail = {} } = this.state;

        return (
            <div className="vehicle-detail">
                {
                    vehicleDetail.id &&
                    <div>
                        <Card className="detail-card">
                            <CardHeader>
                                <span>All Vehicle Detail | {vehicleDetail.car.name} | {vehicleDetail.registration_number}</span>
                            </CardHeader>
                            <CardImg className="gray-border-bottom" width="100%" src={`${vehicleDetail.car.image}`}></CardImg>
                            <CardBody>
                                <CardTitle>Vehicle Detail</CardTitle>
                                <div className="gray-border-bottom">
                                </div>
                                <Row className="gray-border-bottom">
                                    <Col sm="6">
                                        <p>Caution Amount</p>
                                    </Col>
                                    <Col sm="6">
                                        <p>{vehicleDetail.car.caution_amount}</p>
                                    </Col>
                                </Row>
                                <Row className="gray-border-bottom">
                                    <Col sm="6">
                                        <p>Min Booking Duration</p>
                                    </Col>
                                    <Col sm="6">
                                        <p>{vehicleDetail.car.min_period / 60}</p>
                                    </Col>
                                </Row>
                                <Row className="gray-border-bottom">
                                    <Col sm="6">
                                        <p>Fuel Eficiency</p>
                                    </Col>
                                    <Col sm="6">
                                        <p>{vehicleDetail.car.fuel_efficiency}</p>
                                    </Col>
                                </Row>
                                <Row className="gray-border-bottom">
                                    <Col sm="6">
                                        <p>Extra Km Charges</p>
                                    </Col>
                                    <Col sm="6">
                                        <p>{vehicleDetail.car.extra_km_charges}</p>
                                    </Col>
                                </Row>
                                <Row className="gray-border-bottom">
                                    <Col sm="6">
                                        <p>Free Km Per Hour</p>
                                    </Col>
                                    <Col sm="6">
                                        <p>{vehicleDetail.car.distance}</p>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <div className="tabs-card">
                            
                        </div>
                    </div>
                }
            </div>
        )
    }
}
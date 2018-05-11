import React, { Component } from 'react';
import {
    Card, CardHeader, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col, Progress
} from 'reactstrap';
// import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Button, CardTitle, CardText, Row, Col, Progress } from 'reactstrap';
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
            console.log(vehicleDetail);
            this.setState({ vehicleDetail });
        }
    }

    render() {

        const { vehicleDetail = {} } = this.state;

        return (
            <div className="vehicle-detail">
                {
                    vehicleDetail.id &&
                    <Card>
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
                }
            </div>





            // <div className="vehicle-detail">
            //     {
            //         vehicleDetail.id &&
            //         <Card className="booking-panel-container">
            //             <CardHeader>
            //                 <span>All Vehicle Detail | {vehicleDetail.car.name} | {vehicleDetail.registration_number}</span>
            //             </CardHeader>
            //             <Row className="booking-panels">
            //                 <Col sm="4" className="no-padding">
            //                     <div className="booking-details">
            //                         <CardBody>
            //                             <img className="media-object width-100" src={`${vehicleDetail.car.image}`} alt="Car Image" />
            //                             <i className="fa fa-home roboto-medium opacity-8" aria-hidden="true"></i>
            //                             <span className="roboto-medium opacity-8">{vehicleDetail.venue.name}</span>
            //                         </CardBody>
            //                     </div>
            //                 </Col>
            //                 <Col sm="8" className="no-padding">
            //                     <CardBody>
            //                         <Row>
            //                             <Col sm="6">
            //                                 Caution Amount
            //                                 </Col>
            //                             <Col sm="6">
            //                                 {vehicleDetail.car.caution_amount}
            //                             </Col>
            //                         </Row>
            //                         <Row>
            //                             <Col sm="6">
            //                                 Min Booking Duration
            //                                 </Col>
            //                             <Col sm="6">
            //                                 {vehicleDetail.car.min_period / 60}
            //                             </Col>
            //                         </Row>
            //                         <Row>
            //                             <Col sm="6">
            //                                 Fuel Eficiency
            //                                 </Col>
            //                             <Col sm="6">
            //                                 {vehicleDetail.car.fuel_efficiency}
            //                             </Col>
            //                         </Row>
            //                         <Row>
            //                             <Col sm="6">
            //                                 Extra Km Charges
            //                                 </Col>
            //                             <Col sm="6">
            //                                 {vehicleDetail.car.extra_km_charges}
            //                             </Col>
            //                         </Row>
            //                         <Row>
            //                             <Col sm="6">
            //                                 Free Km Per Hour
            //                                 </Col>
            //                             <Col sm="6">
            //                                 {vehicleDetail.car.distance}
            //                             </Col>
            //                         </Row>
            //                         {vehicleDetail.vehicle_detail.speed_limit &&
            //                             <Row>
            //                                 <Col sm="6">
            //                                     Speed Limit
            //                                 </Col>
            //                                 <Col sm="6">
            //                                     {vehicleDetail.vehicle_detail.speed_limit}
            //                                 </Col>
            //                             </Row>}
            //                     </CardBody>
            //                 </Col>
            //             </Row>
            //         </Card>
            //     }
            // </div>
        )
    }
}
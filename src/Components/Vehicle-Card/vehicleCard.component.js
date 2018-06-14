import React, { Component } from 'react';

import {
    Card, CardHeader, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col, Progress, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';

// import './../Right-Click'

import './vehicleCard.css';

export default class VehicleCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vehicle: props.vehicle,
        }
    }
    render() {
        const { vehicle = {} } = this.state;
        console.log(vehicle);
        return (
            <Card className="detail-card">
                <CardHeader >
                    <div>
                        <span>{vehicle.car.name} </span>

                    </div>
                    <div>
                        <span>{vehicle.registration_number}</span>

                    </div>
                </CardHeader>
                <CardImg className="" width="100%" src={`${vehicle.car.image}`}></CardImg>
                <CardBody>
                    <CardTitle className="vehicle-detail-header">Vehicle Detail</CardTitle>
                    <Row className="">
                    </Row>
                    <Row className="">
                        <Col sm="6">
                            <p>Caution Amount</p>
                        </Col>
                        <Col sm="6">
                            <p className="text-right" >₹ {vehicle.car.caution_amount}</p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col sm="6">
                            <p>Min Booking Duration</p>
                        </Col>
                        <Col sm="6">
                            <p className="text-right">{vehicle.car.min_period / 60} hr</p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col sm="6">
                            <p>Fuel Efficiency</p>
                        </Col>
                        <Col sm="6">
                            <p className="text-right">{vehicle.car.fuel_efficiency} km/hr</p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col sm="6">
                            <p>Extra Km Charges</p>
                        </Col>
                        <Col sm="6">
                            <p className="text-right">₹ {vehicle.car.extra_km_charges}</p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col sm="6">
                            <p>Free Km Per Hour</p>
                        </Col>
                        <Col sm="6">
                            <p className="text-right">{vehicle.car.distance} km</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}


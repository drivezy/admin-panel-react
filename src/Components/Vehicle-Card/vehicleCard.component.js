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

                    <div className="row-data">
                        <div className="field-label">
                            Caution Amount
                        </div>
                        <div className="field-data">
                            ₹ {vehicle.car.caution_amount}
                        </div>
                    </div>

                    <div className="row-data">
                        <div className="field-label">
                            Min Booking Duration
                        </div>
                        <div className="field-data">
                            {vehicle.car.min_period / 60} hr
                        </div>
                    </div>

                    <div className="row-data">
                        <div className="field-label">
                            Fuel Efficiency
                        </div>
                        <div className="field-data">
                            {vehicle.car.fuel_efficiency} km/hr
                        </div>
                    </div>

                    <div className="row-data">
                        <div className="field-label">
                            Extra Km Charges
                        </div>
                        <div className="field-data">
                            ₹ {vehicle.car.extra_km_charges}
                        </div>
                    </div>


                    <div className="row-data">
                        <div className="field-label">
                            Free Km Per Hour
                        </div>
                        <div className="field-data">
                            {vehicle.car.distance} km                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }
}


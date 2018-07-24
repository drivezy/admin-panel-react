import React, { Component } from 'react';
import { Card, Row, Col, Collapse, Button, CardBody } from 'reactstrap';
import './../../Components/Booking/Components/Booking-Ride-Return/bookingRideReturn.component';
import {TruncateDecimal} from './../../Utils/js.utils';
import './summaryCard.css';

export default class SummaryCard extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            bookingData: props.bookingData,
            collapse: false

        };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        const { bookingData = {} } = this.state;


        let paidAmount = 0;
        if (bookingData.payment && bookingData.payment.length) {
            bookingData.payment.forEach(function (data) {
                paidAmount += parseFloat(data.amount);
            });
        }

        let fairAmount = 0;
        if (bookingData.collection && bookingData.collection.length) {
            bookingData.collection.forEach(function (data) {
                fairAmount += parseFloat(data.amount);
            });
        }

        if (bookingData.extension && bookingData.extension.length) {
            let approvedExtensionCost = 0;
            bookingData.extension.forEach(function (data) {
                if (data.approved == 1 && !data.deleted_at) {
                    approvedExtensionCost += parseFloat(data.cost);
                }
            });
            if (approvedExtensionCost > 0) {
                bookingData.tentative_amount += approvedExtensionCost
            }
        }

        let amountDue = 0;
        bookingData.refund.forEach(function (remaining_amount) {
            if (remaining_amount.processed == 0) {
                amountDue += parseFloat(remaining_amount.amount);
            }
        });

        return (
            <Card className="summary-card">
                <div className="summary-card-heading">
                    Summary
                </div>

                <div className="summary-card-body">
                    <div className="row-1">

                        <div className="class">

                            <div className="title">
                                Amount Paid
                            </div>

                            <div className="data">
                                ₹{paidAmount}
                            </div>
                        </div>

                        {
                            (bookingData.status.id == 5 || bookingData.status.id == 6) ?

                                <div className="class">

                                    <div className="title">
                                        Tentative Amount
                                    </div>

                                    <div className="data">
                                        ₹{bookingData.tentative_amount}
                                    </div>
                                </div>

                                : null
                        }

                        {
                            (bookingData.status.id == 7 || bookingData.status.id == 8) ?

                                <div className="class">

                                    <div className="title">
                                        Total Fair
                                    </div>

                                    <div className="data">
                                        ₹{fairAmount}
                                    </div>
                                </div>

                                : null
                        }

                        {
                            (bookingData && bookingData.type.id != 580 && amountDue < 0 && bookingData.status.id != 5 && bookingData.status.id != 6) &&

                            <div className="class">

                                {
                                    amountDue < 0 && <div className="title">
                                        Amount Due
                                    </div>
                                }

                                {
                                    amountDue < 0 ? <div className="data">
                                        ₹{0 - amountDue}
                                    </div>
                                        : null
                                }
                            </div>


                        }


                        {
                            (bookingData && amountDue > 0 && bookingData.status.id != 5 && bookingData.status.id != 6) &&

                            <div className="class">

                                <div className="title">
                                    Refund
                                    </div>

                                <div className="data">
                                    ₹{amountDue}
                                </div>
                            </div>


                        }

                    </div>    
                </div>


                <div className="pricing-object">

                    <div>
                        <div className="pricing" onClick={this.toggle}  >
                        Pricing Object

                            <i className={"fa " + (this.state.collapse ? 'fa-caret-up' : 'fa-caret-down')}>
                            </i>


                        </div>
                        {/* <Button className="display-button" onClick={this.toggle} ></Button> */}
                        <Collapse isOpen={this.state.collapse}>
                            <Card className="card-body">
                                <CardBody>

                                    <Row className="card-object">

                                        <Col className= "item">Weekday Hourly Normal</Col>
                                        <Col className="value">{TruncateDecimal(bookingData.pricing_object.weekday_hourly_normal)}</Col>
                                    </Row>
                                    <Row className="card-object">
                                        <Col className= "item">Weekday Daily Normal</Col>
                                        <Col className="value">{TruncateDecimal(bookingData.pricing_object.weekday_daily_normal)}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">Weekday Hourly</Col>
                                        <Col className="value">{TruncateDecimal(bookingData.pricing_object.weekday_hourly)}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">Weekday Daily</Col>
                                        <Col className="value">{TruncateDecimal(bookingData.pricing_object.weekday_daily)}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">Weekend Hourly</Col>
                                        <Col className="value">{TruncateDecimal(bookingData.pricing_object.weekend_hourly)}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">Weekend Daily</Col>
                                        <Col className="value">{TruncateDecimal(bookingData.pricing_object.weekend_daily)}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">Extra km Charge</Col>
                                        <Col className="value">{bookingData.pricing_object.extra_km_charge}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">Fuelless km Charge</Col>
                                        <Col className="value">{bookingData.pricing_object.fuelless_km_charge}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">Caution Deposit</Col>
                                        <Col className="value">{bookingData.pricing_object.caution_deposit}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">City</Col>
                                        <Col className="value">{bookingData.pricing_object.city}</Col>
                                    </Row>
                                    <Row className="card-object">

                                        <Col className= "item">Peak</Col>
                                        <Col className="value">{bookingData.pricing_object.peak}</Col>

                                    </Row>

                                </CardBody>
                            </Card>
                        </Collapse>
                    </div>

                </div>
            </Card>
        )
    }

}
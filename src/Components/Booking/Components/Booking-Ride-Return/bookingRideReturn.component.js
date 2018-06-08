import React, { Component } from 'react';
import {
    Card, CardTitle, CardBody, Row, Col, ButtonToolbar, Button, Progress
} from 'reactstrap';

import { TotalDuration } from './../../../../Utils/booking.utils';

import './bookingRideReturn.css';

export default class BookingRideReturn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingRideReturnData: props.bookingRideReturnData
        };
    }

    render() {
        const { bookingRideReturnData = {} } = this.state;
        let totalDuration;
        let totalOdo;
        let kmDifference;

        let getStartingFuelPercentage = bookingRideReturnData.ride_return.start_fuel_percentage;
        let getEndingFuelPercentage = bookingRideReturnData.ride_return.end_fuel_percentage;

        let paidAmount = 0;
        bookingRideReturnData.payment.forEach(function (data) {
            paidAmount += parseFloat(data.amount);
        });

        let fairAmount = 0;
        bookingRideReturnData.collection.forEach(function (data) {
            fairAmount += parseFloat(data.amount);
        });

        let approvedExtensionCost = 0;
        let tentativeAmount = 0;
        bookingRideReturnData.extension.forEach(function (data) {
            if (data.approved == 1 && !data.deleted_at) {
                approvedExtensionCost += parseFloat(data.cost);
            }
        });
        tentativeAmount = approvedExtensionCost + bookingRideReturnData.tentative_amount;

        let amountDue = 0;
        bookingRideReturnData.refund.forEach(function (remaining_amount) {
            if (remaining_amount.processed == 0) {
                amountDue += parseFloat(remaining_amount.amount);
            }
        });

        if (bookingRideReturnData.status.id == 6) {
            totalDuration = TotalDuration(bookingRideReturnData.ride_return.updated_at, bookingRideReturnData.ride_return.actual_start_time);
        } else {
            totalDuration = TotalDuration(bookingRideReturnData.ride_return.actual_end_time, bookingRideReturnData.ride_return.actual_start_time);
        }

        if (bookingRideReturnData.ride_return) {
            kmDifference = bookingRideReturnData.ride_return.end_odo_reading - bookingRideReturnData.ride_return.start_odo_reading
        }
        // Add previous odo reading and current odo reading of vehicle when vehicle is changed
        let addPreviousOdo = 0;
        if (bookingRideReturnData.vehicle_change.length) {
            for (var i in bookingRideReturnData.vehicle_change) {
                if (bookingRideReturnData.vehicle_change[i].previous_vehicle_start_odo && bookingRideReturnData.vehicle_change[i].previous_vehicle_start_odo) {
                    addPreviousOdo += (bookingRideReturnData.vehicle_change[i].previous_vehicle_end_odo) - (bookingRideReturnData.vehicle_change[i].previous_vehicle_start_odo);
                }
            }
        }
        totalOdo = (kmDifference) + (addPreviousOdo);

        return (

            <Card className="trip-panel-container">
                <div className="trip-details">
                    {
                        (bookingRideReturnData && bookingRideReturnData.status && bookingRideReturnData.status.id == 8) ? <CardTitle>Cancellation Details</CardTitle>
                            :
                            <CardTitle>Trip Details</CardTitle>
                    }
                    {
                        (bookingRideReturnData && !bookingRideReturnData.status) ?
                            <CardBody>
                                <Row className="unvarified-trip-panel">
                                    <Col sm="12">
                                        <h5>This booking is not verified yet.</h5>
                                    </Col>
                                </Row>
                            </CardBody>
                            :
                            null
                    }
                    {
                        <CardBody>
                            {
                                (bookingRideReturnData && bookingRideReturnData.ride_return) ?
                                    <Row className="trip-gray-border-bottom">
                                        <Col sm="4">
                                            <p className="trip-detail-info">{this.state.rideStartDate}</p>
                                            <p className="trip-detail-info">{this.state.rideStartTime}</p>
                                            <p className="trip-detail-info">{bookingRideReturnData.ride_return.start_odo_reading}</p>
                                        </Col>

                                        {
                                            bookingRideReturnData && bookingRideReturnData.status.id == 7 &&
                                            <Col sm="4">
                                                <div className="jr-time-icon">
                                                    <div className="no-padding margin-top-12 " align="center">
                                                        <i className="fa fa-clock-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className="no-padding light-red  font-11" align="center">
                                                        {totalDuration}
                                                    </div>
                                                    <div className="total-odo-info" align="center">
                                                        <i className="fa fa-car" aria-hidden="true"></i>
                                                    </div>
                                                    <div className="total-odo" align="center">
                                                        {totalOdo} Kms
                                                                </div>
                                                </div>
                                            </Col>
                                        }
                                        {
                                            bookingRideReturnData && bookingRideReturnData.status.id == 6 &&
                                            <Col sm="4">
                                                <div className="jr-time-icon">
                                                    <div className="no-padding margin-top-12 " align="center">
                                                        <i className="fa fa-clock-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className="no-padding light-red  font-11" align="center">
                                                        {totalDuration}
                                                    </div>
                                                    <div className="total-odo-info" align="center">
                                                        <i className="fa fa-car" aria-hidden="true"></i>
                                                    </div>
                                                    <div className="total-odo" align="center">
                                                        _ _ Kms
                                                    </div>
                                                </div>
                                            </Col>
                                        }

                                        {
                                            bookingRideReturnData && bookingRideReturnData.status.id == 7 &&
                                            <Col sm="4" className="ride-end-detail">
                                                <p className="trip-detail-info">{this.state.rideEndDate}</p>
                                                <p className="trip-detail-info">{this.state.rideEndTime}</p>
                                                <p className="trip-detail-info">{bookingRideReturnData.ride_return.end_odo_reading}</p>
                                            </Col>
                                        }
                                        {
                                            bookingRideReturnData && bookingRideReturnData.status.id == 6 &&
                                            <Col sm="4" className="ride-end-detail">
                                                <p>In Transit</p>
                                            </Col>
                                        }
                                    </Row>
                                    :
                                    <div>
                                        {
                                            (bookingRideReturnData.status && bookingRideReturnData.status.id === 8 && bookingRideReturnData.cancellation && bookingRideReturnData.cancellation.type) &&
                                            <div>
                                                <Row>
                                                    <Col sm="6">
                                                        <span>Type : </span>
                                                        <span>{bookingRideReturnData.cancellation.type.name}</span>
                                                    </Col>
                                                    <Col sm="6">
                                                        <span>Time : </span>
                                                        <span>{bookingRideReturnData.cancellation.updated_at}</span>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm="12">
                                                        <span>Cancelled By :</span>
                                                        <span>{bookingRideReturnData.cancellation.created_user.display_name}</span>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm="12">
                                                        <span>Note :</span>
                                                        <span>{bookingRideReturnData.cancellation.cancellation_note}</span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        }
                                        {
                                            (bookingRideReturnData && bookingRideReturnData.status && bookingRideReturnData.status.id === 5) &&
                                            <div className="confirm-trip-info">
                                                <Row>
                                                    <h4>  Trip not yet started </h4>
                                                </Row>
                                            </div>
                                        }
                                    </div>
                            }
                            <div className="fuel-progress-bar">
                                <Row className="gray-border-bottom">
                                    {
                                        bookingRideReturnData && bookingRideReturnData.status && (bookingRideReturnData.status.id == 6 || bookingRideReturnData.status.id == 7) &&
                                        <Col sm="6">
                                            <Progress value="getStartingFuelPercentage">{getStartingFuelPercentage}%</Progress>
                                        </Col>
                                    }
                                    {
                                        bookingRideReturnData && bookingRideReturnData.status && (bookingRideReturnData.status.id == 6 || bookingRideReturnData.status.id == 7) &&
                                        <Col sm="6">
                                            <Progress value="getEndingFuelPercentage">{getEndingFuelPercentage}%</Progress>
                                        </Col>
                                    }

                                </Row>
                                <Row className="handover-user">
                                    {
                                        bookingRideReturnData && bookingRideReturnData.status && (bookingRideReturnData.status.id == 6 || bookingRideReturnData.status.id == 7) &&
                                        <Col sm="6">
                                            <div className="jr-start-time">
                                                <i className="fa fa-key" aria-hidden="true"></i>
                                                {bookingRideReturnData.ride_return.handover_user.display_name}
                                            </div>
                                        </Col>
                                    }
                                    {
                                        bookingRideReturnData && bookingRideReturnData.status && bookingRideReturnData.ride_return && bookingRideReturnData.ride_return.picker_user && (bookingRideReturnData.status.id == 6 || bookingRideReturnData.status.id == 7) &&
                                        <Col sm="6">
                                            <div className="jr-time-icon">
                                                <i className="fa fa-key" aria-hidden="true"></i>
                                                {bookingRideReturnData.ride_return.picker_user.display_name}
                                            </div>
                                        </Col>
                                    }
                                </Row>
                            </div>
                        </CardBody>
                    }
                    <Row className="ride-return-text">
                        {
                            bookingRideReturnData && bookingRideReturnData.is_split_payment == 1 &&
                            <Col sm="3">
                                <ButtonToolbar>
                                    <Button color="success" size="sm">
                                        <small>Split Payment</small>
                                    </Button>
                                </ButtonToolbar>
                            </Col>
                        }
                        {
                            bookingRideReturnData && bookingRideReturnData.is_peak == 1 &&
                            <Col sm="3">
                                <ButtonToolbar>
                                    <Button color="success" size="sm">
                                        <small>Peak Season</small>
                                    </Button>
                                </ButtonToolbar>
                            </Col>
                        }
                        {
                            bookingRideReturnData && bookingRideReturnData.refund_source &&
                            <Col sm="3">
                                <ButtonToolbar>
                                    <Button color="success" size="sm">
                                        <small>IMPS Refund</small>
                                    </Button>
                                </ButtonToolbar>
                            </Col>
                        }
                        {
                            bookingRideReturnData && bookingRideReturnData.user.wallet_refund == 1 &&
                            <Col sm="3">
                                <ButtonToolbar>
                                    <Button color="success" size="sm">
                                        <small>Wallet Refund</small>
                                    </Button>
                                </ButtonToolbar>
                            </Col>
                        }
                    </Row>
                    <CardBody>
                        <Row className="ride-return-text">
                            <Col sm="4">
                                <p>Amount Paid</p>
                                <p>Rs. {paidAmount}</p>
                            </Col>
                            {
                                (bookingRideReturnData && bookingRideReturnData.status && (bookingRideReturnData.status.id == 7 || bookingRideReturnData.status.id == 8)) ?
                                    <Col sm="4">
                                        <p>Total Fare</p>
                                        <p>Rs. {fairAmount}</p>
                                    </Col>
                                    :
                                    <Col sm="4">
                                        <p>Tentative Amount</p>
                                        <p>Rs. {tentativeAmount}</p>
                                    </Col>
                            }
                            <Col sm="4">
                                {
                                    (bookingRideReturnData && amountDue > 0) ?
                                        <div>
                                            <p>Refund</p>
                                            <p>Rs. {amountDue}</p>
                                        </div>
                                        :
                                        null
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </div>
            </Card>

        )
    }
}

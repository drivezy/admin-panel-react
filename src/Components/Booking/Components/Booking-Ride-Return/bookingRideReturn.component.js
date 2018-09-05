import React, { Component } from 'react';
import {
    Card, CardBody, Row, Col, Progress
} from 'reactstrap';

import { BookingPickupDate, BookingPickupTime, BookingDropDate, BookingDropTime, TotalDuration, RideStatus } from './../../../../Utils/booking.utils';
import { Link } from 'react-router-dom';

import './bookingRideReturn.css';

export default class BookingRideReturn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingRideReturnData: props.bookingRideReturnData
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ bookingRideReturnData: nextProps.bookingRideReturnData });
    }

    render() {

        const { bookingRideReturnData = {} } = this.state;
        let totalDuration;
        let totalOdo;
        let kmDifference;
        let theClassName;


        let bookingStartDate, bookingStartTime, bookingEndDate, bookingEndTime;

        if (bookingRideReturnData.ride_return) {
            bookingStartDate = BookingPickupDate(bookingRideReturnData.ride_return.actual_start_time);
            bookingStartTime = BookingPickupTime(bookingRideReturnData.ride_return.actual_start_time);
            bookingEndDate = BookingDropDate(bookingRideReturnData.ride_return.actual_end_time);
            bookingEndTime = BookingDropTime(bookingRideReturnData.ride_return.actual_end_time);
        }
        if (bookingRideReturnData.status) {
            theClassName = RideStatus(bookingRideReturnData.status.id);
        }
        let paidAmount = 0;
        bookingRideReturnData.payment.forEach(function (data) {
            paidAmount += parseFloat(data.amount);
        });

        let fairAmount = 0;
        bookingRideReturnData.collection.forEach(function (data) {
            fairAmount += parseFloat(data.amount);
        });

        let approvedExtensionCost = 0;
        bookingRideReturnData.extension.forEach(function (data) {
            if (data.approved == 1 && !data.deleted_at) {
                approvedExtensionCost += parseFloat(data.cost);
            }
        });
        if (approvedExtensionCost > 0) {
            bookingRideReturnData.tentative_amount += approvedExtensionCost
        }

        let amountDue = 0;
        bookingRideReturnData.refund.forEach(function (remaining_amount) {
            if (remaining_amount.processed == 0) {
                amountDue += parseFloat(remaining_amount.amount);
            }
        });

        if (bookingRideReturnData.ride_return) {
            if (bookingRideReturnData.status.id == 6) {
                totalDuration = TotalDuration(bookingRideReturnData.ride_return.updated_at, bookingRideReturnData.ride_return.actual_start_time);
            } else {
                totalDuration = TotalDuration(bookingRideReturnData.ride_return.actual_end_time, bookingRideReturnData.ride_return.actual_start_time);
            }
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
            <div>


                <Card className="trip-panel-container">
                    <div className="trip-details">
                        {
                            (bookingRideReturnData && bookingRideReturnData.status && bookingRideReturnData.status.id == 8) ? <div className="trip-card-heading">Cancellation Details</div>
                                :
                                <div className={theClassName}>
                                    <div className="trip-card-heading">Trip Details</div>
                                </div>
                        }
                        {
                            (bookingRideReturnData && !bookingRideReturnData.status) ?
                                <div className="card-body">
                                    <Row className="unvarified-trip-panel">
                                        <Col>
                                            <h5>This booking is not verified yet.</h5>
                                        </Col>
                                    </Row>
                                </div>
                                :
                                null
                        }
                        {
                            <CardBody>
                                {
                                    (bookingRideReturnData && bookingRideReturnData.ride_return) ?
                                        <Row className="trip-data">
                                            <Col>
                                                <p className="trip-detail-info">{bookingStartDate}</p>
                                                <p className="trip-detail-info">{bookingStartTime}</p>
                                                <p className="trip-detail-info">{bookingRideReturnData.ride_return.start_odo_reading}</p>
                                            </Col>

                                            {
                                                bookingRideReturnData && bookingRideReturnData.status.id == 7 &&
                                                <Col>
                                                    <div className="jr-time-icon">
                                                        <div className="time-icon " align="center">
                                                            <i className="fa fa-clock-o" aria-hidden="true"></i>
                                                        </div>
                                                        <div className="time-data" align="center">
                                                            {totalDuration}
                                                        </div>
                                                        <div className="odo-icon" align="center">
                                                            <i className="fa fa-car" aria-hidden="true"></i>
                                                        </div>
                                                        <div className="odo-data" align="center">
                                                            {totalOdo} Kms
                                                    </div>
                                                    </div>
                                                </Col>
                                            }
                                            {
                                                bookingRideReturnData && bookingRideReturnData.status.id == 6 &&
                                                <Col>
                                                    <div className="jr-time-icon">
                                                        <div className="time-icon" align="center">
                                                            <i className="fa fa-clock-o" aria-hidden="true"></i>
                                                        </div>
                                                        <div className="time-data" align="center">
                                                            {totalDuration}
                                                        </div>
                                                        <div className="odo-icon" align="center">
                                                            <i className="fa fa-car" aria-hidden="true"></i>
                                                        </div>
                                                        <div className="odo-data" align="center">
                                                            __ Kms
                                                    </div>
                                                    </div>
                                                </Col>
                                            }

                                            {
                                                bookingRideReturnData && bookingRideReturnData.status.id == 7 &&
                                                <Col className="ride-end-detail">
                                                    <p className="trip-detail-info">{bookingEndDate}</p>
                                                    <p className="trip-detail-info">{bookingEndTime}</p>
                                                    <p className="trip-detail-info">{bookingRideReturnData.ride_return.end_odo_reading}</p>
                                                </Col>
                                            }
                                            {
                                                bookingRideReturnData && bookingRideReturnData.status.id == 6 &&
                                                <Col className="ride-end-detail">
                                                    <p>Status: In Transit</p>
                                                </Col>
                                            }
                                        </Row>
                                        :
                                        <div>
                                            {
                                                (bookingRideReturnData.status && bookingRideReturnData.status.id === 8 && bookingRideReturnData.cancellation && bookingRideReturnData.cancellation.type) &&
                                                <div className="data-cancellation">
                                                    <Row className="data-cancellation-row">
                                                        <Col className="data-cancellation-col">
                                                            <span>Type : </span>
                                                            <span>{bookingRideReturnData.cancellation.type.name}</span>
                                                        </Col>
                                                        <Col className="data-cancellation-col">
                                                            <span>Time : </span>
                                                            <span>{bookingRideReturnData.cancellation.updated_at}</span>
                                                        </Col>
                                                    </Row>
                                                    <Row className="data-cancellation-row">
                                                        <Col className="data-cancellation-col">
                                                            <span>Cancelled By : </span>
                                                            <span>{bookingRideReturnData.cancellation.created_user.display_name}</span>
                                                        </Col>
                                                    </Row>
                                                    <Row className="data-cancellation-row">
                                                        <Col className="data-cancellation-col">
                                                            <span>Note : </span>
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
                                    <Row>
                                        {
                                            bookingRideReturnData && bookingRideReturnData.status && (bookingRideReturnData.status.id == 6 || bookingRideReturnData.status.id == 7) &&
                                            [
                                                <Col key={1}>
                                                    {
                                                        bookingRideReturnData.ride_return &&
                                                        <Progress className="fuel-value-bar" itemRef={bookingRideReturnData.ride_return.start_fuel_percentage} barClassName="file-field-list-item__progress-bar" value={bookingRideReturnData.ride_return.start_fuel_percentage}></Progress>
                                                    }
                                                    <div className="fuel-value-indicator">{bookingRideReturnData.ride_return.start_fuel_percentage}% Fuel Remaining</div>
                                                </Col>,

                                                (bookingRideReturnData.status.id == 6) && <Col key={4}></Col>,

                                                (bookingRideReturnData.status.id == 7) &&

                                                <Col key={2}>
                                                    {
                                                        (bookingRideReturnData.ride_return &&
                                                            <Progress className="fuel-value-bar" itemRef={bookingRideReturnData.ride_return.end_fuel_percentage} barClassName="file-field-list-item__progress-bar" value={bookingRideReturnData.ride_return.end_fuel_percentage}></Progress>)
                                                    }
                                                    <div className="fuel-value-indicator">{bookingRideReturnData.ride_return.end_fuel_percentage}% Fuel Remaining</div>
                                                </Col>
                                            ]


                                        }

                                    </Row>
                                    <Row className="handover-user">
                                        {
                                            bookingRideReturnData && bookingRideReturnData.status && (bookingRideReturnData.status.id == 6 || bookingRideReturnData.status.id == 7) &&
                                            <Col>
                                                <div className="jr-start-time">
                                                    <i className="fa fa-key" aria-hidden="true"></i>
                                                    <Link to={`/user/${bookingRideReturnData.ride_return.handover_user.id}`} className="menu-list">
                                                        {bookingRideReturnData.ride_return.handover_user.display_name}
                                                    </Link>
                                                </div>
                                            </Col>
                                        }
                                        {
                                            bookingRideReturnData && bookingRideReturnData.status && bookingRideReturnData.ride_return && bookingRideReturnData.ride_return.picker_user && (bookingRideReturnData.status.id == 6 || bookingRideReturnData.status.id == 7) &&
                                            <Col sm="6">
                                                <div className="jr-time-icon">
                                                    <i className="fa fa-key" aria-hidden="true"></i>
                                                    <Link to={`/user/${bookingRideReturnData.ride_return.picker_user.id}`} className="menu-list">
                                                        {bookingRideReturnData.ride_return.picker_user.display_name}
                                                    </Link>
                                                </div>
                                            </Col>
                                        }
                                    </Row>
                                </div>
                            </CardBody>
                        }
                        {/* <Row className="ride-return-text">
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
                    </Row> */}
                        {/* <CardBody>
                        <Row className="ride-return-text">
                            <Col sm="4">
                                <p>Amount Paid</p>
                                <p>Rs. {paidAmount}</p>
                            </Col>

                            {
                                (bookingRideReturnData.status != null && bookingRideReturnData.status.id != 5 && bookingRideReturnData.status.id != 6) ?
                                    <Col sm="4">
                                        <p>Total Fare</p>
                                        <p>Rs. {fairAmount}</p>
                                    </Col>
                                    : null
                            }

                            {
                                (bookingRideReturnData.collection.length == 0 || bookingRideReturnData.status == null) ?
                                    <Col sm="4">
                                        <p>Tentative Amount</p>
                                        <p>Rs. {bookingRideReturnData.tentative_amount}</p>
                                    </Col>
                                    : null
                            }

                            {
                                (bookingRideReturnData && bookingRideReturnData.type.id != 580 && amountDue < 0 && bookingRideReturnData.status.id != 5 && bookingRideReturnData.status.id != 6) &&
                                <Col sm="4">
                                    {
                                        amountDue < 0 &&
                                        <p>Amount Due</p>
                                    }
                                    {
                                        amountDue < 0 ?
                                            <p>Rs. {0 - amountDue}</p>
                                            : "No Amount Due"
                                    }
                                </Col>
                            }

                            {
                                (bookingRideReturnData && amountDue > 0 && bookingRideReturnData.status.id != 5 && bookingRideReturnData.status.id != 6) ?
                                    <Col sm="4">
                                        <p>Refund</p>
                                        <p>Rs. {amountDue}</p>
                                    </Col>
                                    : null
                            }


                        </Row>
                    </CardBody> */}
                    </div>
                </Card>

            </div>

        )
    }
}

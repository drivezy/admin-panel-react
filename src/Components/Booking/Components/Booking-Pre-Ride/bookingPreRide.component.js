import React, { Component } from 'react';
import {
    Card, CardTitle, CardBody, Row, Col
} from 'reactstrap';

import './bookingPreRide.css';

import { BookingPickupDate, BookingPickupTime, BookingDropDate, BookingDropTime } from './../../../../Utils/booking.utils';

export default class BookingPreRide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingPreRideData: props.bookingPreRideData
        };
    }

    render() {
        const { bookingPreRideData = {} } = this.state;

        let bookingPickupDate = BookingPickupDate(bookingPreRideData.pickup_time);
        let bookingPickupTime = BookingPickupTime(bookingPreRideData.pickup_time);
        let bookingDropDate = BookingDropDate(bookingPreRideData.drop_time);
        let bookingDropTime = BookingDropTime(bookingPreRideData.drop_time);

        return (

            <Card className="booking-panel-container">
                <div className="booking-details">
                    <CardTitle>
                        <Row>
                            <Col sm="6">
                                Booking Details
                                            </Col>
                            {
                                (bookingPreRideData && bookingPreRideData.status) ?
                                    <Col sm="6">
                                        <span className="booking-status">{bookingPreRideData.status.value}</span>
                                    </Col>
                                    :
                                    <Col sm="6">
                                        <span className="booking-status"><h5>Unverified</h5></span>
                                    </Col>
                            }
                        </Row>
                    </CardTitle>
                    <CardBody>
                        <Row className="gray-border-bottom">
                            <Col sm="10">
                                <Row>
                                    <Col sm="4">
                                        <img className="media-object width-100" src={`${bookingPreRideData.vehicle.car.image}`} alt="" />
                                    </Col>
                                    <Col sm="8">
                                        <span className="vehicle-number"><h6>{bookingPreRideData.vehicle.registration_number}</h6></span>
                                        <span>({bookingPreRideData.vehicle.car.name})</span>
                                        <p>
                                            {bookingPreRideData.type.value}
                                            <span>({bookingPreRideData.fuel_package == null ? bookingPreRideData.with_fuel ? 'withfuel' : 'fuelless' : bookingPreRideData.fuel_package + ' Kms fuel package'})</span>
                                        </p>
                                        {/* <p uib-tooltip="Billing Vehicle" tooltip-placement="bottom-left" ng-if="bookingPreRideData.billing_car!=null">
                                                                <b>{bookingPreRideData.billing_car.name}</b>
                                                            </p> */}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm="2">
                                {/* <div className="no-padding coupon-code black-text " uib-tooltip="{viewBooking.couponDescription}" tooltip-placement="top-left"
                                                    ng-if="bookingPreRideData.coupon_id">
                                                    {bookingPreRideData.coupon.coupon_code}
                                                </div> */}
                            </Col>
                        </Row>
                        <Row className="booking-detail-date">
                            <Col sm="5">
                                <div className="jr-start-time">
                                    <div className="no-padding text-black font-12">
                                        {bookingPickupDate}
                                    </div>
                                    <div className="no-padding text-black font-12">
                                        {bookingPickupTime}
                                    </div>
                                    <div className="booking-detail-drop-venue">
                                        {bookingPreRideData.venue_pick.name}
                                    </div>
                                    <div className="no-padding text-black font-12">
                                        {bookingPreRideData.venue_pick.city.name}
                                    </div>
                                </div>
                            </Col>
                            <Col sm="2">
                                <div className="jr-time-icon">
                                    <div className="no-padding margin-top-12 " align="center">
                                        <i className="fa fa-car" aria-hidden="true"></i>
                                    </div>
                                    <div className="no-padding light-red  font-11" align="center">
                                        53 Hrs.
                                                    </div>
                                </div>
                            </Col>
                            <Col sm="5">
                                <div className="jr-drop-time">
                                    <div className="no-padding text-black font-12" align="right">
                                        {bookingDropDate}
                                    </div>
                                    <div className="no-padding margin-top-12 text-black font-12" align="right">
                                        {bookingDropTime}
                                    </div>
                                    {
                                        bookingPreRideData.venue_drop &&
                                        [
                                            <div key={1} className="booking-detail-drop-venue" align="right">
                                                {bookingPreRideData.venue_drop.name}
                                            </div>,
                                            <div key={2} className="no-padding text-black font-12" align="right">
                                                {bookingPreRideData.venue_drop.city.name}
                                            </div>
                                        ]
                                    }
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </div>
            </Card>

        )
    }
}

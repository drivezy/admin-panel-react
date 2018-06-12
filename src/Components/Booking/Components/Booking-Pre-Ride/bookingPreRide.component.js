import React, { Component } from 'react';
import {
    Card, CardTitle, CardBody, Row, Col
} from 'reactstrap';

import './bookingPreRide.css';
import { Link } from 'react-router-dom';

import { BookingPickupDate, BookingPickupTime, BookingDropDate, BookingDropTime } from './../../../../Utils/booking.utils';
import CustomTooltip from '../../../Custom-Tooltip/customTooltip.component';

export default class BookingPreRide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingPreRideData: props.bookingPreRideData
        };
    }

    render() {
        const { bookingPreRideData = {} } = this.state;
        let couponDescription;

        let bookingPickupDate = BookingPickupDate(bookingPreRideData.pickup_time);
        let bookingPickupTime = BookingPickupTime(bookingPreRideData.pickup_time);
        let bookingDropDate = BookingDropDate(bookingPreRideData.drop_time);
        let bookingDropTime = BookingDropTime(bookingPreRideData.drop_time);

        if (bookingPreRideData.coupon) {
            couponDescription = bookingPreRideData.coupon.campaign.cashback ? 'Campaign Discription:' + bookingPreRideData.coupon.campaign.description : 'Campaign Discription:' + bookingPreRideData.coupon.campaign.description + ' | ' + (bookingPreRideData.coupon.description ? "Coupon Description:" + bookingPreRideData.coupon.description : " ") + "Discount Amount:" + bookingPreRideData.coupon_discount;
        }

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
                                        <h4>
                                            <Link to={`/allVehicleDetail/${bookingPreRideData.vehicle.id}`} className="menu-list">
                                                {bookingPreRideData.vehicle.registration_number}
                                            </Link>
                                            <span className="font-14">
                                                <CustomTooltip placement="top" html={bookingPreRideData.vehicle.car.name} title="Current Vehicle"></CustomTooltip>
                                            </span>
                                        </h4>
                                        {
                                            bookingPreRideData.billing_car == null &&
                                            <p>
                                                {bookingPreRideData.vehicle.car.name}
                                            </p>
                                        }
                                        {
                                            bookingPreRideData.billing_car != null &&
                                            <CustomTooltip placement="top" html={bookingPreRideData.billing_car.name} title="Billing Vehicle"></CustomTooltip>
                                        }
                                        <p>
                                            {bookingPreRideData.type.value}
                                            <span>({bookingPreRideData.fuel_package == null ? bookingPreRideData.with_fuel ? 'withfuel' : 'fuelless' : bookingPreRideData.fuel_package + ' Kms fuel package'})</span>
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm="2">
                                {
                                    bookingPreRideData.coupon_id &&
                                    <CustomTooltip placement="top" html={bookingPreRideData.coupon.coupon_code} title={couponDescription}></CustomTooltip>
                                }
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
                                        <Link to={`/venue/${bookingPreRideData.venue_pick.id}`} className="menu-list">
                                            {bookingPreRideData.venue_pick.name}
                                        </Link>
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
                                                <Link to={`/venue/${bookingPreRideData.venue_drop.id}`} className="menu-list">
                                                    {bookingPreRideData.venue_drop.name}
                                                </Link>
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

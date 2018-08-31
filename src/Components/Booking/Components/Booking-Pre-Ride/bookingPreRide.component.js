import React, { Component } from 'react';
import {
    Card, CardTitle, CardBody, Row, Col
} from 'reactstrap';

import './bookingPreRide.css';
import { Link } from 'react-router-dom';

import { BookingPickupDate, BookingPickupTime, BookingDropDate, BookingDropTime, TotalDuration, RideStatus } from './../../../../Utils/booking.utils';
import CustomTooltip from '../../../Custom-Tooltip/customTooltip.component';

export default class BookingPreRide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingPreRideData: props.bookingPreRideData
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({bookingPreRideData: nextProps.bookingPreRideData});
    }

    render() {
        const { bookingPreRideData = {} } = this.state;
        let couponDescription;

        let bookingPickupDate = BookingPickupDate(bookingPreRideData.pickup_time);
        let bookingPickupTime = BookingPickupTime(bookingPreRideData.pickup_time);
        let bookingDropDate = BookingDropDate(bookingPreRideData.drop_time);
        let bookingDropTime = BookingDropTime(bookingPreRideData.drop_time);
        let duration = TotalDuration(bookingPreRideData.drop_time, bookingPreRideData.pickup_time);
        let theClassName;
        if (bookingPreRideData.status) {
            theClassName = RideStatus(bookingPreRideData.status.id);
        }
        if (bookingPreRideData.coupon) {
            couponDescription = bookingPreRideData.coupon.campaign.cashback ? 'Campaign Discription:' + bookingPreRideData.coupon.campaign.description : 'Campaign Discription:' + bookingPreRideData.coupon.campaign.description + ' | ' + (bookingPreRideData.coupon.description ? "Coupon Description:" + bookingPreRideData.coupon.description : " ") + "Discount Amount:" + bookingPreRideData.coupon_discount;
        }

        return (
            <Card className="booking-panel-container" >
                <div className="booking-details">
                    <CardTitle className="heading">
                        <Row className={theClassName}>
                            <Col >
                                <span className="color-black">Booking Details</span>
                            </Col>

                            {
                                (bookingPreRideData && bookingPreRideData.status) ?
                                    <Col>
                                        <div className="booking-status-verified">
                                            {bookingPreRideData.status.value}
                                        </div>
                                    </Col>
                                    :
                                    <Col >
                                        <div className="booking-status-unverified">Unverified</div>
                                    </Col>
                            }
                        </Row>
                    </CardTitle>
                    <CardBody className="booked-vehicle-data">
                        <Row className="vehicle-info">
                            <Col sm="4">
                                <img className="vehicle-photo" src={`${bookingPreRideData.vehicle.car.image}`} alt="" />
                            </Col>
                            <Col sm="5" className="vehicle-info-data">
                                <div>
                                    <Link to={`/vehicle/${bookingPreRideData.vehicle.id}`} className="vehicle-info-number">
                                        {bookingPreRideData.vehicle.registration_number}
                                    </Link>

                                    <span className="vehicle-info-name">
                                            <CustomTooltip placement="top" html={'(' +bookingPreRideData.vehicle.car.name + ')'} title="Current Vehicle"></CustomTooltip>
                                    </span>
                                </div>
                                
                                <div className="billing-car-name">
                                {
                                    bookingPreRideData.billing_car != null &&
                                    <CustomTooltip placement="top" html={bookingPreRideData.billing_car.name} title="Billing Vehicle"></CustomTooltip>
                                }
                                </div>
                                <p className="ride-type">
                                    <span>
                                        {bookingPreRideData.type.value}
                                    </span>
                                </p>
                                <p className="fuel-type">
                                    <span>
                                        [{bookingPreRideData.fuel_package == null ? bookingPreRideData.with_fuel ? ' With Fuel Package ' : ' With No-Fuel Package ' : bookingPreRideData.fuel_package + ' kms Fuel Package'}]
                                    </span>
                                </p>
                            </Col>
                            <Col sm="3" >
                                {bookingPreRideData.coupon_id ?
                                    <div className="coupon-data">Coupon Info.<br />
                                        {
                                            <CustomTooltip placement="top" html={bookingPreRideData.coupon.coupon_code} title={couponDescription}></CustomTooltip>
                                        }

                                    </div>
                                    :
                                    <div className="coupon-data">No Coupon</div>
                                }

                            </Col>
                        </Row>
                        <hr />
                        <Row className="booking-detail-date">
                            <Col >
                                <div className="jr-start-time">
                                    <div>
                                        {bookingPickupDate}
                                    </div>
                                    <div>
                                        {bookingPickupTime}
                                    </div>
                                    <div>
                                        <Link to={`/venue/${bookingPreRideData.venue_pick.id}`} className="menu-list">
                                            {bookingPreRideData.venue_pick.name}
                                        </Link>
                                    </div>
                                    <div>
                                        {bookingPreRideData.venue_pick.city.name}
                                    </div>
                                </div>
                            </Col>
                            <Col >
                                <div className="jr-time-icon">
                                    <div align="center">
                                        <i className="fa fa-clock-o" aria-hidden="true"></i>
                                    </div>
                                    <div className="no-padding light-red  font-11" align="center">
                                        {duration}
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div className="jr-drop-time">
                                    <div align="right">
                                        {bookingDropDate}
                                    </div>
                                    <div align="right">
                                        {bookingDropTime}
                                    </div>
                                    {
                                        bookingPreRideData.venue_drop &&
                                        [
                                            <div key={1} align="right">
                                                <Link to={`/venue/${bookingPreRideData.venue_drop.id}`} className="menu-list">
                                                    {bookingPreRideData.venue_drop.name}
                                                </Link>
                                            </div>,
                                            <div key={2} align="right">
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

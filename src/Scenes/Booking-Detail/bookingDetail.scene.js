import React, { Component } from 'react';

import './bookingDetail.scene.css';

import UserCard from './../../Components/User-Card/userCard.component';
import BookingFeedback from './../../Components/Booking/Components/Booking-Feedback/bookingFeedback.component';
import BookingPreRide from './../../Components/Booking/Components/Booking-Pre-Ride/bookingPreRide.component';
import BookingRideReturn from './../../Components/Booking/Components/Booking-Ride-Return/bookingRideReturn.component';
import BookingTabsDetail from './../../Components/Booking/Components/Booking-Tabs-Detail/bookingTabsDetail.component';

import { Booking } from './../../Utils/booking.utils';

export default class BookingDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingDetail: {}
        };
    }

    componentDidMount() {
        this.getBookingDetail();
    }

    getBookingDetail = async () => {
        const { bookingId } = this.props.match.params;
        const result = await Booking(bookingId);
        if (result.success) {
            let bookingDetail = result.response;
            this.setState({ bookingDetail })
        }
    }

    render() {
        const { bookingDetail = {} } = this.state;
        return (
            <div className="booking">
                <div className="booking-details">

                    <div className="booking-user-detail">
                        {
                            bookingDetail.user && bookingDetail.user.id ?
                                <UserCard userData={bookingDetail.user} />
                                : null
                        }
                    </div>
                    {/* <div className="booking-feedback-detail">
                        {
                            (bookingDetail.id && bookingDetail.status != null) &&
                            <BookingFeedback bookingFeedback={bookingDetail} />
                        }
                    </div> */}


                    <div className="booking-pre-ride-detail">
                        {
                            bookingDetail.id ?
                                <BookingPreRide bookingPreRideData={bookingDetail} />
                                : null
                        }
                    </div>
                    {/* <div className="booking-ride-return-detail">
                        {
                            bookingDetail.id ?
                                <BookingRideReturn bookingRideReturnData={bookingDetail} />
                                : null
                        }
                    </div> */}
                </div>

                <div className="booking-tabs">
                    <div className="booking-tabs-detail">
                        {
                            bookingDetail.id ?
                                <BookingTabsDetail bookingTabsData={bookingDetail} />
                                : null
                        }
                    </div>
                </div>
            </div>

        )
    }
}
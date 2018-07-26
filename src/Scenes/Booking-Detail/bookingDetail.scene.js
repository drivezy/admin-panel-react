import React, { Component } from 'react';

import './bookingDetail.scene.css';

import UserCard from './../../Components/User-Card/userCard.component';
import BookingFeedback from './../../Components/Booking/Components/Booking-Feedback/bookingFeedback.component';
import BookingPreRide from './../../Components/Booking/Components/Booking-Pre-Ride/bookingPreRide.component';
import BookingRideReturn from './../../Components/Booking/Components/Booking-Ride-Return/bookingRideReturn.component';
import BookingTabsDetail from './../../Components/Booking/Components/Booking-Tabs-Detail/bookingTabsDetail.component';
import SummaryCard from './../../Components/Summary-Card/summaryCard'

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
        const { id } = this.props.match.params;
        const result = await Booking(id);
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

                    {/* <div className="details-body"> */}
                    <div className="pre-ride-detail-and-ride-return">
                        <div className="booking-pre-ride-detail">
                            {
                                bookingDetail.id ?
                                    <BookingPreRide bookingPreRideData={bookingDetail} />
                                    : null
                            }
                        </div>

                        <div className="booking-ride-return-detail">
                            {
                                bookingDetail.id ?
                                    <BookingRideReturn bookingRideReturnData={bookingDetail} />
                                    : null
                            }


                        </div>





                    </div>

                    <div className="summary-and-feedback">

                        <div className="summary-detail-card">
                            {
                                (bookingDetail.id ?
                                    <SummaryCard bookingData={bookingDetail} />
                                    : null)
                            }

                        </div>

                        {
                            (bookingDetail.id && bookingDetail.status != null && bookingDetail.feedback.length) ?
                                <div className="booking-feedback-detail">
                                    <BookingFeedback bookingFeedback={bookingDetail.feedback} />
                                </div>
                                : null
                        }

                    </div>


                    {/* </div> */}


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
            </div >


        )
    }
}
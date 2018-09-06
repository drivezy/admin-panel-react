import React, { Component } from 'react';

import './bookingDetail.scene.css';

import { StoreEvent } from 'state-manager-utility';

import UserCard from './../../Components/User-Card/userCard.component';
import BookingFeedback from './../../Components/Booking/Components/Booking-Feedback/bookingFeedback.component';
import BookingPreRide from './../../Components/Booking/Components/Booking-Pre-Ride/bookingPreRide.component';
import BookingRideReturn from './../../Components/Booking/Components/Booking-Ride-Return/bookingRideReturn.component';
import BookingTabsDetail from './../../Components/Booking/Components/Booking-Tabs-Detail/bookingTabsDetail.component';
import SummaryCard from './../../Components/Summary-Card/summaryCard';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import StartRide from './../../Components/Booking/Components/Modals/Start-Ride/startRide.component';
import { ModalManager } from 'drivezy-web-utils/build/Utils';
import { GetPreSelectedMethods, RegisterMethod, GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { BookingDate } from './../../Utils/booking.utils';

import { Booking } from './../../Utils/booking.utils';


export default class BookingDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingDetail: {},
            menuDetail: {}
        };
    }

    componentDidMount() {
        this.getBookingDetail();
    }

    componentWillUnmount() {
        StoreEvent({ eventName: 'rightClickData', data: {} });
    }

    getBookingDetail = async () => {
        const { id } = this.props.match.params;
        const result = await Booking(id);
        if (result.success) {
            let bookingDetail = result.response;
            this.setState({ bookingDetail });
        }
        this.getMenuData();
        StoreEvent({ eventName: 'showMenuName', data: { menuName: `Booking Details` } });

    }

    getMenuData = async () => {
        const { menuId } = this.props;
        const result = await GetMenuDetail(menuId);
        if (result.success) {
            const { response = {} } = result;
            const menuDetail = ConvertMenuDetailForGenericPage(response || {});
            this.state.menuDetail = menuDetail;
            this.setState({ menuDetail });
            StoreEvent({ eventName: 'rightClickData', data: { menuData: menuDetail } });            
        }
    }

    refreshPage(event) {
        event.preventDefault();
        this.getBookingDetail();
    }

    render() {
        const { history } = this.props;
        const { bookingDetail = {}, menuDetail } = this.state;

        let bookingDate = BookingDate(bookingDetail.updated_at);

        const genericDataForCustomColumn = {
            formPreference: {},
            formPreferences: [],
            starter: 'booking',
            columns: {},
            url: menuDetail.url ? menuDetail.url.split("/:")[0] : '',
            model: { name: 'booking' },
            modelId: null,
            methods: RegisterMethod(menuDetail.uiActions),// genericutils 
            preDefinedmethods: GetPreSelectedMethods(), // genericutils
            modelHash: null
        };

        return (
            <div className="booking">
                <div className="booking-header">
                    <div className="booking-info">
                        Booking Deatils View | {bookingDetail.token} | {bookingDate} | {bookingDetail.application ? bookingDetail.application.name : null}
                    </div>
                    <div className="header-actions">
                        <button className="refresh-button btn btn-sm" onClick={(e) => { this.refreshPage(e) }}>
                            <i className="fa fa-refresh"></i>
                        </button>
                        &nbsp;
                        <CustomAction menuDetail={menuDetail} genericData={genericDataForCustomColumn} history={history} actions={menuDetail.uiActions} listingRow={bookingDetail} placement={'as_header'} callback={this.getBookingDetail} />
                        <CustomAction menuDetail={menuDetail} genericData={genericDataForCustomColumn} history={history} actions={menuDetail.uiActions} listingRow={bookingDetail} placement={'as_dropdown'} callback={this.getBookingDetail} />
                    </div>
                </div>

                <div className="booking-details">
                    <div className="booking-user-detail">
                        {
                            bookingDetail.user && bookingDetail.user.id ?
                                <UserCard userData={bookingDetail.user} />
                                : null
                        }
                    </div>

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
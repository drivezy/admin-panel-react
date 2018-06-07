import React, { Component } from 'react';

import './bookingDetail.scene.css';

import UserCard from './../../Components/User-Card/userCard.component';
import BookingFeedback from './../../Components/Booking-Feedback/bookingFeedback.component';
import TableWrapper from './../../Components/Table-Wrapper/tableWrapper.component';

import { Booking, BookingPickupDate, BookingPickupTime, BookingDropDate, BookingDropTime } from './../../Utils/booking.utils';
import { Card, CardBody, CardTitle, Button, ButtonToolbar, Row, Col, Progress, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import moment from 'moment';



export default class BookingDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingDetail: {},
            tabContent: [],
            activeTab: 0,
            totalDuration: 0,
            totalOdo: 0,
            rideStartDate: '',
            rideEndDate: '',
            rideStartTime: '',
            rideEndTime: '',
            bookingPickupDate: '',
            bookingPickupTime: '',
            bookingDropDate: '',
            bookingDropTime: '',
            paidAmount: 0,
            fairAmount: 0
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
            let payment = result.response.booking_payment;
            let refund = result.response.refund;
            let changeVehicle = result.response.vehicle_change;
            let events = result.response.events;
            let vehicleMovement = result.response.vehicle_movement;
            let pendingActions = result.response.pending_actions;
            let comments = result.response.comments;
            let partnerAccount = result.response.partner_account;
            let collection = result.response.collection;


            let bookingPickupDate = BookingPickupDate(bookingDetail.pickup_time);
            let bookingPickupTime = BookingPickupTime(bookingDetail.pickup_time);
            let bookingDropDate = BookingDropDate(bookingDetail.drop_time);
            let bookingDropTime = BookingDropTime(bookingDetail.drop_time);
            this.setState({ bookingPickupDate, bookingPickupTime, bookingDropDate, bookingDropTime })


            if (bookingDetail && bookingDetail.ride_return) {
                if (bookingDetail.status.id == 6) {
                    let ms = moment(result.response.ride_return.updated_at).diff(moment(result.response.ride_return.actual_start_time));
                    let d = moment.duration(ms);
                    let totalDuration = Math.floor(d.asHours()) + "h " + Math.floor(d.minutes()) + "m";
                    this.setState({ totalDuration })
                } else {
                    let ms = moment(result.response.ride_return.actual_end_time).diff(moment(result.response.ride_return.actual_start_time));
                    let d = moment.duration(ms);
                    let totalDuration = Math.floor(d.asHours()) + "h " + Math.floor(d.minutes()) + "m";
                    this.setState({ totalDuration })
                }

                let amountDue = 0;
                bookingDetail.refund.forEach(function (remaining_amount) {
                    if (remaining_amount.processed == 0) {
                        amountDue += parseFloat(remaining_amount.amount);
                    }
                });

                let totalOdo = bookingDetail.ride_return.end_odo_reading - bookingDetail.ride_return.start_odo_reading;
                let rideStartDate = moment(result.response.ride_return.actual_start_time).format("dddd, MMMMDo YYYY");
                let rideStartTime = moment(result.response.ride_return.actual_start_time).format("h:mm A");
                let rideEndDate = moment(result.response.ride_return.actual_end_time).format("dddd, MMMMDo YYYY");
                let rideEndTime = moment(result.response.ride_return.actual_end_time).format("h:mm A");

                let getStartingFuelPercentage = bookingDetail.ride_return.start_fuel_percentage;
                let getEndingFuelPercentage = bookingDetail.ride_return.end_fuel_percentage;



                this.setState({ totalOdo, rideStartDate, rideEndDate, rideStartTime, rideEndTime, amountDue, getStartingFuelPercentage, getEndingFuelPercentage });
            }


            let getTotalAmountPaid = 0;
            payment.forEach(function (data) {
                getTotalAmountPaid += parseFloat(data.amount);
            });

            let getTotalFair = 0;
            collection.forEach(function (data) {
                getTotalFair += parseFloat(data.amount);
            });

            let approvedExtensionCost = 0;
            let tentativeAmt = 0;
            bookingDetail.extension.forEach(function (data) {
                if (data.approved == 1 && !data.deleted_at) {
                    approvedExtensionCost += parseFloat(data.cost);
                }
            });
            tentativeAmt = approvedExtensionCost + bookingDetail.tentative_amount;

            this.setState({ paidAmount: getTotalAmountPaid, fairAmount: getTotalFair, tentativeAmount: tentativeAmt });




            this.setState({
                bookingDetail, tabContent: [
                    {
                        name: 'Payment',
                        data: payment,
                        columns: [{
                            field: "reason",
                            label: "Reason"
                        }, {
                            field: "payment_acknowledged_datetime",
                            label: "Payment Acknowledge Time"
                            //sref: "/booking/",
                            //type: "sref",
                            //id: "id"
                        }, {
                            field: "receipt_number",
                            label: "Receipt Number"
                        }, {
                            field: "source",
                            label: "Source"
                        }, {
                            field: "payment_source",
                            label: "Payment Mode"
                        }, {
                            field: "amount",
                            label: "Amount"
                        }, {
                            field: "created_at",
                            label: "Created At"
                        }, {
                            field: "created_by",
                            label: "Created By"
                        }]
                    }, {
                        name: 'Refund',
                        data: refund,
                        columns: [{
                            field: "amount",
                            label: "Amount"
                        }, {
                            field: "calculated_amount",
                            label: "Calculated Amount"
                        }, {
                            field: "request_start_time",
                            label: "Start Time"
                        }, {
                            field: "request_end_time",
                            label: "End Time"
                        }, {
                            field: "source",
                            label: "Source"
                        }, {
                            field: "refunded_by",
                            label: "Refunded By"
                        }, {
                            field: "created_at",
                            label: "Created At"
                        }, {
                            field: "processed_datetime",
                            label: "Process Time"
                        }, {
                            field: "processed",
                            label: "Status"
                        }]
                    }, {
                        name: 'Change Vehicle',
                        data: changeVehicle,
                        columns: [{
                            field: "old_vehicle.registration_number",
                            label: "Previous Vehicle"
                        }, {
                            field: "new_vehicle.registration_number",
                            label: "New Vehicle "
                        }, {
                            field: "in_between_booking",
                            label: "In Between Booking "
                        }, {
                            field: "previous_vehicle_start_odo",
                            label: "Previous Vehicle Start Odo "
                        }, {
                            field: "previous_vehicle_end_odo",
                            label: "Previous Vehicle end Odo"
                        }, {
                            field: "previous_vehicle_start_fuel_percent",
                            label: "Previous Vehicle start Fuel %"
                        }, {
                            field: "previous_vehicle_fuel_percent",
                            label: "Previous Vehicle end Fuel % "
                        }, {
                            field: "new_vehicle.odo_reading",
                            label: "New Vehicle Odo "
                        }, {
                            field: "new_vehicle_fuel_percent",
                            label: "New Vehicle Fuel % "
                        }, {
                            field: "is_forceful",
                            label: "Forcefully"
                        }, {
                            field: "reason_type.name",
                            label: "Reason"
                        }, {
                            field: "is_forceful",
                            label: "Comment"
                        }, {
                            field: "created_by",
                            label: "Changed By"
                        }, {
                            field: "created_at",
                            label: "Created At"
                        }, {
                            field: "created_user.created_at",
                            label: "Changed At"
                        }]
                    }, {
                        name: 'Events',
                        data: events,
                        columns: [{
                            field: "id",
                            label: "Id"
                        }, {
                            field: "event_name",
                            label: "Event Name"
                        }, {
                            field: "scheduled_start_time",
                            label: "Scheduled Start Time"
                        }, {
                            field: "start_time",
                            label: "Start Time"
                        }, {
                            field: "end_time",
                            label: "End Time"
                        }, {
                            field: "source",
                            label: "Source"
                        }]
                    }, {
                        name: 'Vehicle Movement',
                        data: vehicleMovement,
                        columns: [{
                            field: "start_time",
                            label: "Start Time"
                        }, {
                            field: "end_time",
                            label: "End Time"
                        }, {
                            field: "source_venue.name",
                            label: "Source"
                        }, {
                            field: "destination_venue.name",
                            label: "Destination"
                        }, {
                            field: "destination_venue.contact_person",
                            label: "Driver"
                        }]
                    }, {
                        name: 'Pending Actions',
                        data: pendingActions,
                        columns: [{
                            field: "type",
                            label: "Type"
                        }, {
                            field: "description",
                            label: "Description"
                        }, {
                            field: "completed_user",
                            label: "Completed User"
                        }, {
                            field: "assigned_user.display_name",
                            label: "Assigned User"
                        }, {
                            field: "completion_comments",
                            label: "Completion Comments"
                        }, {
                            field: "completed_at",
                            label: "Completed Date"
                        }, {
                            field: "created_at",
                            label: "Creation Time"
                        }]
                    }, {
                        name: 'Comments',
                        data: comments,
                        columns: [{
                            field: "comments",
                            label: "Comment"
                        }, {
                            field: "comment_type.name",
                            label: "Comment Type"
                        }, {
                            field: "created_by",
                            label: "Created By"
                        }, {
                            field: "created_at",
                            label: "Created At"
                        }]
                    }, {
                        name: 'Partner Account',
                        data: partnerAccount,
                        columns: [{
                            field: "comments",
                            label: "Details"
                        }, {
                            field: "billing_date",
                            label: "Date"
                        }, {
                            field: "created_by",
                            label: "Debit"
                        }, {
                            field: "amount",
                            label: "Credit"
                        }]
                    }
                ]
            });
        }
    }


    toggle = (key, tab) => {
        this.setState({
            activeTab: key
        });
    }


    render() {

        // const tabs = ['booking_payment', 'extension'];



        const { bookingDetail = {}, activeTab, tabContent = [], paidAmount, fairAmount, tentativeAmount, amountDue, getStartingFuelPercentage, getEndingFuelPercentage, bookingPickupTime, bookingPickupDate, bookingDropDate, bookingDropTime } = this.state;





        return (
            <div className="booking-user">

                <div>
                    <div className="booking-detail">
                        <div className="booking-user-detail">
                            {
                                bookingDetail.user && bookingDetail.user.id ? <UserCard userData={bookingDetail.user} /> : null
                            }
                        </div>
                        <div className="booking-feedback-detail">
                            {
                                bookingDetail.id ? <BookingFeedback bookingFeedback={bookingDetail} /> : null
                            }
                        </div>
                    </div>


                    {
                        bookingDetail.id &&
                        <Row className="booking-panels">
                            <Col sm="6" className="no-padding">
                                <Card className="booking-panel-container">
                                    <div className="booking-details">
                                        <CardTitle>
                                            <Row>
                                                <Col sm="6">
                                                    Booking Details
                                            </Col>
                                                {
                                                    (bookingDetail && bookingDetail.status) ?
                                                        <Col sm="6">
                                                            <span className="booking-status">{bookingDetail.status.value}</span>
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
                                                            <img className="media-object width-100" src={`${bookingDetail.vehicle.car.image}`} alt="" />
                                                        </Col>
                                                        <Col sm="8">
                                                            <span className="vehicle-number"><h6>{bookingDetail.vehicle.registration_number}</h6></span>
                                                            <span>({bookingDetail.vehicle.car.name})</span>
                                                            <p>
                                                                {bookingDetail.type.value}
                                                                <span>({bookingDetail.fuel_package == null ? bookingDetail.with_fuel ? 'withfuel' : 'fuelless' : bookingDetail.fuel_package + ' Kms fuel package'})</span>
                                                            </p>
                                                            {/* <p uib-tooltip="Billing Vehicle" tooltip-placement="bottom-left" ng-if="bookingDetail.billing_car!=null">
                                                                <b>{bookingDetail.billing_car.name}</b>
                                                            </p> */}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col sm="2">
                                                    {/* <div className="no-padding coupon-code black-text " uib-tooltip="{viewBooking.couponDescription}" tooltip-placement="top-left"
                                                    ng-if="bookingDetail.coupon_id">
                                                    {bookingDetail.coupon.coupon_code}
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
                                                            {bookingDetail.venue_pick.name}
                                                        </div>
                                                        <div className="no-padding text-black font-12">
                                                            {bookingDetail.venue_pick.city.name}
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
                                                            bookingDetail.venue_drop &&
                                                            [
                                                                <div className="booking-detail-drop-venue" align="right">
                                                                    {bookingDetail.venue_drop.name}
                                                                </div>,
                                                                <div className="no-padding text-black font-12" align="right">
                                                                    {bookingDetail.venue_drop.city.name}
                                                                </div>
                                                            ]
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm="6" className="no-padding">
                                <Card className="trip-panel-container">
                                    <div className="trip-details">
                                        {
                                            (bookingDetail && bookingDetail.status && bookingDetail.status.id == 8) ? <CardTitle>Cancellation Details</CardTitle>
                                                :
                                                <CardTitle>Trip Details</CardTitle>
                                        }
                                        {
                                            (bookingDetail && !bookingDetail.status) ?
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
                                                    (bookingDetail && bookingDetail.ride_return) ?
                                                        <Row className="trip-gray-border-bottom">
                                                            <Col sm="4">
                                                                <p className="trip-detail-info">{this.state.rideStartDate}</p>
                                                                <p className="trip-detail-info">{this.state.rideStartTime}</p>
                                                                <p className="trip-detail-info">{bookingDetail.ride_return.start_odo_reading}</p>
                                                            </Col>

                                                            {
                                                                bookingDetail && bookingDetail.status.id == 7 &&
                                                                <Col sm="4">
                                                                    <div className="jr-time-icon">
                                                                        <div className="no-padding margin-top-12 " align="center">
                                                                            <i className="fa fa-clock-o" aria-hidden="true"></i>
                                                                        </div>
                                                                        <div className="no-padding light-red  font-11" align="center">
                                                                            {this.state.totalDuration}
                                                                        </div>
                                                                        <div className="total-odo-info" align="center">
                                                                            <i className="fa fa-car" aria-hidden="true"></i>
                                                                        </div>
                                                                        <div className="total-odo" align="center">
                                                                            {this.state.totalOdo} Kms
                                                                </div>
                                                                    </div>
                                                                </Col>
                                                            }
                                                            {
                                                                bookingDetail && bookingDetail.status.id == 6 &&
                                                                <Col sm="4">
                                                                    <div className="jr-time-icon">
                                                                        <div className="no-padding margin-top-12 " align="center">
                                                                            <i className="fa fa-clock-o" aria-hidden="true"></i>
                                                                        </div>
                                                                        <div className="no-padding light-red  font-11" align="center">
                                                                            {this.state.totalDuration}
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
                                                                bookingDetail && bookingDetail.status.id == 7 &&
                                                                <Col sm="4" className="ride-end-detail">
                                                                    <p className="trip-detail-info">{this.state.rideEndDate}</p>
                                                                    <p className="trip-detail-info">{this.state.rideEndTime}</p>
                                                                    <p className="trip-detail-info">{bookingDetail.ride_return.end_odo_reading}</p>
                                                                </Col>
                                                            }
                                                            {
                                                                bookingDetail && bookingDetail.status.id == 6 &&
                                                                <Col sm="4" className="ride-end-detail">
                                                                    <p>In Transit</p>
                                                                </Col>
                                                            }
                                                        </Row>
                                                        :
                                                        <div>
                                                            {
                                                                (bookingDetail.status && bookingDetail.status.id === 8 && bookingDetail.cancellation && bookingDetail.cancellation.type) &&
                                                                <div>
                                                                    <Row>
                                                                        <Col sm="6">
                                                                            <span>Type : </span>
                                                                            <span>{bookingDetail.cancellation.type.name}</span>
                                                                        </Col>
                                                                        <Col sm="6">
                                                                            <span>Time : </span>
                                                                            <span>{bookingDetail.cancellation.updated_at}</span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col sm="12">
                                                                            <span>Cancelled By :</span>
                                                                            <span>{bookingDetail.cancellation.created_user.display_name}</span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col sm="12">
                                                                            <span>Note :</span>
                                                                            <span>{bookingDetail.cancellation.cancellation_note}</span>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            }
                                                            {
                                                                (bookingDetail && bookingDetail.status && bookingDetail.status.id === 5) &&
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
                                                            bookingDetail && bookingDetail.status && (bookingDetail.status.id == 6 || bookingDetail.status.id == 7) &&
                                                            <Col sm="6">
                                                                <Progress value="getStartingFuelPercentage">{getStartingFuelPercentage}%</Progress>
                                                            </Col>
                                                        }
                                                        {
                                                            bookingDetail && bookingDetail.status && (bookingDetail.status.id == 6 || bookingDetail.status.id == 7) &&
                                                            <Col sm="6">
                                                                <Progress value="getEndingFuelPercentage">{getEndingFuelPercentage}%</Progress>
                                                            </Col>
                                                        }

                                                    </Row>
                                                    <Row className="handover-user">
                                                        {
                                                            bookingDetail && bookingDetail.status && (bookingDetail.status.id == 6 || bookingDetail.status.id == 7) &&
                                                            <Col sm="6">
                                                                <div className="jr-start-time">
                                                                    <i className="fa fa-key" aria-hidden="true"></i>
                                                                    {bookingDetail.ride_return.handover_user.display_name}
                                                                </div>
                                                            </Col>
                                                        }
                                                        {
                                                            bookingDetail && bookingDetail.status && bookingDetail.ride_return && bookingDetail.ride_return.picker_user && (bookingDetail.status.id == 6 || bookingDetail.status.id == 7) &&
                                                            <Col sm="6">
                                                                <div className="jr-time-icon">
                                                                    <i className="fa fa-key" aria-hidden="true"></i>
                                                                    {bookingDetail.ride_return.picker_user.display_name}
                                                                </div>
                                                            </Col>
                                                        }
                                                    </Row>
                                                </div>
                                            </CardBody>
                                        }
                                        <Row className="ride-return-text">
                                            {
                                                bookingDetail && bookingDetail.is_split_payment == 1 &&
                                                <Col sm="3">
                                                    <ButtonToolbar>
                                                        <Button color="success" size="sm">
                                                            <small>Split Payment</small>
                                                        </Button>
                                                    </ButtonToolbar>
                                                </Col>
                                            }
                                            {
                                                bookingDetail && bookingDetail.is_peak == 1 &&
                                                <Col sm="3">
                                                    <ButtonToolbar>
                                                        <Button color="success" size="sm">
                                                            <small>Peak Season</small>
                                                        </Button>
                                                    </ButtonToolbar>
                                                </Col>
                                            }
                                            {
                                                bookingDetail && bookingDetail.refund_source &&
                                                <Col sm="3">
                                                    <ButtonToolbar>
                                                        <Button color="success" size="sm">
                                                            <small>IMPS Refund</small>
                                                        </Button>
                                                    </ButtonToolbar>
                                                </Col>
                                            }
                                            {
                                                bookingDetail && bookingDetail.user.wallet_refund == 1 &&
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
                                                    (bookingDetail && bookingDetail.status && (bookingDetail.status.id == 7 || bookingDetail.status.id == 8)) ?
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
                                                        (bookingDetail && amountDue > 0) ?
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
                            </Col>

                            <Card className="tab-content">
                                <Nav tabs>
                                    {
                                        tabContent.length ?
                                            tabContent.map((tab, key) => (
                                                <NavItem key={key}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === key ? 'active' : '' })}
                                                        onClick={() => { this.toggle(key, tab); }}>
                                                        <i className="fa fa-bars"></i> {tab.name}
                                                    </NavLink>
                                                </NavItem>
                                            ))
                                            : null
                                    }
                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    {
                                        tabContent.length ?
                                            tabContent.map((tab, key) => {
                                                if (activeTab == key) {
                                                    return (
                                                        <TabPane className='relative' key={key} tabId={key}>
                                                            <TableWrapper listing={tab.data} columns={tab.columns}></TableWrapper>
                                                        </TabPane>
                                                    )
                                                }
                                            })
                                            : null}
                                </TabContent>
                            </Card>

                            {/* <Row>

                            <Nav tabs>
                                {
                                    tabs.map((tab, key) => (
                                        <NavItem key={key}>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === key ? 'active' : '' })}
                                                onClick={() => { this.toggle(key); }}>
                                                {tab}
                                            </NavLink>
                                        </NavItem>
                                    ))
                                }
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                {
                                    tabs.map((tab, key) => (
                                        <TabPane key={key} tabId={key}>
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        {
                                                            tabContent[key].finalColumns.map((column, key) => (
                                                                <th key={key}> {column.display_name}</th>
                                                            ))
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        tabs.data[tab.index].map((listingRow, rowKey) => (
                                                            <tr key={rowKey}>
                                                                {tabContent[key].finalColumns.map((column, key) => (
                                                                    <td key={key}>{listingRow[column.column_name]}</td>
                                                                ))}
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                        </TabPane>
                                    ))
                                }
                            </TabContent>

                        </Row> */}
                        </Row>
                    }
                </div>
            </div>
        )
    }
}
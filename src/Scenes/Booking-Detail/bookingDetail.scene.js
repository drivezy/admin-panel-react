import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col, Progress
} from 'reactstrap';
// import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Button, CardTitle, CardText, Row, Col, Progress } from 'reactstrap';
import classnames from 'classnames';

import GLOBAL from './../../Constants/global.constants';
import { Get } from './../../Utils/http.utils';

import UserCard from './../../Components/User-Card/userCard.component';


import './bookingDetail.scene.css';

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
        const url = 'booking/' + bookingId + '?includes=overspeeding,vehicle.car,user.licenses,status,createdUser,booking_payment.created_user,feedback.feedback_categories.category,rideReturn.pickerUser,rideReturn.handoverUser,splitPayment.user,collection.accounthead,extension.createdUser,payment.response,payment.created_user,payment.acknowledgeUser,refund.authorizer,refund.response,venuePick.city,venueDrop.city,vehicleMovement,vehicleMovement.sourceVenue,vehicleMovement.destinationVenue,vehicleMovement.mover,addon.addon,addon.chargeType,cancellation.createdUser,cancellation.type,city,comments.createdUser,comments.comment_type,source,package.package,resetInvoice.createdUser,internalBooking.driver,images.type,images.created_user,events,accident.damage_severity,vehicleChange.oldVehicle,vehicleChange.newVehicle,vehicleChange.createdUser,vehicleChange.reasonType,type,coupon.campaign,offers,vendorDriver.type,vendorDriver.vendor.vendor,trips,alerts.type,booking_summary,overspeeding,partner_collections.account_head,partner_account,pending_actions.assigned_user,pending_actions.completed_user,permits.state,application,billing_car,invoices.created_user,refund.imps_request,booking_steps.checklist_step'
        const result = await Get({ url });

        if (result.success) {
            const bookingDetail = result.response;
            console.log(bookingDetail);
            this.setState({ bookingDetail });
        }
    }

    // toggle = (tab) => {
    //     if (this.state.activeTab !== tab) {
    //         this.setState({
    //             activeTab: tab
    //         });
    //     }
    // }

    render() {

        // const tabs = ['booking_payment', 'extension'];



        const { bookingDetail = {} } = this.state;

        return (
            <div className="booking-user">

                <UserCard userData={bookingDetail.user} />

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
                                            <Col sm="6">
                                                <span className="booking-status">{bookingDetail.status.value}</span>
                                            </Col>
                                        </Row>
                                    </CardTitle>
                                    <CardBody>
                                        <Row className="gray-border-bottom">
                                            <Col sm="10">
                                                <Row>
                                                    <Col sm="4">
                                                        <img className="media-object width-100" src={`${bookingDetail.vehicle.car.image}`} alt="Car Image" />
                                                    </Col>
                                                    <Col sm="8">
                                                        <span>{bookingDetail.vehicle.registration_number} ({bookingDetail.vehicle.car.name})</span>
                                                        <p>
                                                            {bookingDetail.type.value}
                                                            <span>({bookingDetail.fuel_package == null ? bookingDetail.with_fuel ? 'withfuel' : 'fuelless' : bookingDetail.fuel_package + ' Kms fuel package'})</span>
                                                        </p>
                                                        <p uib-tooltip="Billing Vehicle" tooltip-placement="bottom-left" ng-if="bookingDetail.billing_car!=null">
                                                            <b>{bookingDetail.billing_car.name}</b>
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col sm="2">
                                                <div className="no-padding coupon-code black-text " uib-tooltip="{viewBooking.couponDescription}" tooltip-placement="top-left"
                                                    ng-if="bookingDetail.coupon_id">
                                                    {bookingDetail.coupon.coupon_code}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="gray-border-bottom">
                                            <Col sm="5">
                                                <div className="jr-start-time">
                                                    <div className="no-padding text-black font-12">
                                                        {bookingDetail.pickup_time}
                                                    </div>
                                                    <div className="no-padding margin-top-12 text-black font-12">
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
                                                        <i className="fas fa-car" aria-hidden="true"></i>
                                                    </div>
                                                    <div className="no-padding light-red  font-11" align="center">
                                                        53 Hrs.
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm="5">
                                                <div className="jr-drop-time">
                                                    <div className="no-padding text-black font-12" align="right">
                                                        {bookingDetail.drop_time}
                                                    </div>
                                                    <div className="no-padding margin-top-12 text-black font-12" align="right">
                                                        {bookingDetail.venue_drop.name}
                                                    </div>
                                                    <div className="no-padding text-black font-12" align="right">
                                                        {bookingDetail.venue_drop.city.name}
                                                    </div>
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
                                    <CardTitle>Trip Details</CardTitle>
                                    <CardBody>
                                        <Row className="gray-border-bottom">
                                            <Col sm="4">
                                                <p>{bookingDetail.ride_return.actual_start_time}</p>
                                                <p>{bookingDetail.ride_return.actual_start_time}</p>
                                                <p>{bookingDetail.ride_return.start_odo_reading}</p>
                                            </Col>
                                            <Col sm="4">
                                                <div className="jr-time-icon">
                                                    <div className="no-padding margin-top-12 " align="center">
                                                        <i className="fas fa-car" aria-hidden="true"></i>
                                                    </div>
                                                    <div className="no-padding light-red  font-11" align="center">
                                                        53 Hrs.
                                                    </div>
                                                    <div className="no-padding light-red  font-11" align="center">
                                                        8 Kms.
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm="4">
                                                <p>{bookingDetail.ride_return.actual_end_time}</p>
                                                <p>{bookingDetail.ride_return.actual_end_time}</p>
                                                <p>{bookingDetail.ride_return.end_odo_reading}</p>
                                            </Col>
                                        </Row>
                                        <Row className="gray-border-bottom">
                                            <Col sm="6">
                                                <Progress value="bookingDetail.ride_return.start_fuel_percentage">{bookingDetail.ride_return.start_fuel_percentage}%</Progress>
                                            </Col>
                                            <Col sm="6">
                                                <Progress value="bookingDetail.ride_return.end_fuel_percentage">{bookingDetail.ride_return.end_fuel_percentage}%</Progress>
                                            </Col>
                                        </Row>
                                        <Row className="gray-border-bottom">
                                            <Col sm="6">
                                                <div className="jr-start-time">
                                                    <i className="fas fa-car" aria-hidden="true"></i>
                                                    {bookingDetail.ride_return.handover_user.display_name}
                                                </div>
                                            </Col>
                                            <Col sm="6">
                                                <div className="jr-time-icon">
                                                    <i className="fas fa-car" aria-hidden="true"></i>
                                                    {bookingDetail.ride_return.picker_user.display_name}
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </div>
                            </Card>
                        </Col>
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
        )
    }
}
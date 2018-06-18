import React, { Component } from 'react';
import { Row, Col, TabContent, TabPane } from 'reactstrap';

import {
    Card, CardImg, CardText, CardBody, Button,
    CardTitle, CardSubtitle, Nav, NavItem, NavLink, Table
} from 'reactstrap';

import classnames from 'classnames';

import UserCard from './../../Components/User-Card/userCard.component';
import { Get } from './../../Utils/http.utils';

import UserLicenseCard from './../../Components/User-License-Card/userLicenseCard.component';

import './userDetail.scene.css';
import TableWrapper from './../../Components/Table-Wrapper/tableWrapper.component';



export default class UserDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            activeTab: 0
        }
    }

    componentDidMount() {
        this.getUser();
    }

    getUser = async () => {
        const { id } = this.props.match.params;
        const url = 'user/' + id + '?includes=bookings.vehicle,bookings.pickup_venue,payment_requests.booking,payment_requests.order,roles.createdUser,roles.role,permissions.created_user,permissions.permission,comments.created_user,sms,user_tickets.status,user_tickets.category,user_tickets.assigned_to,bookings.feedback,licenses'
        const data = await Get({ url });

        if (data.success) {
            let userData = data.response;
            let userBookings = userData.bookings;
            let userTransaction = userData.payment_requests;
            let userRoles = userData.roles;
            let userPermissions = userData.permissions;
            let userComments = userData.comments;
            let userSms = userData.sms;
            let userTickets = userData.user_tickets;
            let userFeedback = userData.user_tickets;
            this.setState({
                userData, tabContent: [
                    {
                        name: 'Booking',
                        data: userBookings,
                        columns: [{
                            field: "booking_date",
                            label: "Booking Date"
                        }, {
                            field: "token",
                            label: "PNR"
                        }, {
                            field: "vehicle.registration_number",
                            label: "Registration Number"
                        }, {
                            field: "updated_at",
                            label: "Pickup Time"
                        }, {
                            field: "pickup_venue.name",
                            label: "Venue Name"
                        }, {
                            field: "status",
                            label: "Status"
                        }, {
                            field: "tentative_amount",
                            label: "Tentative Amount"
                        }]
                    }, {
                        name: 'Transaction',
                        data: userTransaction,
                        columns: [{
                            field: "booking.token",
                            label: "PNR"
                        }, {
                            field: "order",
                            label: "Order"
                        }, {
                            field: "payment_acknowledged_datetime",
                            label: "Date"
                        }, {
                            field: "start_time",
                            label: "Start Time"
                        }, {
                            field: "code",
                            label: "Code"
                        }, {
                            field: "amount",
                            label: "Amount"
                        }, {
                            field: "source",
                            label: "Source"
                        }, {
                            field: "booking_acknowledged",
                            label: "Acknowledgement"
                        }]
                    }, {
                        name: 'Roles',
                        data: userRoles,
                        columns: [{
                            field: "role.name",
                            label: "Roles"
                        }, {
                            field: "created_user.display_name",
                            label: "Assigned By"
                        }, {
                            field: "created_at",
                            label: "Created At"
                        }]
                    }, {
                        name: 'Permission',
                        data: userPermissions,
                        columns: [{
                            field: "permission.name",
                            label: "Permissions"
                        }, {
                            field: "created_user.display_name",
                            label: "Assigned By"
                        }, {
                            field: "created_at",
                            label: "Created At"
                        }]
                    }, {
                        name: 'Comments',
                        data: userComments,
                        columns: [{
                            field: "type",
                            label: "Comments"
                        }, {
                            field: "description",
                            label: "Creation Time"
                        }, {
                            field: "completed_user",
                            label: "Creted By"
                        }]
                    }, {
                        name: 'SMS',
                        data: userSms,
                        columns: [{
                            field: "mobile",
                            label: "Mobile"
                        }, {
                            field: "content",
                            label: "Content"
                        }, {
                            field: "created_at",
                            label: "Created At"
                        }, {
                            field: "response",
                            label: "Failure Response"
                        }, {
                            field: "delivery_time",
                            label: "Delivery Time"
                        }, {
                            field: "delivery_status",
                            label: "Delivery Status"
                        }]
                    }, {
                        name: 'Tickets',
                        data: userTickets,
                        columns: [{
                            field: "ticket_number",
                            label: "Ticket Number"
                        }, {
                            field: "billing_date",
                            label: "Reporter"
                        }, {
                            field: "subject",
                            label: "Subject"
                        }, {
                            field: "created_at",
                            label: "Created At"
                        }, {
                            field: "category.name",
                            label: "Category"
                        }, {
                            field: "status.name",
                            label: "Status"
                        }, {
                            field: "assigned_to.display_name",
                            label: "Assignee"
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

        const { userData = {}, tabContent = [], activeTab } = this.state;


        return (

            <div>
                <div className="user-detail">
                    <div className="user-card-data">
                        {
                            userData.id ? <UserCard userData={userData} /> : null
                        }
                    </div>
                    <div className="user-license-data">
                        {
                            userData.id ? <UserLicenseCard userData={userData} /> : null
                        }
                    </div>
                </div>

                <div>
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
                </div>
            </div>
        )
    }
}
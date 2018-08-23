import React, { Component } from 'react';
import { TabContent, TabPane } from 'reactstrap';

import {
    Card, Nav, NavItem, NavLink
} from 'reactstrap';

import classnames from 'classnames';
import { Get } from 'common-js-util';

import UserCard from './../../Components/User-Card/userCard.component';
import TableWrapper from './../../Components/Table-Wrapper/tableWrapper.component';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import { GetPreSelectedMethods, RegisterMethod, GetMenuDetail, ConvertMenuDetailForGenericPage } from './../../Utils/generic.utils';
import { SubscribeToEvent, UnsubscribeEvent, StoreEvent, DeleteEvent } from 'state-manager-utility';


import './userDetail.scene.css';

export default class UserDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            activeTab: 0,
            menuDetail: {}
        }
    }

    componentDidMount() {
        this.getUser();
    }

    componentWillReceiveProps(props) {
        const { id } = props.match.params;
        if (id == this.props.match.params.id) {
            return false;
        }
        this.getUser(id);
    }

    getUser = async (id = this.props.match.params.id) => {
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
        this.getMenuData();
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

    toggle = (key, tab) => {
        this.setState({
            activeTab: key
        });
    }

    refreshPage(event) {
        event.preventDefault();
        this.getUser();
    }


    render() {
        const { history } = this.props;
        const { userData = {}, tabContent = [], activeTab, menuDetail } = this.state;

        const genericDataForCustomColumn = {
            formPreference: {},
            formPreferences: [],
            starter: 'user',
            columns: {},
            url: menuDetail.url ? menuDetail.url.split("/:")[0] : '',
            model: { name: 'user' },
            modelId: null,
            methods: RegisterMethod(menuDetail.uiActions),// genericutils 
            preDefinedmethods: GetPreSelectedMethods(), // genericutils
            modelHash: null
        };

        return (

            <div className="user-details">
                <div className="header-actions">
                    <button className="refresh-button btn btn-sm" onClick={(e) => { this.refreshPage(e) }}>
                        <i className="fa fa-refresh"></i>
                    </button>
                    &nbsp;&nbsp;
                    <CustomAction menuDetail={menuDetail} genericData={genericDataForCustomColumn} history={history} actions={menuDetail.uiActions} listingRow={userData} placement={'as_dropdown'} callback={this.getUser} />
                </div>

                <div className="display">
                    {/* <Row> */}
                    <div className="user-detail">
                        {/* <Col lg="12" sm= md= xs= > */}
                        <div className="user-card-data">
                            {
                                userData.id ? <UserCard userData={userData} /> : null
                            }
                        </div>
                        {/* <div className="user-license-data">
                                        {
                                            userData.id ? <UserLicenseCard userData={userData} /> : null
                                        }
                                    </div> */}
                        {/* </Col> */}
                    </div>

                    {/* <Col> */}
                    <Card className="tab-wrapper">
                        <Nav tabs>
                            {
                                tabContent.length ?
                                    tabContent.map((tab, key) => (
                                        <NavItem key={key}>
                                            {
                                                tab.data.length > 0 &&
                                                <NavLink
                                                    className={classnames({ active: activeTab === key ? 'active' : '' })}
                                                    onClick={() => { this.toggle(key, tab); }}>
                                                    <i className="fa fa-bars"></i> {tab.name}
                                                </NavLink>
                                            }
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
                                                    {
                                                        tab.data.length > 0 &&
                                                        <TableWrapper listing={tab.data} columns={tab.columns}></TableWrapper>
                                                    }
                                                </TabPane>
                                            )
                                        }
                                    })
                                    : null}
                        </TabContent>
                    </Card>
                    {/* </Col> */}
                    {/* // </Row> */}
                </div>
            </div>
        )
    }
}
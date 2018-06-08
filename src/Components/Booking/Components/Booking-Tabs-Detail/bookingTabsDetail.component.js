import React, { Component } from 'react';
import {
    Card, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';

import classnames from 'classnames';

import TableWrapper from './../../../../Components/Table-Wrapper/tableWrapper.component';

import './bookingTabsDetail.css';

export default class BookingTabsDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingTabsData: props.bookingTabsData,
            tabContent: [],
            activeTab: 0
        };
    }

    toggle = (key, tab) => {
        this.setState({
            activeTab: key
        });
    }

    render() {
        const { bookingTabsData = {}, activeTab } = this.state;

        const tabContent = [
            {
                name: 'Payment',
                data: bookingTabsData.payment,
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
                data: bookingTabsData.refund,
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
                data: bookingTabsData.vehicle_change,
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
                data: bookingTabsData.events,
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
                data: bookingTabsData.vehicle_movement,
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
                data: bookingTabsData.pending_actions,
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
                data: bookingTabsData.comments,
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
                data: bookingTabsData.partner_account,
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

        return (

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

        )
    }
}

import React, { Component } from 'react';

import UserCard from './../../../User-Card/userCard.component';

import {
    Card, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';

import './startRide.css';

export default class BookingTabsDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingDetail: props.bookingDetail
        };
    }

    render() {
        const startRide = {}
        return (

            <div className="start-ride">
                <div className="left-pane">
                    {
                        <UserCard userData={bookingDetail.user} />
                    }
                </div>
                <div className="right-pane">

                    <div className="details list-group-item">
                        <div className="text-field"><i className="fa fa-clock-o" aria-hidden="true"></i> Start Time </div>
                        <input value={startRide.startTime} type="text" className="data-field" placeholder='Start Time'></input>
                    </div>

                    <div className="details list-group-item">
                        <div className="text-field"><i className="fa fa-hourglass-start" aria-hidden="true"></i> Start Odo Reading </div>
                        <input value={startRide.startOdoReading} type="text" className="data-field" placeholder='Start Od Reading'></input>
                    </div>

                    <div className="details list-group-item">
                        <div className="text-field"><i className="fa fa-tint" aria-hidden="true"></i> Fuel Percentage </div>
                        <input value={startRide.startFuelPercentage} type="text" className="data-field" placeholder='Fuel Percentage'></input>
                    </div>

                    <div className="details list-group-item">
                        <div className="text-field"><i className="fa fa-phone" aria-hidden="true"></i> Alternate Number </div>
                        <input value={startRide.alternateNumber} type="text" className="data-field" placeholder='Alternate Number'></input>
                    </div>

                    <div className="details list-group-item">
                        <div className="text-field"><i className="fa fa-commenting-o" aria-hidden="true"></i> Comments </div>
                        <input value={startRide.comments} type="text" className="data-field" placeholder='Comments'></input>
                    </div>

                </div>
            </div>
        )
    }
}

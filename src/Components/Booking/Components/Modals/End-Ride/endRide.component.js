import React, { Component } from 'react';
import './endRide.component.css';

import AddonUpdate from './../../../../Addon-Update/addonUpdate.component';
import { ModalManager } from 'drivezy-web-utils/build/Utils';
import EndRideConfirm from './endRideConfirm.component';

export default class EndRide extends Component {

    constructor(props) {
        super(props);

        this.state = {
            endRideInfo: this.props.endRidedata
        }
    }

    render() {
        const { endRideInfo = {} } = this.state;
        const { endRidedata } = this.props;

        return (
            <div className="modalBody">
                <div className="endRide-modal">
                    <div className="ride-form">
                        <div className="ride-info">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Booking PNR</label>
                                </div>
                                <div className="col-sm-12">
                                    <input type='text' value={endRideInfo.token} disabled/>
                                </div>
                            </div>
                            {
                            <div className="row">
                                <div className="col-sm-5">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Actual Start Time</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' placeholder='Booking PNR' value={endRideInfo.pickup_time} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-7">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>End Time&nbsp;<i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;<i className="fa fa-car" aria-hidden="true"></i></label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='datetime-local' placeholder='2018-08-03 15:11' onChange={(e) => { endRideInfo.endTime= e.target.value; this.setState({ endRideInfo });}} required/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }{
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <label>Start Odo Reading</label>
                                    </div>
                                    <div className="col-sm-12">
                                        <input type='text' value={endRideInfo.ride_return.start_odo_reading} disabled/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <label>End Odo Reading</label>
                                    </div>
                                    <div className="col-sm-12">
                                        <input type='text' placeholder={endRideInfo.ride_return.start_odo_reading} onChange={(e) => { endRideInfo.ride_return.end_odo_reading= e.target.value; this.setState({ endRideInfo });}}/>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        }{
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Start Fuel Percentage</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' value={endRideInfo.ride_return.start_fuel_percentage} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>End Fuel Percentage</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' placeholder='100' onChange={(e) => { endRideInfo.ride_return.end_fuel_percentage= e.target.value; this.setState({ endRideInfo });}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }{
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Cleaniness Cost</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' placeholder="0.00"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Other Costs</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' placeholder='0.00'/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }{
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Damaged Costs</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' placeholder='0.00'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Repair Costs</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' placeholder='0.00'/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Comments</label>
                                </div>
                                <div className="col-sm-12">
                                    <input type='text' placeholder="Add comments" onChange={(e) => { endRideInfo.comments = e.target.value; this.setState({ endRideInfo });}}/>
                                </div>
                            </div>
                        {
                            <div className="row">
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <label>Refuel Costs</label>
                                    </div>
                                    <div className="col-sm-12">
                                        <input type='text' placeholder='0.00'/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <label>Redeem <i className="fa fa-refresh" aria-hidden="true"></i></label>
                                    </div>
                                    <div className="col-sm-12">
                                        <input type='text' placeholder='0'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                        </div>
                        <div className="ride-info">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Discount</label>
                                </div>
                                <div className="col-sm-6">
                                    <input type='text' placeholder='0.00'/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>State Permit Cost</label>
                                </div>
                                <div className="col-sm-6">
                                    <input type='text' placeholder='0'/>
                                </div>
                            </div>
                            <br />
                            {
                            <div className="addon">
                                {/* Pass rideStatus = 1 for start and 0 for end */}
                                <AddonUpdate rideStatus={0} rideData={endRideInfo}/>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="modalfooter">
                    <div className="row">
                            <div className="col-sm-6">
                                While picking the vehicle from user end the ride.
                            </div>
                            <div className="col-sm-6 btns">
                                <button className="btn btn-default"> Cancel </button>
                                &nbsp;
                                <button className="btn btn-warning"> Reset </button>
                                &nbsp;
                                <button type="submit" className="btn btn-success" onClick={() => {
                                    ModalManager.openModal({
                                    headerText: "CONFIRM COMPLETE RIDE FOR",
                                    modalBody: () => (<EndRideConfirm endRidedata={endRideInfo}/>)
                                })
                            }}> Complete Ride </button>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}
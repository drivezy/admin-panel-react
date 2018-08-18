import React, { Component } from 'react';
import UserCard from './../../../../User-Card/userCard.component';

import { ModalManager } from 'drivezy-web-utils/build/Utils';
import AddonUpdate from './../../../../Addon-Update/addonUpdate.component';
import { Post } from 'common-js-util';
import './startRide.component.css';
import { API_HOST } from './../../../../../Constants/global.constants';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils/toast.utils';

export default class StartRide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            startOdo: 0,
            startFuel: 0,
            alternateNumber: 0,
            comment: "",
            pickupTime: 0


        };
    }

    onSubmit = async (startOdo, startFuel, alternateNumber, comment, pickupTime) => {
        this.setState({ startOdo, startFuel, alternateNumber, comment, pickupTime })
        const result = await Post({ url: "startRide",
        body: {
            comments : comment,
            fuel_percentage : startFuel,
            mobile_number : alternateNumber,
            odo_reading : startOdo,
            pnr : this.state.data.token,
            start_time: pickupTime,
            addon: this.state.data.start_addons
        }
        ,
        urlPrefix: API_HOST });

        let message = result.response

        if(result.success )
            ToastNotifications.success({title: 'Ride Started Succesfully'})

        ModalManager.closeModal();
    }

    onCancel() {
        ModalManager.closeModal();
    }

    render() {
        const { startOdo, startFuel, alternateNumber, comment, pickupTime } = this.state;
        const { data } = this.state
        let count = 0;

        return (
            <div className="modal-start-ride">
                <div className="start-ride">
                    <div className="left-pane">
                        {
                            <UserCard userData={data.user} />
                        }
                    </div>
                    <div className="right-pane">
                        <div className="data">
                            <div className="details">
                                <div className="text-field"> <i className="fa fa-clock-o" aria-hidden="true"></i>Start Time   </div>
                                <input onChange={(e) => (this.state.pickupTime = e.target.value)} type="datetime-local" className="data-field" placeholder='Start Time'></input>
                            </div>

                            <div className="details">
                                <div className="text-field">  <i className="fa fa-hourglass-start" aria-hidden="true"></i>Start Odo Reading  </div>
                                <input onChange={(e) => (this.state.startOdo = e.target.value)} type="number" className="data-field" placeholder='Start Odo Reading'></input>
                            </div>

                            <div className="details">
                                <div className="text-field"> <i className="fa fa-tint" aria-hidden="true"></i>Fuel Percentage</div>
                                <input onChange={(e) => (this.state.startFuel = e.target.value)} type="number" className="data-field" placeholder='Fuel Percentage'></input>
                            </div>

                            <div className="details">
                                <div className="text-field"> <i className="fa fa-phone" aria-hidden="true"></i>Alternate Number</div>
                                <input onChange={(e) => 
                                    {(this.state.alternateNumber = e.target.value); count++;}
                                } type="number"  className={count<10 ? "data-field" : "data-field inactive"} 
                                placeholder='Alternate Number'></input>
                            </div>

                            <div className="details">
                                <div className="text-field">  <i className="fa fa-commenting-o" aria-hidden="true"></i>Comments</div>
                                <textarea onChange={(e) => (this.state.comment = e.target.value)} type="text" className="data-field" placeholder='Comments (If Any)'></textarea>
                            </div>

                        </div>
                        {
                            <div className="addon">
                                <AddonUpdate rideStatus={1} rideData={this.state.data} />
                            </div>
                        }

                    </div>
                </div>
                <div className="cancel-and-submit">
                    <button className="cancel btn btn-warning" onClick={() => { this.onCancel() }}>Cancel</button>
                    &nbsp;
                    <button className="submit btn btn-success" onClick={() => { this.onSubmit(this.state.startOdo, this.state.startFuel, this.state.alternateNumber, this.state.comment, this.state.pickupTime) }}>Submit</button>
                </div>
            </div>
        )
    }
}

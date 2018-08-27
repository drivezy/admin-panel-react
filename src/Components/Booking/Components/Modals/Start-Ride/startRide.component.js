import React, { Component } from 'react';
import UserCard from './../../../../User-Card/userCard.component';

import { ModalManager } from 'drivezy-web-utils/build/Utils';
import AddonUpdate from './../../../../Addon-Update/addonUpdate.component';
import { Post } from 'common-js-util';
import './startRide.component.css';
import DatePicker from './../../../../../Components/Forms/Components/Date-Picker/datePicker';
import moment from 'moment'
import SelectBox from './../../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import { RECORD_URL } from './../../../../../Constants/global.constants';
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
            pickupTime: 0,
            count: 10,
            presentTime: 0,
            lateByCustomer: 1,
            lateReason: ""
        };
    }

    onSubmit = async (startOdo, startFuel, alternateNumber, comment, pickupTime) => {
        //this.setState({ startOdo, startFuel, alternateNumber, comment, pickupTime })

        let body;
        if (this.state.lateByCustomer == 1) {
            body = {
                comments: comment,
                fuel_percentage: startFuel,
                mobile_number: alternateNumber,
                odo_reading: startOdo,
                pnr: this.state.data.token,
                start_time: pickupTime,
                addon: this.state.data.start_addons,
                late_by_customer: this.state.lateByCustomer,
                late_reason: this.lateReason
            }
        }
        else {
            body = {
                comments: comment,
                fuel_percentage: startFuel,
                mobile_number: alternateNumber,
                odo_reading: startOdo,
                pnr: this.state.data.token,
                start_time: pickupTime,
                addon: this.state.data.start_addons,
                late_by_customer: this.state.lateByCustomer,
                late_reason: this.lateReason
            }
        }

        const result = await Post({
            url: "startRide",
            body: body

        });

        ModalManager.closeModal();

    }

    onCancel() {
        ModalManager.closeModal();
    }

    count(number) {
        this.setState({ count: number.toString().length })
    }

    setCurrentTime(presentTime) {
        // this.setState({ presentTime: presentTime })
        let pickupTime
        console.log(presentTime)
        if (presentTime)
            pickupTime = moment().format('YYYY-MM-DD HH:mm')
        else
            pickupTime = this.state.data.pickup_time
        this.setState({ pickupTime, presentTime })


    }

    render() {
        const { startOdo, startFuel, alternateNumber, comment, pickupTime } = this.state;
        const { data, presentTime } = this.state
        let x = 0
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
                            <div className="details date-field start-time">
                                <div className="text-field"> Start Time <i className="fa fa-clock-o set-current-time" aria-hidden="true" onClick={() => this.setCurrentTime(1)}></i> <i className="fa fa-car set-booking-time" onClick={() => this.setCurrentTime(0)}></i> </div>
                                {/* <input onChange={(e) => (this.state.pickupTime = e.target.value)} type="datetime-local" className="data-field" placeholder='Start Time'></input> */}
                                {/* <DateTimePicker onChange={(e) => console.log(e)} /> */}
                                <DatePicker value={pickupTime} single={true} timePicker={true} onChange={(name, value) => this.setState({ pickupTime: value })}
                                />
                            </div>

                            {
                                this.state.presentTime ?
                                    <div className="details">
                                        <div className="text-field">  Ride is late by  </div>
                                        <SelectBox isClearable={false} onChange={(e) => this.setState({ lateByCustomer: e == 'Customer' ? true : false })} className="data-field" placeholder='Start Odo Reading' options={["Customer", "Fleet"]} ></SelectBox>
                                    </div>
                                    :
                                    null
                            }

                            {
                                !this.state.lateByCustomer ?
                                    <div className="details">
                                        <div className="text-field">  Late Reason  </div>
                                        <textarea onChange={(e) => this.setState({ lateReason: e.target.value })} type="text" className="data-field" placeholder='Comments (If Any)'></textarea>
                                    </div>
                                    :
                                    null
                            }

                            <div className="details">
                                <div className="text-field">  Start Odo Reading  </div>
                                <input onChange={(e) => this.setState({ startOdo: e.target.value })} type="number" className="data-field" placeholder='Start Odo Reading'></input>
                            </div>

                            <div className="details">
                                <div className="text-field">Fuel Percentage</div>
                                <input onChange={(e) => {
                                    this.setState({ startFuel: e.target.value })
                                }

                                } type="number" className={`data-field ${startFuel <= 100 ? 'green' : 'red'}`} placeholder='Fuel Percentage'></input>
                                <div className="error-text">
                                    {this.state.startFuel > 100 ? <p>Fuel Percentage cannot be greater than 100</p> : null}
                                </div>
                            </div>

                            <div className="details">
                                <div className="text-field"> Alternate Number</div>
                                <input max='99999'
                                    onChange={(e) => {
                                        this.count(e.target.value); this.setState({ alternateNumber: e.target.value });
                                    }
                                    } type="number" className={`data-field ${this.state.count == 10 ? 'green' : 'red'}`}
                                    placeholder='Alternate Number'></input>
                                <div className="error-text">
                                    {this.state.count > 10 ? <p>Not a valid number</p> : null}
                                </div>
                            </div>

                            <div className="details">
                                <div className="text-field"> Comments</div>
                                <textarea onChange={(e) => this.setState({ comment: e.target.value })} type="text" className="data-field" placeholder='Comments (If Any)'></textarea>
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
                    <button disabled={startOdo == 0 || startFuel == 0 || startFuel > 100 || pickupTime == 0 || alternateNumber.toString().length != 10 || !(this.state.data.created_user.is_license_validated)} className="submit btn btn-success" onClick={() => { this.onSubmit(this.state.startOdo, this.state.startFuel, this.state.alternateNumber, this.state.comment, this.state.pickupTime) }}>Submit</button>
                </div>
            </div >
        )
    }
}

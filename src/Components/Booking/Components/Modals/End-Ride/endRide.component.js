import React, { Component } from 'react';
import './endRide.component.css';

import moment from 'moment';

import { API_HOST } from './../../../../../Constants/global.constants';

import AddonUpdate from './../../../../Addon-Update/addonUpdate.component';
import EndRideConfirm from './endRideConfirm.component';
import CustomTooltip from '../../../../Custom-Tooltip/customTooltip.component';
import SelectBox from './../../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import DatePicker from './../../../../Forms/Components/Date-Picker/datePicker';

import { Get, Post} from 'common-js-util';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';

export default class EndRide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            endRideInfo: this.props.data,
            discountOptions: [],
            stateOptions: [],
            end_time: "",
            wallet_balance: 0
        }
    }

    /**
     * To fetch Discount Options and States for permit state options
     */
    componentDidMount() {
        this.getDiscountOptions();
        this.getStates();
    }


    /**
     * To fetch Discount Options
     */
    getDiscountOptions = async () => {
        const result = await Get({
            url: "lookupValue?query=lookup_type=38&limit=100",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ discountOptions: result.response });
        }
    }

    /**
     * To fetch States for permit state options
     */
    getStates = async () => {
        const result = await Get({
            url: "state",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ stateOptions: result.response });
        }
    }
    /**
     * Open reviewRide modal and send data to get reviewData using Input
     */
    reviewRide = async () => {
        const { endRideInfo, end_time } = this.state;
        const result = await Post({
            url: "reviewRide",
            body: {
                actual_start_time: endRideInfo.pickup_time,
                addons: endRideInfo.addons,
                cleanliness_cost: endRideInfo.cleanliness_cost,
                comments: endRideInfo.ride_return.comments,
                damage_cost: endRideInfo.damage_cost,
                discount: endRideInfo.discount,
                discount_lookup: endRideInfo.discount_lookup,
                end_time: end_time,
                fuel_percentage: endRideInfo.end_fuel_percentage,
                odo_reading: endRideInfo.ride_return.end_odo_reading,
                other_cost: endRideInfo.other_cost,
                permit_refund: endRideInfo.permit_refund,
                permit_state: endRideInfo.permit_state,
                permit_validity: endRideInfo.permit_validity,
                pnr: endRideInfo.token,
                redeem: endRideInfo.redeem,
                refuel_cost: endRideInfo.refuel_cost,
                repair_cost: endRideInfo.repair_cost,
                start_fuel_percentage: endRideInfo.start_fuel_percentage,
                start_addons: endRideInfo.start_addons
            },
            urlPrefix: API_HOST
        });
        if (result.success) {
            ModalManager.openModal({
                headerText: "CONFIRM COMPLETE RIDE FOR",
                modalBody: () => (<EndRideConfirm endRidedata={endRideInfo} reviewRideData={result.response} />)
            })
        }
        else{
            ToastNotifications.error({ title: `${result.response}` });
        }

    }

    checkWalletBalance = async () => {
        const { endRideInfo } = this.state;
        const result = await Get({
            url: `user/${endRideInfo.user_id}?includes=wallet.payment_request.booking,wallet.payment_refund.booking`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ wallet_balance: result.response.wallet_refund });
        }
    }

    setCurrentTime(presentTime) {
        const { endRideInfo } = this.state;
        // this.setState({ presentTime: presentTime })
        let endTime;
        if (presentTime)
            endTime = moment().format('YYYY-MM-DD HH:mm')
        else
            endTime = endRideInfo.ride_return.scheduled_drop_time;
        this.setState({ end_time: endTime });
        endRideInfo.end_time = endTime;
        this.setState({ endRideInfo });
    }

    render() {
        const { endRideInfo = {}, discountOptions = [], stateOptions = [], end_time, wallet_balance } = this.state;

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
                                    <input type='text' value={endRideInfo.token} disabled />
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
                                                <input type='text' placeholder='Booking PNR' value={endRideInfo.pickup_time} disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-7">
                                        <div className="row">
                                            <div className="col-sm-12 endTime">
                                                <label>End Time&nbsp;
                                                    <button className="btn btn-xs btn-default" onClick={() => { this.setCurrentTime(true) }}><i className="fa fa-clock-o" aria-hidden="true"></i></button>
                                                    &nbsp;
                                                    <button className="btn btn-xs btn-default" onClick={() => { this.setCurrentTime(false) }}><i className="fa fa-car" aria-hidden="true"></i></button>
                                                </label>

                                            </div>
                                            <div className="col-sm-12 dateTime">
                                                <DatePicker
                                                    value={end_time}
                                                    single={true}
                                                    timePicker={true}
                                                    onChange={(name, value) => this.setState({ end_time: value })}
                                                />
                                                {/* <DateTimePicker onChange={(e) => { endRideInfo.end_time = e.target.value; this.setState({ endRideInfo }); }} value={endRideInfo.end_time} /> */}
                                                {/* <input type='datetime-local' placeholder='2018-08-03 15:11' onChange={(e) => { endRideInfo.end_time = e.target.value; this.setState({ endRideInfo }); }} value={endRideInfo.end_time}/> */}
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
                                                <input type='text' value={endRideInfo.ride_return.start_odo_reading} disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>End Odo Reading</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='text'
                                                    className={`${((endRideInfo.ride_return.end_odo_reading) < parseInt(endRideInfo.ride_return.start_odo_reading)) && endRideInfo.ride_return.end_odo_reading > 0 ? 'red' : 'green'}`}
                                                    placeholder={endRideInfo.ride_return.start_odo_reading} onChange={(e) => { endRideInfo.ride_return.end_odo_reading = e.target.value; this.setState({ endRideInfo }); }} />
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.ride_return.end_odo_reading < parseInt(endRideInfo.ride_return.start_odo_reading) && endRideInfo.ride_return.end_odo_reading > 0 ? <p>End ride Odo must be greater than {endRideInfo.ride_return.start_odo_reading}</p> : null}
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.ride_return.end_odo_reading ? isNaN(endRideInfo.ride_return.end_odo_reading) ? <p>Only numbers are allowed</p> : null : null}
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
                                                <input type='text' value={endRideInfo.ride_return.start_fuel_percentage} disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>End Fuel Percentage</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input
                                                    className={`${endRideInfo.ride_return.end_fuel_percentage > 100 ? 'red' : 'green'}`}
                                                    type='text' placeholder='100' onChange={(e) => { endRideInfo.ride_return.end_fuel_percentage = e.target.value; this.setState({ endRideInfo }); }} />
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.ride_return.end_fuel_percentage > 100 ? <p>Fuel Percentage cannot be greater than 100.</p> : null}
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.ride_return.end_fuel_percentage ? isNaN(endRideInfo.ride_return.end_fuel_percentage) ? <p>Only numbers are allowed</p> : null : null}
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
                                                <input type='text' placeholder="0.00" onChange={(e) => { endRideInfo.cleanliness_cost = e.target.value; this.setState({ endRideInfo }); }} />
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.cleanliness_cost ? (isNaN(endRideInfo.cleanliness_cost) ? <p>Only numbers are allowed</p> : null) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>Other Costs</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.other_cost = e.target.value; this.setState({ endRideInfo }); }} />
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.other_cost ? isNaN(endRideInfo.other_cost) ? <p>Only numbers are allowed</p> : null : null}
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
                                                <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.damage_cost = e.target.value; this.setState({ endRideInfo }); }} />
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.damage_cost ? isNaN(endRideInfo.damage_cost) ? <p>Only numbers are allowed</p> : null : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>Repair Costs</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.repair_cost = e.target.value; this.setState({ endRideInfo }); }} />
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.repair_cost ? isNaN(endRideInfo.repair_cost) ? <p>Only numbers are allowed</p> : null : null}
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
                                    <input
                                        value={endRideInfo.ride_return.comments}
                                        className={`${endRideInfo.ride_return.comments == "" ? 'red' : 'green'}`}
                                        type='text' placeholder="Add comments" onChange={(e) => { endRideInfo.ride_return.comments = e.target.value; this.setState({ endRideInfo }); }} />
                                </div>
                                <div className="error-text col-sm-12">
                                    {endRideInfo.ride_return.comments == "" ?
                                        <p>Comment cannot be empty.</p>
                                        : null
                                    }
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
                                                <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.refuel_cost = e.target.value; this.setState({ endRideInfo }); }} />
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.refuel_cost ? isNaN(endRideInfo.refuel_cost) ? <p>Only numbers are allowed</p> : null : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12 wallet">
                                                <label>Redeem
                                                    <button className="btn btn-xs btn-default" onClick={() => { this.checkWalletBalance() }}><i className="fa fa-refresh" aria-hidden="true"></i></button>
                                                </label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='text' placeholder='0' onChange={(e) => { endRideInfo.redeem = e.target.value; this.setState({ endRideInfo }); }} />
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {
                                                    endRideInfo.redeem > wallet_balance ? <p>The number should be lesser than or equal to {wallet_balance}</p> : null
                                                }
                                            </div>
                                            <div className="error-text col-sm-12">
                                                {endRideInfo.redeem ? isNaN(endRideInfo.redeem) ? <p>Only numbers are allowed</p> : null : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="ride-info">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Discount</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.discount = e.target.value; this.setState({ endRideInfo }); }} />
                                        </div>
                                        <div className="error-text col-sm-12">
                                            {endRideInfo.discount ? isNaN(endRideInfo.discount) ? <p>Only numbers are allowed</p> : null : null}
                                        </div>
                                    </div>
                                </div>
                                {
                                    endRideInfo.discount ?
                                        <div className="col-sm-6">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <label>Discount Reason</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <SelectBox isClearable={false} onChange={(value) => { endRideInfo.discount_lookup = value.id; this.setState({ endRideInfo }); }} field="name" options={discountOptions} placeholder="Discount Reason" />
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>State Permit Cost
                                            {
                                                    endRideInfo.permit_refund ?
                                                        <button className="btn btn-sm btn-default">
                                                            <CustomTooltip placement="top" html={<i className="fa fa-paperclip"></i>} title="Upload Permit">
                                                            </CustomTooltip>
                                                        </button>
                                                        : null
                                                }
                                            </label>
                                        </div>
                                        <div className="col-sm-12">
                                            <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.permit_refund = e.target.value; this.setState({ endRideInfo }); }} />
                                        </div>
                                        <div className="error-text col-sm-12">
                                            {endRideInfo.permit_refund ? isNaN(endRideInfo.permit_refund) ? <p>Only numbers are allowed</p> : null : null}
                                        </div>
                                    </div>
                                </div>
                                {
                                    endRideInfo.permit_refund ?
                                        <div className="col-sm-6">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <label>Permit State</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <SelectBox isClearable={false} onChange={(value) => { endRideInfo.permit_state = value.id; this.setState({ endRideInfo }); }} field="name" options={stateOptions} placeholder="State" />
                                                </div>
                                            </div>
                                        </div>
                                        : null
                                }
                                {
                                    endRideInfo.permit_refund ?
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>Permit Validity</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <DatePicker
                                                    value={endRideInfo.permit_validity}
                                                    single={true}
                                                    onChange={(name, value) => { endRideInfo.permit_validity = value; this.setState({ endRideInfo }) }}
                                                />
                                                {/* <input type='date' placeholder="Select Range" onChange={(e) => { endRideInfo.permit_validity = e.target.value; this.setState({ endRideInfo }); }} /> */}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <br />
                            {
                                <div className="addon">
                                    {/* Pass rideStatus = 1 for start and 0 for end */}
                                    <AddonUpdate rideStatus={0} rideData={endRideInfo} />
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
                            <button className="btn btn-default" onClick={(e) => { e.preventDefault(); ModalManager.closeModal() }}> Cancel </button>
                            &nbsp;
                                <button className="btn btn-warning"> Reset </button>
                            &nbsp;
                            {
                                endRideInfo.ride_return.end_odo_reading > parseInt(endRideInfo.ride_return.start_odo_reading) ?
                                    <button type="submit" className="btn btn-success" onClick={(e) => { e.preventDefault(); this.reviewRide(); }
                                    }> Complete Ride </button>
                                    :
                                    <button disabled type="submit" className="btn btn-success" onClick={(e) => { e.preventDefault(); this.reviewRide(); }
                                    }> Complete Ride </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
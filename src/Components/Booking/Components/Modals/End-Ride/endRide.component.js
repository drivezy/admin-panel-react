import React, { Component } from 'react';
import './endRide.component.css';

import AddonUpdate from './../../../../Addon-Update/addonUpdate.component';
import { ModalManager } from 'drivezy-web-utils/build/Utils';
import EndRideConfirm from './endRideConfirm.component';
import { Get, Post} from 'common-js-util';
import CustomTooltip from '../../../../Custom-Tooltip/customTooltip.component';
import SelectBox from './../../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import { API_HOST } from './../../../../../Constants/global.constants';

export default class EndRide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            endRideInfo: this.props.data,
            discountOptions: [],
            stateOptions: []
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
        const { stateOptions } = this.state;
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
    reviewRide = async() => {
        const { endRideInfo } = this.state;
        const result = await Post({
            url: "reviewRide",
            body: {
                actual_start_time : endRideInfo.pickup_time,
                addons : endRideInfo.addons,
                cleanliness_cost : endRideInfo.cleanliness_cost,
                comments : endRideInfo.comments,
                damage_cost : endRideInfo.damage_cost,
                discount : endRideInfo.discount,
                discount_lookup : endRideInfo.discount_lookup,
                end_time :  endRideInfo.end_time,
                fuel_percentage : endRideInfo.end_fuel_percentage,
                odo_reading : endRideInfo.ride_return.end_odo_reading,
                other_cost : endRideInfo.other_cost,
                permit_refund : endRideInfo.permit_refund,
                permit_state : endRideInfo.permit_state,
                permit_validity : endRideInfo.permit_validity,
                pnr : endRideInfo.token,
                redeem : endRideInfo.redeem,
                refuel_cost : endRideInfo.refuel_cost,
                repair_cost : endRideInfo.repair_cost,
                start_fuel_percentage : endRideInfo.start_fuel_percentage,
                start_addons : endRideInfo.start_addons
            },
            urlPrefix: API_HOST
        });
        if (result.success) {
            ModalManager.openModal({
                headerText: "CONFIRM COMPLETE RIDE FOR",
                modalBody: () => (<EndRideConfirm endRidedata={endRideInfo} reviewRideData={result.response} />)
            })
        }
        
    }

    render() {
        const { endRideInfo = {}, discountOptions = [], stateOptions = [] } = this.state;
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
                                            <div className="col-sm-12">
                                                <label>End Time&nbsp;<i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;<i className="fa fa-car" aria-hidden="true"></i></label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='datetime-local' placeholder='2018-08-03 15:11' onChange={(e) => { endRideInfo.end_time = e.target.value; this.setState({ endRideInfo }); }} required />
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
                                                <input type='text' placeholder={endRideInfo.ride_return.start_odo_reading} onChange={(e) => { endRideInfo.ride_return.end_odo_reading = e.target.value; this.setState({ endRideInfo }); }} />
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
                                                <input type='text' placeholder='100' onChange={(e) => { endRideInfo.ride_return.end_fuel_percentage = e.target.value; this.setState({ endRideInfo }); }} />
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
                                                <input type='text' placeholder="0.00" onChange={(e) => { endRideInfo.cleanliness_cost = e.target.value; this.setState({ endRideInfo }); }}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>Other Costs</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.other_cost = e.target.value; this.setState({ endRideInfo }); }}/>
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
                                                <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.damage_cost = e.target.value; this.setState({ endRideInfo }); }}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>Repair Costs</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='text' placeholder='0.00' onChange={(e) => { endRideInfo.repair_cost = e.target.value; this.setState({ endRideInfo }); }}/>
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
                                    <input type='text' placeholder="Add comments" onChange={(e) => { endRideInfo.comments = e.target.value; this.setState({ endRideInfo }); }} />
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
                                                <input type='text' placeholder='0.00' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>Redeem <i className="fa fa-refresh" aria-hidden="true"></i></label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='text' placeholder='0' onChange={(e) => { endRideInfo.redeem = e.target.value; this.setState({ endRideInfo }); }}/>
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
                                            <input type='date' placeholder="Select Range" onChange={(e) => { endRideInfo.permit_validity = e.target.value; this.setState({ endRideInfo }); }} />
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
                            <button className="btn btn-default"> Cancel </button>
                            &nbsp;
                                <button className="btn btn-warning"> Reset </button>
                            &nbsp;
                                <button type="submit" className="btn btn-success" onClick={(e) => 
                                {e.preventDefault(); this.reviewRide();}
                            }> Complete Ride </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
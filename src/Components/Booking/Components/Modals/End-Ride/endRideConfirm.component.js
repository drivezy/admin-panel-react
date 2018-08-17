import React, { Component } from 'react';
import './endRideConfirm.component.css';
import { Post} from 'common-js-util';

import { TotalDuration } from './../../../../../Utils/booking.utils';
import { ModalManager } from 'drivezy-web-utils/build/Utils';
import { API_HOST } from './../../../../../Constants/global.constants';

export default class EndRideConfirm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            endRideInfo: this.props.endRidedata,
            reviewdata: this.props.reviewRideData,
            flattenReviewData: []
        }
    }
    /**
     * Flat review data
     */
    componentDidMount() {
        const { reviewdata } = this.state;
        this.flattenData(reviewdata);
    }
    
    /**
     * data from endRide component
     * @param  {object} reviewdata
     */
    flattenData = (reviewdata) => {
        function dive(currentKey, into, target) {
            for (var i in into) {
                if (into.hasOwnProperty(i)) {
                    var newKey = i;
                    var newVal = into[i];

                    if (currentKey.length > 0) {
                        newKey = i;
                    }

                    if (typeof newVal === "object") {
                        dive(newKey, newVal, target);
                    } else {
                        target[newKey] = newVal;
                    }
                }
            }
        }

        function flatten(arr) {
            var newObj = {};
            dive("", arr, newObj);
            return newObj;
        }

        var flattened = (flatten(reviewdata));
        this.setState({ flattenReviewData: flattened });
    }
    /**
     * Call endRide to Post data and close modal
     */
    endRide = async() => {
            const { endRideInfo } = this.state;
            const result = await Post({
                url: "endRide",
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
                ModalManager.closeModal();
            }
            
        }

    render() {
        let amount = 0;
        const { endRideInfo = {}, flattenReviewData } = this.state;

        let duration = TotalDuration(endRideInfo.endTime, endRideInfo.pickup_time);
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
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>Duration</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='text' value={duration} disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label>Distance</label>
                                            </div>
                                            <div className="col-sm-12">
                                                <input type='number' value={endRideInfo.ride_return.end_odo_reading - endRideInfo.ride_return.start_odo_reading} disabled />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
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
                                                <input type='datetime-local' value={endRideInfo.end_time} disabled />
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
                                                <input type='text' value={endRideInfo.ride_return.end_odo_reading} disabled />
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
                                                <input type='text' value={endRideInfo.ride_return.end_fuel_percentage} disabled />
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
                                    <input type='text' value={endRideInfo.comments} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="ride-info">

                            <div className="row text-center">
                                <div className="col-sm-6">
                                    <label>Particulars</label>
                                </div>
                                <div className="col-sm-3">
                                    <label>Dr.</label>
                                </div>
                                <div className="col-sm-3">
                                    <label>Cr.</label>
                                </div>
                            </div>
                            <hr />
                            {
                                Object.keys(flattenReviewData).map((index, key) => {
                                    const flatten = flattenReviewData[index];
                                    amount = amount + parseFloat(flatten);
                                    return (
                                        flatten ?
                                        <div className="row" key={key}>
                                            <div className="col-sm-6">
                                                <label>{flatten ? index : null}</label>
                                            </div>
                                            <div className="col-sm-3 text-center">
                                                <label>{flatten > 0 ? flatten : null}</label>
                                            </div>
                                            <div className="col-sm-3 text-center">
                                                <label>{flatten < 0 ? flatten*(-1) : null}</label>
                                            </div>
                                        </div>
                                        : null
                                    )
                                })
                            }
                            <hr />
                            <div className="row amount">
                                <div className="col-sm-6">
                                    Amount To Collect
                                </div>
                                <div className="col-sm-6">
                                    {amount}
                                </div>
                            </div>
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
                                <button className="btn btn-warning"> Go Back </button>
                            &nbsp;
                                <button className="btn btn-success" onClick={(e) => 
                                {e.preventDefault(); this.endRide();}
                            }> Confirm Complete Ride </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
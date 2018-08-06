import React, { Component } from 'react';

import './endRide.component.css';


export default class EndRide extends Component {

    render() {

        return (
            <div className="modal-header">
                <h4 className="modal-title">
                    <b>Complete Ride</b>
                </h4>
            </div>
            //     <form name="rideEnd">
            //         <div className="modal-body">
            //             <div className="row">
            //                 <div className="col-xs-12">
            //                     <div className="panel panel-info">
            //                         <div className="panel-body">
            //                             <div className="col-xs-12 no-padding">
            //                                 <div className="col-xs-6 seperate-line">
            //                                     <div className="col-xs-12">
            //                                         <div className="form-group">
            //                                             <label className="control-label">Booking PNR</label>
            //                                             <input className="form-control" ng-model="endRide.pnr" disabled="true" />
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12">
            //                                         <div className="row">
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="control-label">Actual Start Time</label>
            //                                                     <div className="">
            //                                                         <input className="form-control" ng-model="endRide.actual_start_time" disabled />
            //                                                     </div>
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label uib-className="control-label val-span">End Time &nbsp;
            //                                                                 <a uib-tooltip="Set Current Time"
            //                                                             ng-click="endRide.setTime.setCurrentTime()"><i
            //                                                                 className="fa fa-clock-o"></i></a>&nbsp;
            //                                                                 <a uib-tooltip="Set Drop Time"
            //                                                             ng-click="endRide.setTime.setDropTime()"><i
            //                                                                 className="fa fa-car"></i></a>
            //                                                     </label>
            //                                                     <daterange-picker single="true" ng-model="endRide.reviewRide.end_time" max-date="endRide.currTime"></daterange-picker>
            //                                                 </div>
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12">
            //                                         <div className="row">
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label uib-className="label-color val-span">Start Odo Reading</label>
            //                                                     <input className="form-control" ng-model="endRide.startOdoReading" disabled />
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">End Odo Reading</label>
            //                                                     <div className="">
            //                                                         <input type="text" validate="required,min-number" min-val="{{endRide.startOdoReading*1+1}}" className="form-control" ng-model="endRide.reviewRide.odo_reading" name="EndOdo" onpaste="return false;" ondrop="return false;" />
            //                                                     </div>
            //                                                 </div>
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12">
            //                                         <div className="row">
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Start Fuel Percentage</label>
            //                                                     <input type="text" className="form-control" ng-model="endRide.startFuelPercent" disabled />
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">End Fuel Percentage</label>
            //                                                     <div className="">
            //                                                         <input type="text" className="form-control" ng-model="endRide.reviewRide.fuel_percentage" validate="number,min-number,max-number" min-val="0" max-val="100" />
            //                                                     </div>
            //                                                 </div>
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12">
            //                                         <div className="row">
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Cleanliness Cost</label>
            //                                                     <input type="text" className="form-control" ng-model="endRide.reviewRide.cleanliness_cost" validate="number" />
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Other Costs</label>
            //                                                     <input type="text" className="form-control" ng-model="endRide.reviewRide.other_cost" validate="number" />
            //                                                 </div>
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12">
            //                                         <div className="row">
            //                                             <div className="col-xs-6" ng-if="endRide.bookingObj.type.value!='Partner Booking'">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Damaged Costs</label>
            //                                                     <input type="text" className="form-control" ng-model="endRide.reviewRide.damage_cost" validate="number" />
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-6" ng-if="endRide.bookingObj.type.value!='Partner Booking'">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Repair Costs</label>
            //                                                     <input type="text" className="form-control" ng-model="endRide.reviewRide.repair_cost" validate="number" />
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-12" ng-if="endRide.bookingObj.type.value=='Partner Booking'">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Repair Costs</label>
            //                                                     <input type="text" className="form-control" ng-model="endRide.reviewRide.repair_cost" validate="number" />
            //                                                 </div>
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12">
            //                                         <div className="form-group">
            //                                             <label className="label-color val-span">Comments</label>
            //                                             <div className="">
            //                                                 <input type="text" className="form-control" ng-model="endRide.reviewRide.comments" validate="required" />
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12" ng-if="endRide.bookingObj.fuel_package!='No-fuel'">
            //                                         <div className="row">
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Refuel Costs
            //                                         </label>
            //                                                     <input type="text" className="form-control" ng-model="endRide.reviewRide.refuel_cost" validate="number" />
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Redeem&nbsp;&nbsp;
            //                                             <a uib-tooltip="Check Wallet Balance"
            //                                                             ng-click="endRide.getWalletBalance()"><i
            //                                                                 className="fa fa-refresh"></i></a>&nbsp;&nbsp;
            //                                             <span ng-if="endRide.walletBalance">Rs. { endRide.walletBalance }</span>
            //                                                     </label>
            //                                                     <div className="">
            //                                                         <input type="text" className="form-control" ng-model="endRide.reviewRide.redeem" validate="number,max-number" max-val="{{endRide.walletBalance}}" />
            //                                                     </div>
            //                                                 </div>
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12" ng-if="endRide.superAdmin">
            //                                         <div className="form-group">
            //                                             <label className="label-color val-span">Extra Refund</label>
            //                                             <input type="text" maxLength="10" className="form-control" ng-model="endRide.reviewRide.refund_amount" validate="number" />
            //                                         </div>
            //                                     </div>
            //                                 </div>
            //                                 <div className="col-xs-6">
            //                                     <div className="col-xs-12">
            //                                         <div className="row">
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">Discount</label>
            //                                                     <input type="text" maxLength="10" className="form-control" ng-model="endRide.reviewRide.discount" validate="number" />
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-6" ng-if="endRide.reviewRide.discount>0">
            //                                                 <div className="form-group border-select-filter">
            //                                                     <label className="control-label val-span"> Discount Reason</label>
            //                                                     <span>
            //                                                         <select-box ng-model="endRide.reviewRide.discount_lookup"
            //                                                             place-holder="Discount Reason"
            //                                                             options="endRide.discountList"
            //                                                             required="true">
            //                                                         </select-box>
            //                                                     </span>
            //                                                 </div>
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12">
            //                                         <div className="row">
            //                                             <div className="col-xs-6">
            //                                                 <div className="form-group">
            //                                                     <label className="label-color val-span">State Permit Cost
            //                                             <image-upload uib-tooltip="Upload Permit" normal-size="true"
            //                                                             upload-url="uploadFile" ng-model="endRide.carImage"
            //                                                             save-to="endRide.reviewRide.permit_image"
            //                                                             ng-if="endRide.reviewRide.permit_refund>0"></image-upload>
            //                                                     </label>
            //                                                     <input type="text" className="form-control" ng-model="endRide.reviewRide.permit_refund" />
            //                                                 </div>
            //                                             </div>
            //                                             <div className="col-xs-6" ng-if="endRide.reviewRide.permit_refund>0">
            //                                                 <div className="form-group border-select-filter">
            //                                                     <label className="control-label val-span"> Permit State</label>
            //                                                     <span>
            //                                                         <select-box ng-model="endRide.reviewRide.permit_state" place-holder="State"
            //                                                             options="endRide.stateList"
            //                                                             required="true">
            //                                                         </select-box>
            //                                                     </span>
            //                                                 </div>
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12" ng-if="endRide.reviewRide.permit_refund>0">
            //                                         <div className="form-group">
            //                                             <label uib-className="control-label val-span">Permit Validity</label>
            //                                             <daterange-picker single="true" hide-time="true" ng-model="endRide.reviewRide.permit_validity" format="YYYY-MM-DD" required="true"></daterange-picker>
            //                                         </div>
            //                                     </div>
            //                                     <div className="col-xs-12" ng-if="endRide.reviewRide.permit_refund>0">
            //                                         <label uib-className="control-label val-span">Permit URL</label>
            //                                         <input className="form-control box" ng-model="endRide.reviewRide.permit_image" disabled />
            //                                     </div>
            //                                     <div className="col-xs-12">
            //                                         <get-addons addon-flag="endRide" booking="endRide.bookingObj"></get-addons>
            //                                     </div>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     <div className="modal-footer ">
            //         <div className="col-md-6 text-left">
            //             <small>
            //                 While picking the vehicle from user end the ride.
            //             </small>
            //         </div>
            //         <div className="col-md-6">
            //             <button ng-click="endRide.closeModal()" className="btn btn-default">Cancel</button>
            //             <button ng-click="endRide.resetForm()" className="btn btn-warning">Reset</button>
            //             <button ng-click="endRide.reviewRideFunc()" className="btn btn-success pull-right" ng-disabled="rideEnd.$invalid">
            //                 Complete Ride
            //             </button>
            //         </div>
            //     </div>
            // </form>
        )
    }
}
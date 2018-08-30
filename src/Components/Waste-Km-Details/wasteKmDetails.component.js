import React, { Component } from 'react';

import { Get, Post } from "common-js-util";
import { TimeDifference } from "./../../Utils/time.utils";

import './wasteKmDetails.component.css';


export default class WasteKmDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        this.getVecleKmManagementData(nextProps.data);
    }


    getVecleKmManagementData = async (obj) =>{
        let url = "vehicleKmManagement/"+obj.id+"?includes=newBooking.rideReturn,oldBooking.rideReturn,reason,newBooking.venuePick,oldBooking.venueDrop";
        const res = await Get({url: url});
        if(res.success){
            let bookingData = res.response;
            let oldBooking = res.response.old_booking;
            let time1 = res.response.old_booking.ride_return.actual_end_time;
            let newBooking = res.response.new_booking;
            let time2 = res.response.new_booking.ride_return.actual_start_time;
            let vehicle_id = res.response.vehicle_id;
            let duration = TimeDifference(time2, time1);
            this.setState({bookingData, oldBooking, newBooking, duration});
            this.getFuelingMaintenanceData(vehicle_id, time1, time2);
        }
    }

    getFuelingMaintenanceData = async (vehicle_id, time1, time2) => {
        let url = "getReportData";
        let postDict = {
            time1: time1,
            time2: time2,
            vehicle_id: vehicle_id,
            query_name: "waste_km_fuelling_record,waste_km_maintenance_record"
        };

        const result = await Post ({url: url, body: postDict});

        if(result.success){
            let fuelDetail = result.response.waste_km_fuelling_record;
            let maintenanceDetail = result.response.waste_km_maintenance_record;
            this.setState ({fuelDetail, maintenanceDetail});
        }
    }


    render() {

        const {fuelDetail, maintenanceDetail, bookingData, oldBooking, newBooking, duration} = this.state;

        return (
            <div>
                <div className="summary">
                    <div className="item">
                        <i class="fa fa-road"></i>{bookingData ? bookingData.waste_km+ 'KMs' : ''}
                    </div>
                    <div className="item">
                        <i class="fa fa-clock-o"></i>{duration}
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-heading">
                        <h3 className="panel-title">Booking Details</h3>
                    </div>
                    <div className="panel-body">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding margin-bottom-8">
                            <div className="portlet light bordered portlet-recent-activity">
                                <div className="portlet-body flip-scroll">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" style={{textAlign:'center'}}>
                                            <span style={{textAlign:'center'}}>
                                                <label>Previous Booking</label>
                                            </span>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" style={{textAlign:'center'}}>
                                            <span style={{textAlign:'center'}}>
                                                <label>New Booking</label>
                                            </span>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" ng-if="oldBooking.ride_return.end_odo_reading!=undefined">
                                            <span className="pull-left">
                                                End Odo Reading
                                            </span>
                                            <span className="pull-right val-span">
                                                {oldBooking ? (parseFloat(oldBooking.ride_return.end_odo_reading)).toFixed(2) : ''}
                                            </span>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" ng-if="newBooking.ride_return.start_odo_reading!=undefined">
                                            <span className="pull-left">
                                                Start Odo Reading
                                            </span>
                                            <span className="pull-right val-span">
                                                {newBooking ? (parseFloat(newBooking.ride_return.start_odo_reading)).toFixed(2) : ''}
                                            </span>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" ng-if="oldBooking.ride_return.actual_end_time!=undefined">
                                            <span className="pull-left">
                                                Actual End Time
                                            </span>
                                            <span className="pull-right val-span">
                                                {oldBooking ? oldBooking.ride_return.actual_end_time : ''}
                                            </span>
                                        </div>
                                        <div className="col-md-6 col-lg-6 col-md-6 col-sm-6 col-xs-12" ng-if="newBooking.ride_return.actual_start_time!=undefined">
                                            <span className="pull-left">
                                                Actual Start Time
                                            </span>
                                            <span className="pull-right val-span">
                                                {newBooking ? newBooking.ride_return.actual_start_time : ''}
                                            </span>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" ng-if="oldBooking.venue_drop.name!=undefined">
                                            <span className="pull-left">
                                                Drop Venue
                                            </span>
                                            <span className="pull-right val-span">
                                                { oldBooking ? oldBooking.venue_drop.name : ''}
                                            </span>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" ng-if="newBooking.venue_pick.name!=undefined">
                                            <span className="pull-left">
                                                Pickup venue
                                            </span>
                                            <span className="pull-right val-span">
                                                { newBooking ? newBooking.venue_pick.name : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-heading">
                        <h3 className="panel-title">Fueling Details</h3>
                    </div>
                    <div className="panel-body">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding margin-bottom-8">
                            <div className="portlet light bordered portlet-recent-activity">
                                <div className="portlet-body flip-scroll">
                                    { fuelDetail && fuelDetail.length ?
                                        (<table className="table table-bordered table-striped table-condensed flip-content" ng-if="fuelDetail.length">
                                            <thead className="flip-content">
                                                <tr>
                                                    <th sort by="fueling_time" order="predicate" reverse="reverse">
                                                        Time
                                                    </th>
                                                    <th sort by="amount" order="predicate" reverse="reverse">
                                                        Amount
                                                    </th>
                                                    <th sort by="litres" order="predicate" reverse="reverse">
                                                        Quantity
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            
                                                { 
                                                    fuelDetail.map((n,key) => 
                                                            (<tr>
                                                                <td className="responsive-height">
                                                                    {n.fueling_time}
                                                                </td>
                                                                <td className="responsive-height ">
                                                                    {n.amount}
                                                                </td>
                                                                <td className="responsive-height">
                                                                    {n.litres}
                                                                </td>
                                                            </tr>)
                                                    )
                                                }
                                            </tbody>
                                        </table>) :
                                       ( <div style={{textAlign: 'center'}}>
                                            <p>
                                                No record to show.
                                            </p>
                                        </div>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-heading">
                        <h3 className="panel-title">Maintenance Details</h3>
                    </div>
                    <div className="panel-body">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding margin-bottom-8">
                            <div className="portlet light bordered portlet-recent-activity">
                                <div className="portlet-body flip-scroll">
                                    {
                                        maintenanceDetail && maintenanceDetail.length ?
                                            (<table className="table table-bordered table-striped table-condensed flip-content" ng-if="maintenanceDetail.length">
                                                <thead className="flip-content">
                                                    <tr>
                                                        <th>
                                                            Start Time
                                                        </th>
                                                        <th>
                                                            End Time
                                                        </th>
                                                        <th>
                                                            Comments
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        maintenanceDetail.map((b,key) => {
                                                            return
                                                                (<tr>
                                                                    <td className="responsive-height">
                                                                        {b.start_time}
                                                                    </td>
                                                                    <td className="responsive-height ">
                                                                        {b.end_time}
                                                                    </td>
                                                                    <td className="responsive-height">
                                                                        {b.comments}
                                                                    </td>
                                                                </tr>)
                                                        })
                                                    }
                                                </tbody>
                                            </table>):
                                            ( <div style={{textAlign: 'center'}}>
                                                <p>
                                                    No record to show.
                                                </p>
                                            </div>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}
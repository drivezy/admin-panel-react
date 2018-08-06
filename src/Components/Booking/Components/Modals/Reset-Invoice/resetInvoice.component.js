import React, { Component } from "react";
import UserCard from "./../../../../User-Card/userCard.component";
import "./resetInvoice.component.css";

import { ArrayToObject, Get, Post, SelectFromOptions } from 'common-js-util';

import SelectBox from "./../../../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component";

import DatePicker from "./../../../../../Components/Forms/Components/Time-Picker/timePicker.js";

const lateByCustomerObj = [{ id: 0, name: 'Customer' }, { id: 1, name: 'Fleet' }];

export default class ResetInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingDetail: this.props.data,
      addon: [],
      start_addons: [],
      resetInvoice: {},
      disable: true,
      endRideData: this.props.data,
      permitObj: {country: [],state: []},
    };
  }

  componentDidMount(){
    this.getCountry();
  }
getCountry = async () => {
   const result = await Get({url: 'country'});
    this.setState({country : result.response});
    this.getState();
}
getState = async () => {
    const result = await Get({url: 'state'});
    this.setState({states : result.response});
 }


  submit = () => {
    let postDict = {
    //   odo_reading: this.state.resetInvoice.start_odo_reading,
    //   end_odo_reading: this.state.resetInvoice.end_odo_reading,
    //   other_cost: this.state.resetInvoice.other_cost,
    //   cleanliness_cost: this.state.resetInvoice.cleanliness_charge,
    //   discount: this.state.resetInvoice.discount,
    //   refund_amount: this.state.resetInvoice.refund_amount,
    //   fuel_percentage: this.state.resetInvoice.start_fuel_percentage,
    //   start_time: this.state.resetInvoice.actual_start_time,
    //   end_time: this.state.resetInvoice.actual_end_time,
    //   refuel_cost: this.state.resetInvoice.refuelling_cost,
    //   damage_cost: this.state.resetInvoice.damage_cost,
    //   repair_cost: this.state.resetInvoice.repairing_cost,
    //   end_fuel_percentage: this.state.resetInvoice.end_fuel_percentage,
    //   mobile_number: this.state.resetInvoice.ride_return.mobile_number,
    //   comments: this.state.resetInvoice.ride_return.comments,
    //   permit_refund: this.state.resetInvoice.permit_reimbursement
    //     ? this.state.resetInvoice.permit_reimbursement
    //     : null,
    //   permit_state: this.state.permitObj.state.selected.id
    //     ? this.state.permitObj.state.selected.id
    //     : null,
    //   permit_image:
    //     this.state.resetInvoice.permits.length != 0
    //       ? this.state.resetInvoice.permits[0].image
    //       : null,
    //   permit_validity:
    //     this.state.resetInvoice.permits.length != 0
    //       ? this.state.resetInvoice.permits[0].validity
    //       : null,
    //   redeem: this.state.resetInvoice.redeem,
    //   addons: this.state.addon,
    //   start_addons: this.state.start_addon
    };
  };

  render() {
    const { bookingDetail } = this.state;

    return (
      <div className="reset-invoice">
       <fieldset disabled={this.state.disable}>
        <div className="left-pane">
        <form name="resetInvoice" className="reset-form" disabled={this.state.disable} >
          <div className="details">
            <div className="text-field">
              Start Odo <i className="fa fa-car" aria-hidden="true" />{" "}
            </div>
            <input
              value={this.state.endRideData.ride_return.start_odo_reading}
              type="text"
              className="form-control"
              placeholder="Start Odo"
              onChange = {(e) => {this.state.endRideData.ride_return.start_odo_reading = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
              {" "}
              End Odo <i className="fa fa-car" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.end_odo_reading}
              type="text"
              className="form-control"
              placeholder="End Odo"
              onChange = {(e) => {this.state.endRideData.ride_return.end_odo_reading = e.target.value; this.setState({endRideData})} }
            />
          </div>

          <div className="details">
            <div className="text-field">
            Start Time
              <i className="fa fa-clock-o" aria-hidden="true" />
            </div>
            {/* <DatePicker
              disabled={false}
              single={false}
              placeholder={`Enter star time`}
              timePicker={false}
              name={"start time"}
              onChange={(e)=> {this.state.endRideData.ride_return.actual_start_time = e.target.value; this.setState({endRideData})}}
              value={this.state.endRideData.ride_return.actual_start_time}
            /> */}
            <input
              value={this.state.endRideData.ride_return.actual_start_time}
              type="date-time"
              className="form-control"
              placeholder="start time"
              onChange = {(e) => {this.state.endRideData.ride_return.actual_start_time = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
            End Time
              <i className="fa fa-clock-o" aria-hidden="true" />
            </div>
            {/* <DatePicker
              disabled={false}
              single={false}
              placeholder={`Enter end time`}
              timePicker={false}
              name={"end time"}
              onChange={(e)=> {this.state.endRideData.ride_return.actual_end_time = e.target.value; this.setState({endRideData})}}
              value={this.state.endRideData.ride_return.actual_end_time}
            /> */}
            <input
              value={this.state.endRideData.ride_return.actual_end_time}
              type="date-time"
              className="form-control"
              placeholder="start time"
              onChange = {(e) => {this.state.endRideData.ride_return.actual_end_time = e.target.value; this.setState({endRideData})} }
            />
          </div>

          <div className="details">
            <div className="text-field">
              Ride is late by{" "}
            </div>
            <SelectBox key='2' isClearable={false} onChange={(value) => {this.setState({lbs: value})}} value={this.state.lbs} field="name" options={lateByCustomerObj} />
          </div>

          <div className="details">
            <div className="text-field">
            Start Fuel Percentage
              <i className="fa fa-money" aria-hidden="true" /> 
            </div>
            <input
              value={this.state.endRideData.ride_return.start_fuel_percentage}
              type="text"
              className="form-control"
              placeholder="Start fuel percentage"
              onChange = {(e) => {this.state.endRideData.ride_return.start_fuel_percentage = e.target.value; this.setState({endRideData})} }
            />
          </div>

          <div className="details">
            <div className="text-field">
            End Fuel Percentage
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.end_fuel_percentage}
              type="text"
              className="form-control"
              placeholder="End fuel percentage"
              onChange = {(e) => {this.state.endRideData.ride_return.end_fuel_percentage = e.target.value; this.setState({endRideData})} }
            />
          </div>

          <div className="details">
            <div className="text-field">
            Other Cost
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.other_cost}
              type="text"
              className="form-control"
              placeholder="Other cost"
              onChange = {(e) => {this.state.endRideData.ride_return.other_cost = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
            Cleanliness Cost
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.cleanliness_charge}
              type="text"
              className="form-control"
              placeholder="Cleanliness charge"
              onChange = {(e) => {this.state.endRideData.ride_return.cleanliness_charge = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
            Discount
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.discount}
              type="text"
              className="form-control"
              placeholder="discount"
              onChange = {(e) => {this.state.endRideData.ride_return.discount = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
              Damage cost
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.damage_cost}
              type="text"
              className="form-control"
              placeholder="damage cost"
              onChange = {(e) => {this.state.endRideData.ride_return.damage_cost = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
            Extra Refund
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.refund_amount}
              type="text"
              className="form-control"
              placeholder="Extra refund"
              onChange = {(e) => {this.state.endRideData.ride_return.refund_amount = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
            Repair Cost
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.repairing_cost}
              type="text"
              className="form-control"
              placeholder="Repair cost"
              onChange = {(e) => {this.state.endRideData.ride_return.repairing_cost = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
            Refuelling Cost
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.refuelling_cost}
              type="text"
              className="form-control"
              placeholder="Refuelling cost"
              onChange = {(e) => {this.state.endRideData.ride_return.refuelling_cost = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
            State Permit Cost
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.permit_reimbursement}
              type="text"
              className="form-control"
              placeholder="State permit cost"
              onChange = {(e) => {this.state.endRideData.ride_return.permit_reimbursement = e.target.value; this.setState({endRideData})} }
            />
          </div>
          <div className="details">
            <div className="text-field">
            Redeem Amount
              <i className="fa fa-money" aria-hidden="true" />
            </div>
            <input
              value={this.state.endRideData.ride_return.damage_cost}
              type="text"
              className="form-control"
              placeholder="Redeem amount"
              onChange = {(e) => {this.state.endRideData.ride_return.damage_cost = e.target.value; this.setState({endRideData})} }
            />
          </div>
          {
            (this.state.endRideData && this.state.endRideData.ride_return) ?
            (<div style={{width: "100%", display: "flex", flexWrap: "wrap"}}>
            <div className="details">
                <div className="text-field">
                Permit Country
                <i className="fa fa-money" aria-hidden="true" />
                </div>
                <SelectBox key='0' isClearable={true} onChange={(value) => {this.state.permitObj.country = value; this.setState(permitObj)}} value={this.state.permitObj.country} field="name" options={this.state.country} />
            </div>
            <div className="details">
                <div className="text-field">
                Permit State
                <i className="fa fa-money" aria-hidden="true" />
                </div>
                <SelectBox key='1' isClearable={true} onChange={(value) => {this.state.permitObj.state = value; this.setState(permitObj)}} value={this.state.permitObj.state} field="name" options={this.state.states} />
            </div>

            <div className="details">
                <div className="text-field">
                Permit Validity
                <i className="fa fa-money" aria-hidden="true" />
                </div>
                <input
                value={this.state.endRideData.ride_return.damage_cost}
                type="text"
                className="form-control"
                placeholder="Cleanliness charge"
                onChange = {(e) => {this.state.endRideData.ride_return.damage_cost = e.target.value; this.setState({endRideData})} }
                />
            </div>

            <div className="details">
                <div className="text-field">
                    Permit Copy{" "}
                <i className="fa fa-money" aria-hidden="true" />
                </div>
                <input
                value={this.state.endRideData.ride_return.damage_cost}
                type="text"
                className="form-control"
                placeholder="Cleanliness charge"
                onChange = {(e) => {this.state.endRideData.ride_return.damage_cost = e.target.value; this.setState({endRideData})} }
                />
            </div>
            <div className="details">
                <div className="text-field">
                Permit Copy Url
                <i className="fa fa-money" aria-hidden="true" />
                </div>
                <input
                value={this.state.resetInvoice.startOdoReading}
                type="text"
                className="form-control"
                placeholder="Start Time"
                />
            </div>
            </div>) : null
             
          }
          </form>
        </div>
        <div className="right-pane">
          <div>
            
          </div>
        </div>
        </fieldset >
        <div className="modal-footer">
          <div className="col-md-6 text-left">
            <small>Reset invoice for completed rides.</small>
          </div>
          <div className="col-md-6" style={{textAlign: 'right'}}>
          
            <button onClick={()=> this.setState({disable: false})} className="btn btn-info" style={{ margin: '8px' }}>
              Edit
            </button>
            <button onClick={()=> this.edit()}  className="btn btn-success" style={{ margin: '8px' }}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

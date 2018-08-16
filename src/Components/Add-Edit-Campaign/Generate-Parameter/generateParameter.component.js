import React, { Component } from "react";
import "./generateParameter.component.css";
import { withFormik } from "formik";

// import { ArrayToObject, Get, Post, SelectFromOptions } from 'common-js-util';
import { ModalManager } from "drivezy-web-utils/build/Utils";



import { ArrayToObject, Get, Post, IsUndefinedOrNull, Upload } from "common-js-util";

import SelectBox from "./../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component";


const boolArray = [{ value: '0', label: "No" }, { value: '1', label: "Yes" }];

export default class ResetInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formContent: {}
    };
  }

  cancel = () => {
    ModalManager.closeModal();
  }

  submit = () => {
    ModalManager.closeModal();
  }


  render() {
     const  {formContent} = this.state;
    return (
     <div className="generate-parameter">
        <div className="parameters">
         <div className="details">
           <div className="text-field">
              Fuel Only
           </div>
           <SelectBox
                isClearable={false}
                onChange={value => { formContent.fuel_only = value.value; this.setState({ formContent })}}
                value={this.state.formContent.fuel_only}
                field="label"
                options={boolArray}
            />
         </div>
         <div className="details">
           <div className="text-field">
              Fuelless Only
           </div>
           <SelectBox
                isClearable={false}
                onChange={value => { formContent.fuelless_only = value.value; this.setState({ formContent })}}
                value={this.state.formContent.fuelless_only}
                field="label"
                options={boolArray}
            />
         </div>
         <div className="details">
           <div className="text-field">
              Once
           </div>
           <SelectBox
                isClearable={false}
                onChange={value => { formContent.once = value.value; this.setState({ formContent })}}
                value={this.state.formContent.once}
                field="label"
                options={boolArray}
            />
         </div>
         <div className="details">
           <div className="text-field">
              First Booking
           </div>
           <SelectBox
                isClearable={false}
                onChange={value => { formContent.first_booking = value.value; this.setState({ formContent })}}
                value={this.state.formContent.first_booking}
                field="label"
                options={boolArray}
            />
         </div>
         <div className="details">
           <div className="text-field">
              Off Duration
           </div>
           <input
             value={this.state.formContent.off_duration}
             type="text"
             className="form-control"
             placeholder="Start Odo"
             onChange = {(e) => {formContent.off_duration = e.target.value; this.setState({formContent})} }
           />
         </div>
         <div className="details">
           <div className="text-field">
              Off Percentage
           </div>
           <input
             value={this.state.formContent.off_percentage}
             type="text"
             className="form-control"
             placeholder="Start Odo"
             onChange = {(e) => {formContent.off_percentage = e.target.value; this.setState({formContent})} }
           />
         </div>
         <div className="details">
           <div className="text-field">
              Email
           </div>
           <input
             value={this.state.formContent.email}
             type="text"
             className="form-control"
             placeholder="Start Odo"
             onChange = {(e) => {formContent.email = e.target.value; this.setState({formContent})} }
           />
         </div>
         <div className="details">
           <div className="text-field">
           Min Duration
           </div>
           <input
             value={this.state.formContent.min_duration}
             type="text"
             className="form-control"
             placeholder="Start Odo"
             onChange = {(e) => {formContent.min_duration = e.target.value; this.setState({formContent})} }
           />
         </div>
         <div className="details">
           <div className="text-field">
              Zero Deposit
           </div>
           <SelectBox
                isClearable={false}
                onChange={value => { formContent.zero_deposit = value.value; this.setState({ formContent })}}
                value={this.state.formContent.zero_deposit}
                field="label"
                options={boolArray}
            />
         </div>
        </div>
     
                
       <div className="modal-footer">
         <div className="col-md-6 text-left">
           <small>Create Parameter for generic campaign.</small>
         </div>
         <div className="col-md-6" style={{textAlign: 'right'}}>
         
           <button onClick={()=> this.cancel()} className="btn btn-info" style={{ margin: '8px' }}>
             Cancel
           </button>
           <button onClick={()=> this.submit()}  className="btn btn-success" style={{ margin: '8px' }}>
             Submit
           </button>
          </div>
        </div>
     </div>
    );
  }
}

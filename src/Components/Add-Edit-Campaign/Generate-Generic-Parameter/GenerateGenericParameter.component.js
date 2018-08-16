import React, { Component } from "react";
import "./GenerateGenericParameter.component.css";
import { withFormik } from "formik";
import { ModalManager } from "drivezy-web-utils/build/Utils";
import { ArrayToObject, Get, Post, IsUndefinedOrNull, Upload } from "common-js-util";
import SelectBox from "./../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component";


const boolArray = [{ value: '0', label: "No" }, { value: '1', label: "Yes" }];

export default class GenerateGenericParameter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formContent: {},
      parameters: []
    };
  }

  componentDidMount(){
      this.getParameters();
  }
  
  getParameters = async () =>{
    let url = 'campaignValidation?query=active=1';
    const result = await Get({url:url});
    if(result.success){
        this.setState({parameters: result});
    }
  }

  cancel = () => {
    ModalManager.closeModal();
  }

  submit = () => {
    ModalManager.closeModal();
  }


  render() {
     const  {formContent, parameters} = this.state;
    return (
     <div className="generate-parameter">
        <div className="parameters">


            <table className="table table-hover flip-content table-striped table-bordered">
                            <thead className="flip-content roboto-medium font-12">
                                <tr>
                                    <th className="responsive-height text-center">
                                        Enable
                                    </th>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Operators
                                    </th>
                                    <th>
                                        Values
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="roboto-regular font-12">
                                { parameters.map((parameter,key) => {
                                    <tr>
                                        <td className="responsive-height text-center">
                                            <input type="checkbox" className="btn btn-default btn-sm" ng-click="b.disableFlag = !b.disableFlag" />
                                        </td>
                                        <td>
                                            {parameter.name}
                                        </td>
                                        <td>
                                            {/* <custom-select-field ng-if="b.operatorArray" disable-flag="b.disableFlag" ng-model="b.operator" place-holder="Operators"
                                                obj="b.operatorArray">
                                            </custom-select-field>
                                            <custom-select-field ng-if="!b.operatorArray" disable-flag="b.disableFlag" ng-model="b.operator" place-holder="Operators"
                                                obj="b.operatorArr">
                                            </custom-select-field> */}

                                        </td>
                                        <td>
                                            {/* <custom-select-field ng-if="b.valuesArray && b.operator.selected=='equals'" disable-flag="b.disableFlag" ng-model="b.value" place-holder="Values" obj="b.valuesArray">
                                            </custom-select-field>
                                            <am-select direct-array="true" control="generateGeneric.amSelectControl" ng-if="b.valuesArray && b.operator.selected=='in'" content="b.valuesArray"
                                                placeholder="Values" selected="b.selectedAggregations"></am-select> */}
                                            <input type="text" ng-if="!b.valuesArray" ng-disabled="b.disableFlag" className="form-control" ng-model="b.value" placeholder="Values" />
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>


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

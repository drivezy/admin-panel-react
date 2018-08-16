import React, { Component } from "react";
import UserCard from "./../../../../User-Card/userCard.component";
import "./resetInvoice.component.css";
import { withFormik } from "formik";

import { ModalManager } from "drivezy-web-utils/build/Utils";

import { TotalDuration } from './../../../../../Utils/booking.utils';

import CustomTooltip from "../../../../Custom-Tooltip/customTooltip.component";

import AddonUpdate from "./../../../../Addon-Update/addonUpdate.component";

import { ArrayToObject, Get, Post, IsUndefinedOrNull, Upload } from "common-js-util";
import ImageUpload from "./../../../../../Components/Forms/Components/Image-Upload/imageUpload.component";

import SelectBox from "./../../../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component";

import DatePicker from "./../../../../../Components/Forms/Components/Date-Picker/datePicker";

const lateByCustomerObj = [
  { id: 0, name: "Customer" },
  { id: 1, name: "Fleet" }
];

export default class ResetInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingDetail: JSON.parse(JSON.stringify(this.props.data)),
      addon: [],
      start_addon: [],
      resetInvoice: {},
      disable: true,
      endRideData: { ...this.props.data },
      permitObj: { country: null, state: null },
      countries: [],
      states: [],
      permits: this.props.data && this.props.data.ride_return.permits ? this.props.data.ride_return.permits : [{}],
      walletBalance: 0,
      permitImageurl: ''
    };
    this.uploadImage.bind(this);
  }

  componentDidMount() {
    this.getCountry();
  }
  getCountry = async () => {
    const result = await Get({ url: "country" });
    this.setState({ countries: result.response });
    this.getState();
  };
  getState = async () => {
    const result = await Get({ url: "state" });
    this.setState({ states: result.response });
  };

  getWalletBalance = async () => {
    const result = await Get({
      url: "user/" + this.state.endRideData.created_user.id,
      body: {
        includes: "wallet.payment_request.booking,wallet.payment_refund.booking"
      }
    });
    if (result.success) {
      let wallet = result.response.wallet;
      let walletBalance = 0;
      for (var i in wallet) {
        walletBalance += parseInt(wallet[i].amount);
      }
      this.setState({ walletBalance });
    }
  };

  uploadImage = async(entry) =>{
    this.state.permits = [{}];
    this.state.permits[0].file = entry
    const result = await Upload('uploadFile', entry);
    if(result.success){
        this.state.permits[0].image = result.response;
        let permitImageurl = result.response;
        this.setState({permitImageurl});
    }
  }

  // getTimeDiffernce(start_time, end_time){
  //     let ms = moment(endTime).diff(moment(startTime));
  //     let d = moment.duration(ms);
  //     let s = d.asMinutes();
  //     return s;
  // }

  submit = async () => {
    for (var i in this.state.endRideData.startRideAddon) {
      this.state.start_addon.push({
        id: this.state.endRideData.startRideAddon[i].id,
        quantity: this.state.endRideData.startRideAddon[i].count
      });
    }
    for (var j in this.state.endRideData.endRideAddon) {
      this.state.addon.push({
        id: this.state.endRideData.endRideAddon[j].id,
        quantity: this.state.endRideData.endRideAddon[j].count
      });
    }
    var url = "resetRide/" + this.state.endRideData.id;
    var postDict = {
      odo_reading: this.state.endRideData.ride_return.start_odo_reading,
      end_odo_reading: this.state.endRideData.ride_return.end_odo_reading,
      other_cost: this.state.endRideData.ride_return.other_cost,
      cleanliness_cost: this.state.endRideData.ride_return.cleanliness_charge,
      discount: this.state.endRideData.ride_return.discount,
      refund_amount: this.state.endRideData.ride_return.refund_amount,
      fuel_percentage: this.state.endRideData.ride_return.start_fuel_percentage,
      start_time: this.state.endRideData.ride_return.actual_start_time,
      end_time: this.state.endRideData.ride_return.actual_end_time,
      refuel_cost: this.state.endRideData.ride_return.refuelling_cost,
      damage_cost: this.state.endRideData.ride_return.damage_cost,
      repair_cost: this.state.endRideData.ride_return.repairing_cost,
      end_fuel_percentage: this.state.endRideData.ride_return.end_fuel_percentage,
      mobile_number: this.state.endRideData.ride_return.mobile_number,
      comments: this.state.endRideData.ride_return.comments,
      permit_refund: IsUndefinedOrNull(
        this.state.endRideData.ride_return.permit_reimbursement
      )
        ? null
        : this.state.endRideData.ride_return.permit_reimbursement,
      permit_state: IsUndefinedOrNull(this.state.permitObj.state)
        ? null
        : this.state.permitObj.state.id,
      permit_image:
        this.state.permits.length != 0
          ? this.state.permits[0].image
          : null,
      permit_validity:
        this.state.permits.length != 0
          ? this.state.permits[0].validity
          : null,
      redeem: this.state.endRideData.ride_return.redeem,
      addons: this.state.endRideData.addon,
      start_addons: this.state.endRideData.start_addon
    };
    postDict.late_by_customer = IsUndefinedOrNull(this.state.lBC)
      ? undefined
      : !this.state.lBC.id;
    if (!IsUndefinedOrNull(this.state.endRideData.ride_return.late_reason)) {
      postDict.late_reason = this.state.endRideData.ride_return.late_reason;
    }

    console.log(postDict);

    // const result = await Post({ url: url, body: postDict });
    // ModalManager.closeModal();
  };

  render() {
    const {bookingDetail,endRideData,permitObj,countries,states,permits} = this.state;

    let Duration = TotalDuration(endRideData.ride_return.actual_end_time, endRideData.ride_return.actual_start_time)

    return (
      this.state.endRideData &&
      bookingDetail.ride_return && (
        <div className="reset-invoice">
          <fieldset
            disabled={this.state.disable}
            style={{ width: "100%", display: "flex", flexWrap: "wrap" }}
          >
            <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
              <div className="left-pane">
                <form
                  name="resetInvoice"
                  className="reset-form"
                  disabled={this.state.disable}
                >
                  <div className="details">
                    <div className="text-field">
                      Start Odo{bookingDetail.ride_return.start_odo_reading}
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-car" onClick={() => {
                            this.state.endRideData.ride_return.start_odo_reading =
                              bookingDetail.ride_return.start_odo_reading;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset start odo"
                      />
                    </div>
                    <input
                      value={
                        this.state.endRideData.ride_return.start_odo_reading
                      }
                      type="text"
                      className="form-control"
                      placeholder="Start Odo"
                      onChange={e => {
                        this.state.endRideData.ride_return.start_odo_reading =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                  <div className="details">
                    <div className="text-field">
                      End Odo
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-car" onClick={() => {
                            this.state.endRideData.ride_return.end_odo_reading =
                              bookingDetail.ride_return.end_odo_reading;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset end odo"
                      />
                    </div>
                    <input
                      value={this.state.endRideData.ride_return.end_odo_reading}
                      type="text"
                      className="form-control"
                      placeholder="End Odo"
                      onChange={e => {
                        this.state.endRideData.ride_return.end_odo_reading =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>

                  <div className="details">
                    <div className="text-field" >
                      Start Time
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-clock" onClick={() => {
                            this.state.endRideData.ride_return.actual_start_time =
                              bookingDetail.ride_return.actual_start_time;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset start time"
                      />
                    </div>
                    <DatePicker single={true} format="YYYY-MM-DD HH:mm:00" timePicker={true} placeholder={`Enter start time`} value={this.state.endRideData.ride_return.actual_start_time} />

                  </div>
                  <div className="details">
                    <div className="text-field">
                      End Time
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-clock" onClick={() => {
                            this.state.endRideData.ride_return.actual_end_time =
                              bookingDetail.ride_return.actual_end_time;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset end time"
                      />
                    </div>
                    <DatePicker single={true} format="YYYY-MM-DD HH:mm:00" timePicker={true} placeholder={`Enter start time`} value={this.state.endRideData.ride_return.actual_end_time} />
                  </div>

                  {
                  (Duration > "5") ?
                  <div className="details">
                    <div className="text-field">Ride is late by </div>
                    <SelectBox
                      key="2"
                      isClearable={false}
                      onChange={value => {
                        this.setState({ lbs: value });
                      }}
                      value={this.state.lbs}
                      field="name"
                      options={lateByCustomerObj}
                    />
                  </div>
                  : null
                  }

                  <div className="details">
                    <div className="text-field">
                      Start Fuel Percentage
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.start_fuel_percentage =
                              bookingDetail.ride_return.start_fuel_percentage;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset Start Fuel Percentage"
                      />
                    </div>
                    <input
                      value={
                        this.state.endRideData.ride_return.start_fuel_percentage
                      }
                      type="text"
                      className="form-control"
                      placeholder="Start fuel percentage"
                      onChange={e => {
                        this.state.endRideData.ride_return.start_fuel_percentage =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>

                  <div className="details">
                    <div className="text-field">
                      End Fuel Percentage
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.end_fuel_percentage =
                              bookingDetail.ride_return.end_fuel_percentage;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset end Fuel Percentage"
                      />
                    </div>
                    <input
                      value={
                        this.state.endRideData.ride_return.end_fuel_percentage
                      }
                      type="text"
                      className="form-control"
                      placeholder="End fuel percentage"
                      onChange={e => {
                        this.state.endRideData.ride_return.end_fuel_percentage =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>

                  <div className="details">
                    <div className="text-field">
                      Other Cost
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.other_cost =
                              bookingDetail.ride_return.other_cost;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset other cost"
                      />
                    </div>
                    <input
                      value={this.state.endRideData.ride_return.other_cost}
                      type="text"
                      className="form-control"
                      placeholder="Other cost"
                      onChange={e => {
                        this.state.endRideData.ride_return.other_cost =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                  <div className="details">
                    <div className="text-field">
                      Cleanliness Cost
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.cleanliness_charge =
                              bookingDetail.ride_return.cleanliness_charge;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset Cleanliness Cost"
                      />
                    </div>
                    <input
                      value={
                        this.state.endRideData.ride_return.cleanliness_charge
                      }
                      type="text"
                      className="form-control"
                      placeholder="Cleanliness charge"
                      onChange={e => {
                        this.state.endRideData.ride_return.cleanliness_charge =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                  <div className="details">
                    <div className="text-field">
                      Discount
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.discount =
                              bookingDetail.ride_return.discount;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset discount"
                      />
                    </div>
                    <input
                      value={this.state.endRideData.ride_return.discount}
                      type="text"
                      className="form-control"
                      placeholder="discount"
                      onChange={e => {
                        this.state.endRideData.ride_return.discount =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                  <div className="details">
                    <div className="text-field">
                      Damage cost
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.discount =
                              bookingDetail.ride_return.discount;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset damage cost"
                      />
                    </div>
                    <input
                      value={this.state.endRideData.ride_return.damage_cost}
                      type="text"
                      className="form-control"
                      placeholder="damage cost"
                      onChange={e => {
                        this.state.endRideData.ride_return.damage_cost =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                  <div className="details">
                    <div className="text-field">
                      Extra Refund
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.refund_amount =
                              bookingDetail.ride_return.refund_amount;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset extra refundt"
                      />
                    </div>
                    <input
                      value={this.state.endRideData.ride_return.refund_amount}
                      type="text"
                      className="form-control"
                      placeholder="Extra refund"
                      onChange={e => {
                        this.state.endRideData.ride_return.refund_amount =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                </form>
              </div>
              <div className="right-pane">
                <AddonUpdate rideStatus={0} rideData={this.state.endRideData} />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "70px"
                  }}
                >
                  <div className="details">
                    <div className="text-field">
                      Repair Cost
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.repairing_cost =
                              bookingDetail.ride_return.repairing_cost;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset repair cost"
                      />
                    </div>
                    <input
                      value={this.state.endRideData.ride_return.repairing_cost}
                      type="text"
                      className="form-control"
                      placeholder="Repair cost"
                      onChange={e => {
                        this.state.endRideData.ride_return.repairing_cost =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                  <div className="details">
                    <div className="text-field">
                      Refuelling Cost
                      <CustomTooltip
                        placement="left"
                        html={<i className="fa fa-money" onClick={() => {
                            this.state.endRideData.ride_return.refuelling_cost =
                              bookingDetail.ride_return.refuelling_cost;
                            this.setState({ endRideData });
                          }} aria-hidden="true" />}
                        title="reset refuelling cost"
                      />
                    </div>
                    <input
                      value={this.state.endRideData.ride_return.refuelling_cost}
                      type="text"
                      className="form-control"
                      placeholder="Refuelling cost"
                      onChange={e => {
                        this.state.endRideData.ride_return.refuelling_cost =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                  <div className="details">
                    <div className="text-field">
                      State Permit Cost
                    </div>
                    <input
                      value={
                        this.state.endRideData.ride_return.permit_reimbursement
                      }
                      type="text"
                      className="form-control"
                      placeholder="State permit cost"
                      onChange={e => {
                        this.state.endRideData.ride_return.permit_reimbursement =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                  <div className="details">
                    <div
                      className="text-field"
                      onClick={() => {
                        this.getWalletBalance();
                      }}
                    >
                      Redeem Amount
                      <i className="fa fa-money" aria-hidden="true" onClick={() =>{this.getWalletBalance()}} />
                      ₹{this.state.walletBalance}
                    </div>
                    <input
                      value={this.state.endRideData.ride_return.redeem}
                      type="text"
                      className="form-control"
                      placeholder="Redeem amount"
                      onChange={e => {
                        this.state.endRideData.ride_return.redeem =
                          e.target.value;
                        this.setState({ endRideData });
                      }}
                    />
                  </div>
                </div>
                {this.state.endRideData &&
                this.state.endRideData.ride_return.permit_reimbursement > 0 ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexWrap: "wrap"
                    }}
                  >
                    <div className="details">
                      <div className="text-field">
                        Permit Country
                        <i className="fa fa-money" aria-hidden="true" />
                      </div>
                      <SelectBox
                        isClearable={true}
                        onChange={value => {
                          this.state.permitObj.country = value;
                          this.setState(permitObj);
                        }}
                        value={this.state.permitObj.country}
                        field="name"
                        options={this.state.countries}
                      />
                    </div>
                    <div className="details">
                      <div className="text-field">
                        Permit State
                        <i className="fa fa-money" aria-hidden="true" />
                      </div>
                      <SelectBox
                        isClearable={true}
                        onChange={value => {
                          this.state.permitObj.state = value;
                          this.setState(permitObj);
                        }}
                        value={this.state.permitObj.state}
                        field="name"
                        options={this.state.states}
                      />
                    </div>

                    <div className="details">
                      <div className="text-field">
                        Permit Validity
                        <i className="fa fa-money" aria-hidden="true" />
                      </div>
                      <DatePicker single={true} placeholder={`Enter start time`} format="YYYY-MM-DD" value={this.state.permits[0].validity} />
                    </div>

                    <div className="details">
                      <div className="text-field">
                        Permit Copy{" "}
                        <i className="fa fa-money" aria-hidden="true" />
                      </div>
                      <ImageUpload onRemove={this.state.permits = [{}]}
                            onSelect={(column, name) => {
                                this.uploadImage({image: name})
                            }}
                        />
                    </div>
                    <div className="details">
                      <div className="text-field">
                        Permit Copy Url
                        <i className="fa fa-money" aria-hidden="true" />
                      </div>
                      <input
                        disabled="true"
                        value={this.state.permitImageurl}
                        type="text"
                        className="form-control"
                        placeholder='Enter url'
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </fieldset>
          <div className="modal-footer">
            <div className="col-md-6 text-left">
              <small>Reset invoice for completed rides.</small>
            </div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              <button
                onClick={() => this.setState({ disable: false })}
                className="btn btn-info"
                style={{ margin: "8px" }}
              >
                Edit
              </button>
              <button
                onClick={() => this.submit()}
                className="btn btn-success"
                style={{ margin: "8px" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )
    );
  }
}

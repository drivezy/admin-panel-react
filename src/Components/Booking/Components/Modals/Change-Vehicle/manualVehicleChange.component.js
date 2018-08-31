import React, { Component } from 'react';
import './manualVehicleChange.component.css';

import { API_HOST } from './../../../../../Constants/global.constants';

import SelectBox from './../../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import DatePicker from './../../../../Forms/Components/Date-Picker/datePicker';
import DateTimePicker from './../../../../../../src/Components/Date-Time-Picker/dateTimePicker.component';

import { Get, Post } from 'common-js-util';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';

import {
    Table
} from 'reactstrap';

export default class ChangeVehicle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingData: this.props.bookingData,
            cars: this.props.cars,
            reasons: this.props.reasons,
            car_id: "",
            venue_id: "",
            reason_id: "",
            registration_id: "",
            cityCars: [],
            selected_car: {},
            start_date: '',
            new_fuel: "",
            old_fuel: "",
            reason: "",
            new_odo: "",
            old_odo: "",
            manual: this.props.manual,
            vehicle: this.props.vehicle
        }
    }

    componentDidMount() {
        this.getCityCars();
    }

    /**
     * Method to get cars for particular city id
     */
    getCityCars = async () => {
        const { bookingData } = this.state;
        const result = await Get({
            url: `city/${bookingData.city_id}?includes=car.vehicle`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ cityCars: result.response.car });
        }
    }
    /**
     * Open Confirmation Modal and change vehicle for Booking ID
     */
    confirmChange = () => {
        const { bookingData, car_id, new_fuel, old_fuel, reason, start_date, reason_id, registration_id, new_odo, old_odo } = this.state;
        let between_booking = (bookingData.status.id == 6) ? true : false;
        const method = async () => {
            const result = await Post({
                urlPrefix: API_HOST,
                body: {
                    between_booking,
                    car: car_id ? car_id.toString() : bookingData.car_id.toString(),
                    new_fuel : parseInt(new_fuel),
                    old_fuel : parseInt(old_fuel),
                    reason,
                    reason_code: reason_id,
                    time: start_date,
                    vehicle: registration_id ? registration_id.toString() : bookingData.vehicle_id.toString(),
                    new_odo : parseInt(new_odo),
                    old_odo: parseInt(old_odo)
                },
                url: `changeVehicle/${bookingData.id}`
            });
            if (result.success) {
                ToastNotifications.success({ title: 'Vehicle Changed Successfully' });
                ModalManager.closeModal();
                window.location.reload(true);
            }
            else{
                ConfirmUtils.confirmModal({ message: "System didn't allow requested allocation. Click Yes to change the vehicle forcefully.", callback: forceMethod });
            }
            ModalManager.closeModal();
        }
        const forceMethod = async () => {
            const result = await Post({
                urlPrefix: API_HOST,
                body: {
                    forcefully: 1,
                    between_booking,
                    car: car_id,
                    new_fuel,
                    old_fuel,
                    reason,
                    reason_code: reason_id,
                    time: start_date,
                    vehicle: registration_id,
                    new_odo,
                    old_odo
                },
                url: `changeVehicle/${bookingData.id}`
            });
            if (result.success) {
                ToastNotifications.success({ title: 'Vehicle Changed Successfully' });
                window.location.reload(true);
            }
            else{
                ToastNotifications.error({ title: `${result.response}` });
            }
            ModalManager.closeModal();
        }
        ConfirmUtils.confirmModal({ message: "Are you sure want to Change Vehicle?", callback: method });
    }

    render() {
        const { cityCars, reasons, car_id, bookingData = {}, registration_id, selected_car, manual, vehicle, start_date} = this.state;
        const ride_return = bookingData.ride_return || {};
        return (
            <div className="manual-change-modal">
                <div className="change-wrapper">
                    {
                        manual ?
                            <div className="row">
                                <div className="col-sm-12">
                                    Vehicle Modal
                    </div>
                                <div className="col-sm-12">
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ car_id: value.id, selected_car: value }); }} field="name" options={cityCars} />
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        car_id && manual ?
                            <div className="row">
                                <div className="col-sm-12">
                                    Registration Number
                                </div>
                                <div className="col-sm-12">
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ registration_id: value.id }); }} field="registration_number" options={selected_car.vehicle} />
                                </div>
                                <br />
                            </div>
                            : null
                    }

                    {
                        manual ?
                            null
                            :
                            <div className="row">
                                <div className="col-sm-12">
                                    Registration Number: {vehicle.vehicle.registration_number}
                                </div>
                                <br />
                            </div>
                    }

                    <div className="row">
                        <div className="col-sm-12">
                            Reason Type
                    </div>
                        <div className="col-sm-12">
                            <SelectBox isClearable={false} onChange={(value) => { this.setState({ reason_id: value.id }); }} field="name" options={reasons} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            Billing Car
                    </div>
                        <div className="col-sm-12 car-select">
                            <label className="radio-inline"><input type="radio" name="optradio" checked></input>&nbsp;{bookingData.billing_car.name}</label>
                            {
                                registration_id ?
                                    <label className="radio-inline"><input type="radio" name="optradio"></input>&nbsp;{selected_car.name} </label>
                                    :
                                    null
                            }
                            {
                                manual ?
                                    null
                                    :
                                    <label className="radio-inline"><input type="radio" name="optradio"></input>&nbsp;{vehicle.car.name} </label>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            Time
                    </div>
                        <div className="col-sm-12">
                            {/* <DatePicker single={true} timePicker={true} onChange={(value) => this.setState({ start_date: value }) } /> */}
                            <DatePicker
                                value={start_date}
                                single={true}
                                timePicker={true}
                                onChange={(name, value) => this.setState({ start_date: value })}
                            />
                            {/* <DateTimePicker onChange={(value) => this.setState({ start_date: value })} /> */}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            Additional Reason
                        </div>
                        <div className="input-group col-sm-12">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                            </div>
                            <input type="text" className="form-control" onChange={(e) => { e.preventDefault(); this.setState({ reason: e.target.value }); }} placeholder="REASON" aria-label="Username" aria-describedby="basic-addon1"></input>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            New Vehicle Current Odo
                        </div>
                        <div className="input-group col-sm-12">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                            </div>
                            <input type="number" className="form-control" onChange={(e) => { e.preventDefault(); this.setState({ new_odo: e.target.value }); }} placeholder="" aria-label="Username" aria-describedby="basic-addon1"></input>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            Previous Vehicle Current Odo
                        </div>
                        <div className="input-group col-sm-12">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                            </div>
                            <input type="number" className="form-control" onChange={(e) => { e.preventDefault(); this.setState({ old_odo: e.target.value }); }} placeholder={`Must be Greater than ${ride_return.start_odo_reading}`} aria-label="Username" aria-describedby="basic-addon1"></input>
                            {
                                this.state.old_odo && this.state.old_odo < parseInt(ride_return.start_odo_reading) ?
                                    <div className="error-text">Current Odo cannot be less than {ride_return.start_odo_reading}</div> :
                                    null
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            New Vehicle Fuel %
                        </div>
                        <div className="input-group col-sm-12">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                            </div>
                            <input type="number" className="form-control" onChange={(e) => { e.preventDefault(); this.setState({ new_fuel: e.target.value }); }} placeholder="" aria-label="Username" aria-describedby="basic-addon1"></input>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            Previous Vehicle Fuel %
                        </div>
                        <div className="input-group col-sm-12">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                            </div>
                            <input type="number" className="form-control" onChange={(e) => { e.preventDefault(); this.setState({ old_fuel: e.target.value }); }} placeholder="" aria-label="Username" aria-describedby="basic-addon1"></input>
                        </div>
                    </div>

                </div>

                <div className="modalfooter">
                    <div className="row">
                        <div className="col-sm-6">
                            Change vehicle in active ride.
                            </div>
                        <div className="col-sm-6 btns">
                            <button className="btn btn-default" onClick={(e) => { e.preventDefault(); ModalManager.closeModal(); }
                            }> Cancel </button>
                            &nbsp;
                            <button type="submit" className="btn btn-success" onClick={(e) => { e.preventDefault(); this.confirmChange(); }
                            }> Submit </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
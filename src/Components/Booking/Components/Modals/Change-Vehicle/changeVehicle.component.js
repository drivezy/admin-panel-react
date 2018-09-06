import React, { Component } from 'react';
import './changeVehicle.component.css';

import { API_HOST } from './../../../../../Constants/global.constants';
import SelectBox from './../../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ManualVehicleChange from './manualVehicleChange.component';

import { Get, Post } from 'common-js-util';
import { ModalManager } from 'drivezy-web-utils/build/Utils';

import {
    Table
} from 'reactstrap';

export default class ChangeVehicle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingData: this.props.data,
            cars: [],
            venues: [],
            car_id: "",
            venue_id: "",
            vehicleList: []
        }
    }

    componentDidMount() {
        this.getCars(1000);
        this.getVenues();
        this.getInitialVehicles();
    }

    /**
     * To get cars for particular city_id
     * @param  {number} limit
     */
    getCars = async (limit) => {
        const option = {
            id: 0,
            name: "All Vehicles"
        }
        const { bookingData } = this.state;
        const result = await Get({
            url: `car?query=city_id=${bookingData.city_id}&limit=${limit}`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            result.response.unshift(option);
            this.setState({ cars: result.response });
            return result.response;
        }
    }
    /**
     * To get venues for particular city id
     */
    getVenues = async () => {
        const option = {
            id: 0,
            name: "All Venues"
        }
        const { bookingData } = this.state;
        const result = await Get({
            url: `venue?query=city_id=${bookingData.city_id}&limit=1000`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            result.response.unshift(option)
            this.setState({ venues: result.response });
        }
    }

    /**
     * Method to get cars and reasons for vehicle change,
     * Open Vehicle change modal with 'manual' equal to TRUE
     */
    manuallyChange = async () => {
        let carsList = await this.getCars(200);
        const { bookingData } = this.state;
        const result = await Get({
            url: `lookupType/22?includes=values`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            ModalManager.openModal({
                headerText: "CHANGE VEHICLE",
                modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true} callback={this.props.callback}/>)
            })
        }
    }

    /**
     * Method to get reasons for vehicle change,
     * Open Vehicle change modal with 'manual' equal to FALSE
     */
    vehicleChange = async (vehicle) => {
        const { bookingData } = this.state;
        const result = await Get({
            url: `lookupType/22?includes=values`,
            urlPrefix: API_HOST
        });
        ModalManager.openModal({
            headerText: "CHANGE VEHICLE",
            modalBody: () => (<ManualVehicleChange reasons={result.response.values} bookingData={bookingData} manual={false} vehicle={vehicle}/>)
        })
    }

    getInitialVehicles = async () => {
        const { bookingData } = this.state;
        const body = {};
        if (bookingData.car_id) {
            body.car_id = bookingData.car_id;
        }
        if (bookingData.venue_pick.id) {
            body.venue_id = bookingData.venue_pick.id;
        }
        const result = await Post({
            url: `suggestVehicle/${bookingData.id}`,
            body,
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ vehicleList: result.response, car_id : bookingData.car_id, venue_id : bookingData.venue_pick.id})
        }
    }
    /**
     * Function to get Vehicles for Selected CAR and VENUE
     */
    getVehicles = async () => {
        const { car_id, venue_id, bookingData } = this.state;
        const body = {};
        if (car_id) {
            body.car_id = car_id;
        }
        if (venue_id) {
            body.venue_id = venue_id;
        }
        const result = await Post({
            url: `suggestVehicle/${bookingData.id}`,
            body,
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ vehicleList: result.response })
        }
    }


    render() {
        const { cars, venues, vehicleList, bookingData } = this.state;
        return (
            <div className="changeVehicle">
                <div className="modal-change-vehicle">
                    <div className="row manual-change">
                        <i className="fa fa-bookmark"></i>&nbsp;&nbsp;Vehicle List&nbsp;&nbsp;
                        <a onClick={(e) => { e.preventDefault(); this.manuallyChange() }}> Click here to change the vehicle Manually &nbsp;<i className="fa fa-retweet"></i> </a>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="row">
                                <div className="col-sm-12">
                                    Vehicle Model
                                </div>
                                <div className="col-sm-12">
                                    <div className="div-group row">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                        </div>
                                        
                                            <SelectBox 
                                            value={bookingData.billing_car.name}
                                            isClearable={false} onChange={(value) => { this.state.car_id = value.id; this.getVehicles(); }} field="name" options={cars} />
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="row">
                                <div className="col-sm-12">
                                    Venue
                                </div>
                                <div className="col-sm-12">
                                    <div className="div-group row">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                        </div>
                                            <SelectBox 
                                            value={bookingData.venue_pick.name}
                                            isClearable={false} onChange={(value) => { this.state.venue_id = value.id; this.getVehicles(); }} field="name" options={venues} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="vehicle-list">
                    <Table>
                        <thead>
                            <tr className="list-heading table-row">
                                <th>
                                    <label>Car</label>
                                </th>
                                <th>
                                    <label>Vehicle</label>
                                </th>
                                <th>
                                    <label>Venue</label>
                                </th>
                                <th>
                                    <label>Change Vehicle</label>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(vehicleList).map((vehicle, key) => (
                                    <tr key={key}>
                                        <td>
                                            <label>{vehicleList[vehicle].car.name}</label>
                                        </td>
                                        <td>
                                            <label>{vehicleList[vehicle].vehicle.registration_number}</label>
                                        </td>
                                        <td>
                                            <label>{vehicleList[vehicle].vehicle.venue.name}</label>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-default"  onClick={(e) => { e.preventDefault(); this.vehicleChange(vehicleList[vehicle]); }
                                            }><i className="fa fa-retweet"></i> </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}
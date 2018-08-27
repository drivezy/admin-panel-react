import React, { Component } from 'react';
import './goLive.component.css';

import { Get, Post } from 'common-js-util';
import { API_HOST } from './../../../../Constants/global.constants';
import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import { ModalManager } from 'drivezy-web-utils/build/Utils/modal.utils';
import DateTimePicker from './../../../Date-Time-Picker/dateTimePicker.component';

export default class GoLive extends Component {

    constructor(props) {
        super(props);

        this.state = {
            transaction_id: "",
            transaction_amount: "",
            venue_id: "",
            payment_modes: [],
            parent: this.props.parent,
            data: this.props.data,
            selectedCity: {}
        }
    }

    componentWillMount() {
        this.getVenus();
    }

    getVenus = async () => {
        const result = await Get({
            url: "city?includes=venue",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ venues: result.response });
        }
    }

    render() {
        const { venues, parent, data, selectedCity } = this.state;

        return (
            <div className="add-deal-modal">
                <div className="add-deal-modal-body">
                    <div className="fields">
                        <div className="form">
                        <div className="option">
                            <div className="helptext">
                                City
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ selectedCity: value }); }}  className="disabled" field="name" options={venues} />
                                </div>
                        </div>
                        <div className="mode-select option">
                            <div className="helptext">
                                Venue
                            </div>
                            <div className="div-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ venue_id: value.id }); }} field="name" options={selectedCity.venue} />
                                </div>
                            </div>
                        </div>
                        <div className="option">
                            <div className="helptext">
                                Active Date
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                <div className="date-time">
                                    <DateTimePicker />
                                </div>
                                {/* <input type="date" className="input-value" onChange={(e) => { this.setState({ transaction_amount: e.target.value }) }} /> */}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="add-modal-footer">
                    <div className="action-buttons">
                        <button className="btn btn-default btn-sm" onClick={() => {ModalManager.closeModal();}}>Cancel</button>
                        &nbsp;
                        <button onClick={(e) => { e.preventDefault(); this.vehiclePayment(); }} className="btn btn-success">Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}
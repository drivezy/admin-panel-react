import React, { Component } from 'react';

import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';

import { Get, Post } from 'common-js-util';
import { ModalManager } from 'drivezy-web-utils/build/Utils/modal.utils';

import { API_HOST } from './../../../../Constants/global.constants';

import './orderDetails.component.css';

export default class OrderDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chassis_no: "",
            engine_no: "",
            payment_mode: "",
            color:"",
            cars: [],
            parent: this.props.parent
        }
    }

    componentWillMount() {
        this.getCars();
    }

    getCars = async () => {
        const { parent } = this.state;
        const result = await Get({
            url: `car?query=city_id=${parent.id}&active=1&limit=700`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ cars: result.response });
        }
    }


    render() {
        const { cars, color, engine_no, chassis_no } = this.state;
        return (
            <div className="add-deal-modal">
                <div className="add-deal-modal-body">
                    <div className="fields">
                        <div className="form">
                        <div className="car-select option">
                            <div className="helptext">
                                Car
                            </div>
                            <div className="div-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ payment_mode: value.id }); }} field="name" options={cars} />
                                </div>
                            </div>
                        </div>
                        <div className="option">
                            <div className="helptext">
                                Chassis Number
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                <input className="input-value" onChange={(e) => { this.setState({ chassis_no: e.target.value }) }} />
                            </div>
                        </div>
                        
                        <div className="option">
                            <div className="helptext">
                                Engine Number
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                <input className="input-value" onChange={(e) => { this.setState({ engine_no: e.target.value }) }} />
                            </div>
                        </div>

                        <div className="option">
                            <div className="helptext">
                                Car Colour
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                <input className="input-value" onChange={(e) => { this.setState({ color: e.target.value }) }} />
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
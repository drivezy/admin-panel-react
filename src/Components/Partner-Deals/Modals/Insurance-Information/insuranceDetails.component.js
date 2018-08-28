import React, { Component } from 'react';

import { API_HOST } from './../../../../Constants/global.constants';
import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';

import { Get, Post } from 'common-js-util';
import { ModalManager } from 'drivezy-web-utils/build/Utils/modal.utils';

import './insuranceDetails.component.css'

export default class InsuranceInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: "",
            amount: "",
            payment_mode: "",
            vendors: [],
            parent: this.props.parent
        }
    }

    componentWillMount() {
        this.getVendors();
    }

    getVendors = async () => {
        const result = await Get({
            url: "vendor?query=vendor_type=713",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ vendors: result.response });
        }
    }

    vehiclePayment = async() => {
        const { parent, amount, payment_mode } = this.state;
        console.log(parent)
        const result = await Post({
            url: "vehiclePayment",
            body: {
                amount: amount
            },
            urlPrefix: API_HOST
        });
        if (result.success) {
            console.log(result);
        }
    }

    render() {
        const { vendors, amount, id } = this.state;
        return (
            <div className="add-deal-modal">
                <div className="add-deal-modal-body">
                    <div className="fields">
                        <div className="form">
                        <div className="option">
                            <div className="helptext">
                                Amount
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                <input className="input-value" onChange={(e) => { this.setState({ amount: e.target.value }) }} />
                            </div>
                        </div>
                        <div className="mode-select option">
                            <div className="helptext">
                                Insurance Vendor
                            </div>
                            <div className="div-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ payment_mode: value.id }); }} field="name" options={vendors} />
                                </div>
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
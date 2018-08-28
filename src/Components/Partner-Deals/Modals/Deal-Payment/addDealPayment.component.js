import React, { Component } from 'react';

import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';

import { Get, Post } from 'common-js-util';
import { ModalManager } from 'drivezy-web-utils/build/Utils/modal.utils';

import { API_HOST } from './../../../../Constants/global.constants';

import './addDealPayment.component.css';

export default class AddDealPayment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            transaction_id: "",
            transaction_amount: "",
            payment_mode: "",
            payment_modes: [],
            parent: this.props.parent
        }
    }

    componentWillMount() {
        this.getPaymentModes();
    }

    getPaymentModes = async () => {
        const result = await Get({
            url: "lookupValue?query=lookup_type=20&limit=100",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ payment_modes: result.response });
        }
    }

    vehiclePayment = async() => {
        const { parent, transaction_amount, payment_mode, transaction_id } = this.state;
        console.log(parent)
        const result = await Post({
            url: "vehiclePayment",
            body: {
                amount: transaction_amount,
                deal_id: parent.id,
                payment_mode_id: payment_mode,
                payment_mode_type: parent.financing_type_id, //not sure about mode type id
                transaction_id: transaction_id
            },
            urlPrefix: API_HOST
        });
        if (result.success) {
            console.log(result);
        }
    }

    render() {
        const { payment_modes, transaction_amount, transaction_id } = this.state;
        return (
            <div className="add-deal-modal">
                <div className="add-deal-modal-body">
                    <div className="fields">
                        <div className="form">
                        <div className="option">
                            <div className="helptext">
                                Transaction ID
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                <input className="input-value" onChange={(e) => { this.setState({ transaction_id: e.target.value }) }} />
                            </div>
                        </div>
                        <div className="mode-select option">
                            <div className="helptext">
                                Payment Mode
                            </div>
                            <div className="div-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ payment_mode: value.id }); }} field="name" options={payment_modes} />
                                </div>
                            </div>
                        </div>
                        <div className="option">
                            <div className="helptext">
                                Amount
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                <input className="input-value" onChange={(e) => { this.setState({ transaction_amount: e.target.value }) }} />
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
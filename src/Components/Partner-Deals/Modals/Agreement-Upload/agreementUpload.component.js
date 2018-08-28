import React, { Component } from 'react';

import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ImageUpload from './../../../Forms/Components/Image-Upload/imageUpload.component';

import { Get, Post } from 'common-js-util';
import { ModalManager } from 'drivezy-web-utils/build/Utils/modal.utils';

import { API_HOST } from './../../../../Constants/global.constants';

import './agreementUpload.component.css';

export default class AgreementUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            agreement: "",
            business: "",
            agreement_type: [],
            business_status: [],
            parent: this.props.parent,
            files: []
        }
    }

    componentWillMount() {
        this.getAgreementType();
    }

    getAgreementType = async () => {
        const result = await Get({
            url: "lookupValue?query=lookup_type=117&limit=100",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ agreement_type: result.response });
        }
        this.getBusinessStatus();
    }

    getBusinessStatus = async () => {
        const result = await Get({
            url: "lookupValue?query=lookup_type=118&limit=100",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ business_status: result.response });
        }
    }

    // vehiclePayment = async() => {
    //     const { parent, transaction_amount, payment_mode, transaction_id } = this.state;
    //     // console.log(parent)
    //     const result = await Post({
    //         url: "vehiclePayment",
    //         body: {
    //             amount: transaction_amount,
    //             deal_id: parent.id,
    //             payment_mode_id: payment_mode,
    //             payment_mode_type: parent.financing_type_id, //not sure about mode type id
    //             transaction_id: transaction_id
    //         },
    //         urlPrefix: API_HOST
    //     });
    //     if (result.success) {
    //         console.log(result);
    //     }
    // }

    render() {
        const { agreement_type, business_status, files } = this.state;
        return (
            <div className="add-deal-modal">
                <div className="add-deal-modal-body">
                    <div className="fields">
                        <div className="form">
                        <div className="mode-select option">
                            <div className="helptext">
                                Agreement Type
                            </div>
                            <div className="div-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i class="fa fa-angle-down"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ agreement: value.id }); }} field="name" options={agreement_type} />
                                </div>
                            </div>
                        </div>
                        <div className="mode-select option">
                            <div className="helptext">
                                Partner Business Status
                            </div>
                            <div className="div-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i class="fa fa-angle-down"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ business: value.id }); }} field="name" options={business_status} />
                                </div>
                            </div>
                        </div>
                        <div className="option">
                            <div className="helptext">
                                Upload
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                </div>
                                <ImageUpload onRemove={files.onFileRemove}
                                        onSelect={() => {
                                            alert('File Selected')
                                        }}
                                        />
                                {/* <input className="input-value" onChange={(e) => { this.setState({ transaction_amount: e.target.value }) }} /> */}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="add-modal-footer">
                    <div className="action-buttons">
                        <button className="btn btn-default btn-sm" onClick={() => {ModalManager.closeModal();}}>Cancel</button>
                        &nbsp;
                        <button onClick={(e) => { e.preventDefault(); }} className="btn btn-success">Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}
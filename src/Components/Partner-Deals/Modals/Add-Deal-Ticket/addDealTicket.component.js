import React, { Component } from 'react';

import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';

import { Get, Post } from 'common-js-util';

import { API_HOST } from './../../../../Constants/global.constants';

import './addDealTicket.component.css';

let total=0;

export default class AddDealTicket extends Component {

    constructor(props) {
        super(props);

        console.log(props)

        this.state = {
            modal: false,
            financingOptions: [],
            vendors: [],
            vendor_id: "",
            dealDetail_id: "",
            dealDetailsCosts: [],
            data: this.props.data,
            callback: this.props.callback,
            parent: this.props.parent,
            selectedValues: {},
            amountTotal: 0
        }
    }

    componentDidMount() {
        this.getFinancingOptions();
    }

    /**
     * For Getting Financing Options in Select Box
     */
    getFinancingOptions = async () => {
        const result = await Get({
            url: "lookupValue?query=lookup_type=93&limit=100",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ financingOptions: result.response });
        }
        this.getVendors();
    }
    /**
     * For Getting Cars Options in Select Box
     * Passing city_id from data of the detail page
     */
    getVendors = async () => {
        const { parent } = this.state;
        const result = await Get({
            url: 'vendor?query=vendor_type=713&limit=1000',
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ vendors: result.response });
        }
        this.getDealDetails();
    }

    getDealDetails = async () => {
        const { parent } = this.state;
        const result = await Get({
            url: `getDealDetails/${parent.id}`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ dealDetail_id: result.response.financing_type_id, dealDetailsCosts: result.response.cost_object});
        }
        this.matchId();
    }

    matchId = () => {
        const { financingOptions, dealDetail_id } = this.state;
        const result = financingOptions.filter((entry) => (entry.id) == (dealDetail_id));
        this.setState({ financingOptions: JSON.parse(result[0].value) });
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    setAmount = (active, fieldName) => {
        const { dealDetailsCosts } = this.state;
        dealDetailsCosts[fieldName] ? total += dealDetailsCosts[fieldName] : null;
        this.setState({ amountTotal: total});
    }

    render() {
        const { vendors, financingOptions, selectedValues, amountTotal } = this.state;

        return (
            <div className="partner-deal">
                <div className="partner-deal-body">
                    <div className="selects row">
                        <div className="car-select col-sm-6">
                            <div className="helptext">
                                Procurement Vendor
                            </div>
                            <div className="div-group row">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ vendor_id: value.id }); }} field="name" options={vendors} />
                                </div>
                            </div>
                        </div>
                        <div className="amount col-sm-6">
                            <div className="div-group row">
                                <div className="helptext">
                                    Total Amount
                                </div>
                                <div className="input-group">
                                    {amountTotal}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="input-options">
                        <div className="row options">
                            {
                                Object.keys(financingOptions).map((field, key) => (
                                    financingOptions[field].dealership_flag ?
                                        <div className="activeInput inputField col-sm-4" key={key}>
                                            <div className="pretty p-default p-thick p-pulse p-bigger">
                                                <input type="checkbox"
                                                    onChange={e => this.setAmount(e.target.value == '1' ? 1 : 0, field)}
                                                />
                                                <div className="state p-success-o">
                                                    <label>&nbsp;</label>
                                                </div>
                                            </div>
                                            <label className="helptext">{field.replace(/_/g, " ")}</label>
                                        </div>
                                    : null
                                ))
                            }
                        </div>
                    </div>

                </div>
                <div className="partner-deal-add-footer">
                    {/* <div className="bank-detail-button">
                        <button className="btn btn-success">Send Bank Detail</button>
                    </div> */}
                    <div className="action-buttons">
                        <button className="btn btn-default">Cancel</button>
                        &nbsp;
                        <button onClick={(e) => { e.preventDefault(); console.log(this.state) }} className="btn btn-success">Submit</button>
                    </div>
                </div>
            </div>

        );
    }
}
import React, { Component } from 'react';
import './partnerDealAdd.component.css';

import { Get, Post } from 'common-js-util';
import { API_HOST } from './../../../../Constants/global.constants';
import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import { ModalManager } from 'drivezy-web-utils/build/Utils/modal.utils';

export default class DealAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            financingOptions: [],
            carsOptions: [],
            car_id: "",
            finance_type: {},
            data: this.props.data,
            callback: this.props.callback,
            parent: this.props.parent,
            selectedValues: {}
        }
    }

    componentDidMount() {
        this.getFinancingOptions();
        this.getCars();
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
    }
    /**
     * For Getting Cars Options in Select Box
     * Passing city_id from data of the detail page
     */
    getCars = async () => {
        const { parent } = this.state;
        const result = await Get({
            url: `car?query=city_id=${parent.id}&active=1&limit=200`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ carsOptions: result.response });
        }
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    render() {
        const { data, callback, carsOptions, financingOptions, finance_type, car_id, selectedValues } = this.state;

        return (
            <div className="partner-deal">
                <div className="partner-deal-body">
                    <div className="selects row">
                        <div className="car-select col-sm-6">
                            <div className="helptext">
                                Vehicle
                            </div>
                            <div className="div-group row">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ car_id: value.id }); }} field="name" options={carsOptions} />
                                </div>
                            </div>
                        </div>
                        <div className="finance-select col-sm-6">
                            <div className="div-group row">
                                <div className="helptext">
                                    Financing Option
                                </div>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <SelectBox isClearable={false} onChange={(value) => { this.setState({ finance_type: JSON.parse(value.value) }); }} field="name" options={financingOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="input-options">
                        <div className="row options">
                            {
                                Object.keys(finance_type).map((field, key) => (
                                    <div className="div-group col-sm-4" key={key}>
                                        <div className="helptext">
                                            {field.replace(/_/g, " ")}
                                        </div>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                            </div>
                                            {
                                                finance_type[field].editable ?
                                                    <input className="input-value" onChange={(e) => { selectedValues[field] = e.target.value; this.setState({ selectedValues }) }} placeholder={finance_type[field].default} type={finance_type[field].type} />
                                                    :
                                                    <input className="disabled" placeholder={finance_type[field].default} type={finance_type[field].type} disabled />
                                            }
                                        </div>
                                        <div className="description">
                                            {finance_type[field].description ? finance_type[field].description : <span>&nbsp;</span>}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </div>

                <div className="partner-deal-footer">
                    <div className="bank-detail-button">
                        <button className="btn btn-success">Send Bank Detail</button>
                    </div>
                    <div className="action-buttons">
                        <button className="btn btn-default btn-sm" onClick={() => {ModalManager.closeModal();}}>Cancel</button>
                        &nbsp;
                        <button onClick={(e) => { e.preventDefault(); console.log(this.state) }} className="btn btn-success">Submit</button>
                    </div>
                </div>
            </div>

        );
    }
}
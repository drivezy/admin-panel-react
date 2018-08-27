import React, { Component } from 'react';
import {
    Table
} from 'reactstrap';

import AddDealPayment from './addDealPayment.component';

import { ModalManager } from 'drivezy-web-utils/build/Utils/modal.utils';
import { Get, Post } from 'common-js-util';

import { API_HOST } from './../../../../Constants/global.constants';

import './dealPayment.component.css';

export default class DealPayment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            financingOptions: [],
            vehiclePayments: [],
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
        this.getVehiclePayment();
    }
    /**
     * For Getting Cars Options in Select Box
     * Passing city_id from data of the detail page
     */
    getVehiclePayment = async () => {
        const { parent } = this.state;
        const result = await Get({
            url: `getVehiclePayment/${parent.id}`,
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ vehiclePayments: result.response });
        }
    }

    render() {
        const { parent, vehiclePayments } = this.state;
        console.log(vehiclePayments)
        return (
            <div className="payment-list">
                <div className="payment-list-header">
                    <button className="btn btn-xs btn-danger" onClick={(e) => {
                        ModalManager.openModal({
                            headerText: "ADD DEAL PAYMENT",
                            modalBody: () => (<AddDealPayment parent={parent}/>)
                        })
                    }}><i className="fa fa-1x fa-plus-circle" aria-hidden="true"></i></button>
                </div>
                <div className="payment-list-body">
                    <Table>
                        <thead>
                            <tr className="list-heading table-row">
                                <th>
                                    <label>#</label>
                                </th>
                                <th>
                                    <label>Transaction ID</label>
                                </th>
                                <th>
                                    <label>Amount</label>
                                </th>
                                <th>
                                    <label>Payment Mode</label>
                                </th>
                                <th>
                                    <label>Created At</label>
                                </th>
                                <th>
                                    <label>Updated At</label>
                                </th>
                                <th>
                                    <label>Status</label>
                                </th>
                                <th>
                                    <label><i className="fa fa-cog" aria-hidden="true"></i></label>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(vehiclePayments).map((payment, key) => (
                                    <tr key={key}>
                                        <td>
                                            <label>{key + 1}</label>
                                        </td>
                                        <td>
                                            <label>{vehiclePayments[payment].transaction_id}</label>
                                        </td>
                                        <td>
                                            <label>{vehiclePayments[payment].amount}</label>
                                        </td>
                                        <td>
                                            <label>{vehiclePayments[payment].payment_mode.name}</label>
                                        </td>
                                        <td>
                                            <label>{vehiclePayments[payment].created_at}</label>
                                        </td>
                                        <td>
                                            <label>{vehiclePayments[payment].updated_at}</label>
                                        </td>
                                        <td>
                                            {/* <label>{vehiclePayments[payment].status.name}</label> */}
                                        </td>
                                        <td className="save-btn">
                                            <label><button className="btn btn-sm btn-default"><i class="fa fa-save"></i></button></label>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
                <div className="deal-payment-footer">
                    <button className="btn btn-default btn-sm" onClick={() => {ModalManager.closeModal();}}>Close</button>
                </div>
            </div>
        );
    }
}
import React, { Component } from 'react';

import {
    Table
} from 'reactstrap';

import { Post, Get } from 'common-js-util';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';

export default class ApproveGenericFueling extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            result: {}
        }
    }

    componentDidMount() {
        const { data } = this.state
        this.getMatches()
    }

    getMatches = async () => {
        const { data } = this.state
        const result = await Post({
            url: "getMatchingFuelRecord",
            body: {
                amount: data.amount,
                fueling_time: data.fueling_time,
                source_id: data.source_id
            }
        });

        this.setState({ result })
    }

    transfer = (value) => {
        const { data } = this.state
        const method = async () => {
            let url = "approveFueling/" + data.id + "/" + value.id;
            const result = await Get({
                url: url
            });
            if (result.success) {
                ModalManager.closeModal();
                ToastNotifications.success("Record approved successfully");
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure want to Approve?", callback: method });
    }

    render() {
        const { data, result } = this.state
        return (
            <div>
                {
                    (result.response && result.response.length) ?
                        <div>
                            <Table>
                                <thead>
                                    <tr className="list-heading table-row">
                                        <th>
                                            <label>Account Id</label>
                                        </th>
                                        <th>
                                            <label>Dealer Name</label>
                                        </th>
                                        <th>
                                            <label>Transaction Date</label>
                                        </th>
                                        <th>
                                            <label>Amount</label>
                                        </th>
                                        <th>
                                            <label>Litres</label>
                                        </th>
                                        <th>
                                            <label>Approve</label>
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        result.response.map((value, key) => (
                                            <tr key={key}>
                                                <td>
                                                    <label>{value.account_id}</label>
                                                </td>
                                                <td>
                                                    <label>{value.dealer_name}</label>
                                                </td>
                                                <td>
                                                    <label>{value.transaction_date}</label>
                                                </td>
                                                <td>
                                                    <label>{value.amount}</label>
                                                </td>
                                                <td>
                                                    <label>{value.litres}</label>
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-default" onClick={() => this.transfer(value)}><i className="fa fa-money"></i> </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                        :
                        <span>No Matching Record Found. This record can not be approved.</span>
                }
            </div>
        )
    }
}
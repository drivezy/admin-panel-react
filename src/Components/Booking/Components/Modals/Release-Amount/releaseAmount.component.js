import React, { Component } from 'react';
import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Post, Put } from 'common-js-util';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';
import {
    Table
} from 'reactstrap';
import './releaseAmount.component.css';

export default class ReleaseAmount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    onCancel() {
        ModalManager.closeModal();
    }

    transfer(value) {
        const method = async () => {
            const result = await Put({ url: "paymentRefund/" + value.id, body: { amount: value.amount } });
            if (result.success) {
                ToastNotifications.success({ title: 'Amount Released' });
            }

        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to proceed?", callback: method });
    }


    render() {
        const { data } = this.state;
        let funds = [];
        // funds.push(data.filter((value) => (value.amount > 0)))  // funds = funds to be released. i.e. the positive amounts in the data
        data.refund && data.refund.map((value, key) => {
            (value.amount > 0) && funds.push(value)
        }
        )


        return (
            <div className="modal-release-amount">
                {funds.length > 0 ?
                    <Table>
                        <thead>
                            <tr className="list-heading table-row">
                                <th>
                                    <label>Amount</label>
                                </th>
                                <th>
                                    <label>Source</label>
                                </th>
                                <th className="text-center">
                                    <label><i className="fa fa-cog" aria-hidden="true"></i></label>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                funds.map((value, key) => (
                                    (value.amount > 0) &&
                                    <tr key={key}>
                                        <td>
                                            <label>{value.amount}</label>
                                        </td>
                                        <td>
                                            <label>{value.source}</label>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-default" onClick={() => this.transfer(value)}><i className="fa fa-money"></i> </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    : <div className="data-not-present" >No data to show </div>
                }
            </div>
        )
    }
}

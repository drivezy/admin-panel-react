import React, { Component } from 'react';

import SelectBox from './../../../../Forms/Components/Select-Box/selectBox';

import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Post } from 'common-js-util';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';

import './removeCashIncentive.component.css'

export default class RemoveCashIncentive extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            id: props.data.id,
            selected: {},
            data: props.data,
            temp_pay: {}
        };
    }

    componentDidMount() {
        const { data } = this.state

        let amount = [], id = [], temp_pay = {}
        if (data.booking_payment) {
            Object.keys(data.booking_payment).map((value, key) => {
                amount.push(data.booking_payment[value].amount);
                id.push(data.booking_payment[value].id)
            })
            temp_pay.amount = amount;
            temp_pay.id = id;

            this.setState({ temp_pay })
        }
    }

    transfer() {
        const { selected, temp_pay } = this.state
        let id
        Object.keys(temp_pay["amount"]).map((value) => {
            if (temp_pay["amount"][value] == selected.value) {
                id = temp_pay["id"][value]
            }
        }
        )
        const method = async () => {
            const result = await Post({ url: "removePayment/" + id });
            if (result.success) {
                ToastNotifications.success({ title: 'Success' });
            }

        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to proceed?", callback: method });
    }

    render() {
        const { temp_pay } = this.state
        return (
            <div className="remove-cash-incentives">
                <div >
                    <span className="label-color val-span">Select to remove</span>
                    <SelectBox valueKey="value" field="label" name='active' placeholder={'Select'} onChange={(selected) => this.setState({ selected })} value={this.state.selected.amount} options={temp_pay.amount} />
                </div>
                <div className="col-sm-12 btns">
                    <button className="btn btn-default" onClick={(e) => { e.preventDefault(); ModalManager.closeModal(); }
                    }> Cancel </button>
                    &nbsp;
                    <button type="submit" className="btn btn-success" onClick={(e) => { e.preventDefault(); this.transfer(); }
                    }> Submit </button>
                </div>
            </div>
        )
    }
}




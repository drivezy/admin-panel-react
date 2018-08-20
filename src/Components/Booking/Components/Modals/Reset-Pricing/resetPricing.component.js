import React, { Component } from 'react';
import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Post, Put } from 'common-js-util';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';
import {
    Table
} from 'reactstrap';

export default class ResetPricing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    onCancel() {
        ModalManager.closeModal();
    }

    changeCar() {
        console.log("DOne");
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
        console.log(this.state.value);
    
        return (
            <div className="modal-reset-pricing">
                <span className="tick-name"> Want to change the billing car </span>
                {/* <span> <input type="checkbox" name="change_car" value={values.license_validated_for_4_wheeler} checked={values.license_validated_for_4_wheeler} onChange={handleChange} /></span> */}
            </div>
        )
    }
}

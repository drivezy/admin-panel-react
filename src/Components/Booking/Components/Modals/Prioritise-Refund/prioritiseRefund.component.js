import React, { Component } from 'react';
import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Get } from 'common-js-util';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';
import './prioritiseRefund.component.css'

export default class PrioritiseREfund extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            id: props.data.id
        };
    }

    componentDidMount() {

    }

    transfer() {
        const { id, comment } = this.state
        const method = async () => {
            const result = await Get({ url: "refundPendingAction/" +id+'/'+ comment });
            if (result.success) {
                ToastNotifications.success({ title: 'Success' });
            }

        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to proceed?", callback: method });
    }

    render() {

        return (
            <div>
                <div className="prioritise-refund">
                    <span className="comment"> Comment <textarea type="text" className="text-field" name="comment" placeholder="Enter Comment" onChange={(e) => { this.setState({ comment: e.target.value }); }} /></span>
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




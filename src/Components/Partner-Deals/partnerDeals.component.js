import React, { Component } from 'react';
import * as PartnerDealUtils from './../../Utils/partnerDeals.utils';
import { ModalManager } from 'drivezy-web-utils/build/Utils/modal.utils';

export default class PartnerDeals extends Component {

    constructor(props) {
        super(props)
        console.log(props);

        ModalManager.closeModal();
        PartnerDealUtils[this.checklist_step.parameter.pre_method](props.data, props.callback, props.parent);
    }

    checklist_step = {
        "id": 83,
        "step_name": "Live Vehicle",
        "source_type": "PartnerDeal",
        "source_id": 1007,
        "description": "This step will make the vehicle live at the selected venue.",
        "parameter": {
            "pre_method": "goLive",
            "post_method": "goLive"
        },
        "order": 45,
        "created_by": 81232,
        "updated_by": 92234,
        "created_at": "2017-11-07 12:06:36",
        "updated_at": "2018-03-23 22:44:16",
        "deleted_at": null
    }

    render() {
        return (
            <div className="partner-deals-modal">
                {/* {PartnerDealUtils[this.checklist_step.parameter.pre_method]} */}
            </div>
        )
    }
}
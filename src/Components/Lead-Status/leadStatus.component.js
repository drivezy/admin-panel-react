import React, { Component } from 'react';

import CustomTooltip from './../../Components/Custom-Tooltip/customTooltip.component';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';
import { Put } from 'common-js-util';

import './leadStatus.component.css';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils/toast.utils';

export default class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    editChanges = async (stat) => {
        const { listingRow } = this.props;
        let index = 'lead.id'
        let url = "lead/" + listingRow[index];
        const result = await Put({
            url: url,
            body: stat

        });

        if (result.success) {
            ToastNotifications.success({ title: 'Success' });
        }

    }

    awaitingCall = (input) => {
        const method = async (input) => {
            let { data } = this.state
            this.setState({data : 607});
            let stat = {
                status_id: 607,
                comment: input[0].value
            }
            this.editChanges(stat);
        }


        ConfirmUtils.confirmModal({ message: "Are you sure to change the status to awaiting call?", callback: method, input: [{ display_name: 'Comment', placeholder: 'Enter comment', name: 'comment' }] });

    };

    onGoing = (input) => {

        const method = async (input) => {
            let { data } = this.state
            this.setState({data : 608});
            let stat = {
                status_id: 608,
                comment: input[0].value
            }
            this.editChanges(stat);

        }
        ConfirmUtils.confirmModal({ message: "Are you sure to change the status to on going?", callback: method, input: [{ display_name: 'Comment', placeholder: 'Enter comment', name: 'comment' }] });
    };

    goneCold = (input) => {

        const method = async (input) => {
            let { data } = this.state
            this.setState({data : 609});
            let stat = {
                status_id: 609,
                comment: input[0].value
            }
            this.editChanges(stat);
        }
        ConfirmUtils.confirmModal({ message: "Are you sure to change the status to gone cold?", callback: method, input: [{ display_name: 'Comment', placeholder: 'Enter comment', name: 'comment' }] });
    };

    mailApprovalReceived = (input) => {

        const method = async (input) => {
            let { data } = this.state
            this.setState({data : 610});
            let stat = {
                status_id: 610,
                comment: input[0].value
            }
            this.editChanges(stat);
        }
        ConfirmUtils.confirmModal({ message: "Are you sure to change the status to mail approved?", callback: method, input: [{ display_name: 'Comment', placeholder: 'Enter comment', name: 'comment' }] });
    };

    deal = (input) => {

        const method = async (input) => {
            let { data } = this.state
            this.setState({data : 611});
            let stat = {
                status_id: 611,
                comment: input[0].value
            }
            this.editChanges(stat);
        }
        ConfirmUtils.confirmModal({ message: "Are you sure to change the status to Deal?", callback: method, input: [{ display_name: 'Comment', placeholder: 'Enter comment', name: 'comment' }] });
    };

    render() {
        const { data } = this.state;
        return (

            <div className="status-button">

                <CustomTooltip placement="top" html={<button className={data == 607 ? ' cursor-pointer bg-orange-white-text' : ' cursor-pointer'} onClick={() => data != 607 && this.awaitingCall()}
                >AC</button>} title="Upload Permit">
                </CustomTooltip>

                <CustomTooltip placement="top" html={<button className={data == 608 ? ' cursor-pointer bg-purple-white-text' : ' cursor-pointer'} onClick={() => data != 608 && this.onGoing()}
                >OG</button>} title="On-Going">
                </CustomTooltip>

                <CustomTooltip placement="top" html={<button className={data == 609 ? ' cursor-pointer bg-red-white-text' : ' cursor-pointer'} onClick={() => data != 609 && this.goneCold()}
                >GC</button>} title="Gone Cold">
                </CustomTooltip>

                <CustomTooltip placement="top" html={<button className={data == 610 ? ' cursor-pointer bg-yellow-white-text' : ' cursor-pointer'} onClick={() => data != 610 && this.mailApprovalReceived()}
                >MA</button>} title="Mail Approval Received">
                </CustomTooltip>

                <CustomTooltip placement="top" html={<button className={data == 611 ? ' cursor-pointer bg-green-white-text' : ' cursor-pointer'} onClick={() => data != 611 && this.deal()}
                >Deal</button>} title="Deal !">
                </CustomTooltip>

            </div>
        )
    }
}





// (function () {
//     'use strict';

//     angular
//         .module('JRAdminApp')
//         .directive('leadStatus', leadStatus);

//     function leadStatus() {
//         var directive = {
//             templateUrl: "/js/directives/lead-status/lead-status-directive.html",
//             bindToController: true,
//             controller: leadStatusController,
//             controllerAs: 'leadStatus',
//             // link: link,
//             restrict: 'E',
//             scope: {
//                 status: "=",
//                 id: "=",
//                 refresh: "&?"
//             }
//         };
//         return directive;
//     }


//     /* @ngInject */
//     function leadStatusController(ListingFactory, ModalService, $state, swl) {
//         var self = this;

//         // #TODO 
//         // Below section can be refactored by maintaining an array and rewriting all the duplicate
//         // code below

//         // This function changes the status to awaiting call



//     }
// })();
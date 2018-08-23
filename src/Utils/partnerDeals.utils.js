import React from 'react';
import { ModalManager } from 'drivezy-web-utils/build/Utils';
import DealAdd from './../Components/Partner-Deals/Modals/Partner-Deal-Add/partnerDealAdd.component';
import AddDealTicket from './../Components/Partner-Deals/Modals/Add-Deal-Ticket/addDealTicket.component';
import DealPayment from './../Components/Partner-Deals/Modals/Deal-Payment/dealPayment.component';
import InsuranceInfo from './../Components/Partner-Deals/Modals/Insurance-Information/insuranceDetails.component';
import GoLive from './../Components/Partner-Deals/Modals/Go-Live/goLive.component';
import AgreementUpload from './../Components/Partner-Deals/Modals/Agreement-Upload/agreementUpload.component';
import OrderDetails from './../Components/Partner-Deals/Modals/Order-Details/orderDetails.component';
import TrackerNotification from './../Components/Partner-Deals/Modals/Tracker-Notification/trackerNotification.component.js';

export function editDeal(obj, callback, parent) {
        ModalManager.openModal({
            headerText: "ADD DEAL",
            modalBody: () => (<DealAdd data={obj} callback={callback} parent={parent}/>)
        })
}

// export function amountCollection(obj, callback) {
//     ModalManager.openModal({
//         headerText: "Amount Collection",
//         modalBody: () => (<AmountCollection />)
//     })
// }

export function goLive(obj, callback, parent) {
    ModalManager.openModal({
        headerText: "Go Live",
        modalBody: () => (<GoLive data={obj} callback={callback} parent={parent}/>)
    })
}

export function payment(obj, callback, parent) {
    ModalManager.openModal({
        headerText: "DEAL PAYMENT INFORMATION",
        modalBody: () => (<DealPayment data={obj} callback={callback} parent={parent}/>)
    })
}

export function addOrderTicket(obj, callback, parent) {
    ModalManager.openModal({
        headerText: "ORDER VEHICLE/ ADD ORDER TICKET",
        modalBody: () => (<AddDealTicket data={obj} callback={callback} parent={parent}/>)
    })
}

// export function AddInsuranceTicket(obj, callback) {
//     ModalManager.openModal({
//         headerText: "Add Insurance Ticket",
//         modalBody: () => (<ManualVehicleChange />)
//     })
// }

// export function AddRtoTicket(obj, callback) {
//     ModalManager.openModal({
//         headerText: "Add RTO Ticket",
//         modalBody: () => (<ManualVehicleChange />)
//     })
// }

export function orderDetails(obj, callback, parent) {
    ModalManager.openModal({
        headerText: "Order Details",
        modalBody: () => (<OrderDetails data={obj} callback={callback} parent={parent} />)
    })
}

export function insuranceDetails(obj, callback, parent) {
    ModalManager.openModal({
        headerText: "INSURANCE INFORMATION",
        modalBody: () => (<InsuranceInfo data={obj} callback={callback} parent={parent}/>)
    })
}

// export function RtoPermitDetails(obj, callback) {
//     ModalManager.openModal({
//         headerText: "RTO Permit Details",
//         modalBody: () => (<ManualVehicleChange />)
//     })
// }

export function trackerNotification(obj, callback) {
    ModalManager.openModal({
        headerText: "SEND TRACKER NOTIFICATION",
        modalBody: () => (<TrackerNotification />)
    })
}

export function agreementUpload(obj, callback, parent) {
    ModalManager.openModal({
        headerText: "Agreement Upload",
        modalBody: () => (<AgreementUpload data={obj} callback={callback} parent={parent}/>)
    })
}

// export function SendInvitation(obj, callback) {
//     ModalManager.openModal({
//         headerText: "Send Invitation",
//         modalBody: () => (<ManualVehicleChange />)
//     })
// }

// export function rtoPayment(obj, callback) {
//     ModalManager.openModal({
//         headerText: "RTO Payment",
//         modalBody: () => (<RTOPayment />)
//     })
// }

// export function SpeedGovernancePayment(obj, callback) {
//     ModalManager.openModal({
//         headerText: "Speed Governance Payment",
//         modalBody: () => (<ManualVehicleChange />)
//     })
// }

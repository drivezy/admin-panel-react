import React from 'react';

import DealAdd from './../Components/Partner-Deals/Modals/Partner-Deal-Add/partnerDealAdd.component';
import AddDealTicket from './../Components/Partner-Deals/Modals/Add-Deal-Ticket/addDealTicket.component';
import DealPayment from './../Components/Partner-Deals/Modals/Deal-Payment/dealPayment.component';
import InsuranceInfo from './../Components/Partner-Deals/Modals/Insurance-Information/insuranceDetails.component';
import GoLive from './../Components/Partner-Deals/Modals/Go-Live/goLive.component';
import AgreementUpload from './../Components/Partner-Deals/Modals/Agreement-Upload/agreementUpload.component';
import OrderDetails from './../Components/Partner-Deals/Modals/Order-Details/orderDetails.component';
import TrackerNotification from './../Components/Partner-Deals/Modals/Tracker-Notification/trackerNotification.component.js';
import RTOTicket from './../Components/Partner-Deals/Modals/RTO-Ticket/rtoTicket.component';
import AmountCollection from './../Components/Partner-Deals/Modals/Amount-Collection/amountCollection.component';

import { ModalManager } from 'drivezy-web-utils/build/Utils';

export function editDeal(obj, callback, parent) {
        ModalManager.openModal({
            headerText: "Edit Deal",
            modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
        })
}

export function AmountCollection(obj, callback) {
    ModalManager.openModal({
        headerText: "Amount Collection",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function GoLive(obj, callback) {
    ModalManager.openModal({
        headerText: "Go Live",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function Payment(obj, callback) {
    ModalManager.openModal({
        headerText: "Payment",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function AddOrderTicket(obj, callback) {
    ModalManager.openModal({
        headerText: "Add Order Ticket",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function AddInsuranceTicket(obj, callback) {
    ModalManager.openModal({
        headerText: "Add Insurance Ticket",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function AddRtoTicket(obj, callback) {
    ModalManager.openModal({
        headerText: "Add RTO Ticket",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function OrderDetails(obj, callback) {
    ModalManager.openModal({
        headerText: "Order Details",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function InsuranceDetails(obj, callback) {
    ModalManager.openModal({
        headerText: "Insurance Details",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function RtoPermitDetails(obj, callback) {
    ModalManager.openModal({
        headerText: "RTO Permit Details",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function TrackerNotification(obj, callback) {
    ModalManager.openModal({
        headerText: "Tracker Notification",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function AgreementUpload(obj, callback) {
    ModalManager.openModal({
        headerText: "Agreement Upload",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function SendInvitation(obj, callback) {
    ModalManager.openModal({
        headerText: "Send Invitation",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function RtoPayment(obj, callback) {
    ModalManager.openModal({
        headerText: "RTO Payment",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}

export function SpeedGovernancePayment(obj, callback) {
    ModalManager.openModal({
        headerText: "Speed Governance Payment",
        modalBody: () => (<ManualVehicleChange cars={carsList} reasons={result.response.values} bookingData={bookingData} manual={true}/>)
    })
}
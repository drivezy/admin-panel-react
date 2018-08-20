import { ModalManager } from 'drivezy-web-utils/build/Utils';

export function EditDeal(obj, callback) {
        ModalManager.openModal({
            headerText: "Edit Deal",
            modalBody: () => (<EditDeal />)
        })
}

export function AmountCollection(obj, callback) {
    ModalManager.openModal({
        headerText: "Amount Collection",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function GoLive(obj, callback) {
    ModalManager.openModal({
        headerText: "Go Live",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function Payment(obj, callback) {
    ModalManager.openModal({
        headerText: "Payment",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function AddOrderTicket(obj, callback) {
    ModalManager.openModal({
        headerText: "Add Order Ticket",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function AddInsuranceTicket(obj, callback) {
    ModalManager.openModal({
        headerText: "Add Insurance Ticket",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function AddRtoTicket(obj, callback) {
    ModalManager.openModal({
        headerText: "Add RTO Ticket",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function OrderDetails(obj, callback) {
    ModalManager.openModal({
        headerText: "Order Details",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function InsuranceDetails(obj, callback) {
    ModalManager.openModal({
        headerText: "Insurance Details",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function RtoPermitDetails(obj, callback) {
    ModalManager.openModal({
        headerText: "RTO Permit Details",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function TrackerNotification(obj, callback) {
    ModalManager.openModal({
        headerText: "Tracker Notification",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function AgreementUpload(obj, callback) {
    ModalManager.openModal({
        headerText: "Agreement Upload",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function SendInvitation(obj, callback) {
    ModalManager.openModal({
        headerText: "Send Invitation",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function RtoPayment(obj, callback) {
    ModalManager.openModal({
        headerText: "RTO Payment",
        modalBody: () => (<ManualVehicleChange />)
    })
}

export function SpeedGovernancePayment(obj, callback) {
    ModalManager.openModal({
        headerText: "Speed Governance Payment",
        modalBody: () => (<ManualVehicleChange />)
    })
}
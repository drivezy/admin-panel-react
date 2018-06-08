import { Get } from './../Utils/http.utils';
import moment from 'moment';

export function Booking(bookingId) {
    return Get({ url: "booking/" + bookingId + "?includes=overspeeding,vehicle.car,user.licenses,status,createdUser,booking_payment.created_user,feedback.feedback_categories.category,rideReturn.pickerUser,rideReturn.handoverUser,splitPayment.user,collection.accounthead,extension.createdUser,payment.response,payment.created_user,payment.acknowledgeUser,refund.authorizer,refund.response,venuePick.city,venueDrop.city,vehicleMovement,vehicleMovement.sourceVenue,vehicleMovement.destinationVenue,vehicleMovement.mover,addon.addon,addon.chargeType,cancellation.createdUser,cancellation.type,city,comments.createdUser,comments.comment_type,source,package.package,resetInvoice.createdUser,internalBooking.driver,images.type,images.created_user,events,accident.damage_severity,vehicleChange.oldVehicle,vehicleChange.newVehicle,vehicleChange.createdUser,vehicleChange.reasonType,type,coupon.campaign,offers,vendorDriver.type,vendorDriver.vendor.vendor,trips,alerts.type,booking_summary,overspeeding,partner_collections.account_head,partner_account,pending_actions.assigned_user,pending_actions.completed_user,permits.state,application,billing_car,invoices.created_user,refund.imps_request,booking_steps.checklist_step,user" });
}

export function BookingPickupDate(pickupTime) {
    return moment(pickupTime).format("dddd, MMMMDo YYYY");
}

export function BookingPickupTime(pickupTime) {
    return moment(pickupTime).format("h:mm A");
}

export function BookingDropDate(dropTime) {
    return moment(dropTime).format("dddd, MMMMDo YYYY");
}

export function BookingDropTime(dropTime) {
    return moment(dropTime).format("h:mm A");
}

export function TotalDuration(updationTime, ActualStartTime) {
    let ms = moment(updationTime).diff(moment(ActualStartTime));
    let d = moment.duration(ms);
    return Math.floor(d.asHours()) + "h " + Math.floor(d.minutes()) + "m";
}
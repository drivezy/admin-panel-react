/*************************************************************************
 * Notification wrapper
 * Contain three methods for showing success, warn and error notification
 * All kind of notification will be sent through these methods
 ************************************************************************/

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastParams = { // default configuration for toast
    autoClose: 2000,
    position: toast.POSITION.BOTTOM_TOP
}
export default class ToastNotifications {
    /**
     * Shows success notification
     * @param  {string} message
     * @param  {Object} params={}
     */
    static success(message, params = {}) {
        const newParams = { ...toastParams, ...params }; // overriding toast params
        toast.success(message, newParams);
    }

    /**
     * Shows error notification
     * @param  {string} message
     * @param  {Object} params={}
     */
    static error(message, params = {}) {
        const newParams = { ...toastParams, ...params }; // overriding toast params
        toast.error(message, newParams);
    }

    /**
     * Shows warn notification
     * @param  {string} message
     * @param  {Object} params={}
     */
    static warning(message, params = {}) {
        const newParams = { ...toastParams, ...params }; // overriding toast params
        toast.warn(message, newParams);
    }
}

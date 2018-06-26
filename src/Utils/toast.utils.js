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

  static register(elem) {
    this.currentScope = elem;
  }

  static openFlag(){
    this.currentScope.addFlag();
  }

  /**
   * Shows success notification
   * @param  {string} message
   * @param  {Object} params={}
   */
  static success(params) {
    const newParams = { ...toastParams, ...params }; // overriding toast params
    this.currentScope.success(params);
  }

  /**
   * Shows error notification
   * @param  {string} message
   * @param  {Object} params={}
   */
  static error(params) {
    const newParams = { ...toastParams, ...params }; // overriding toast params
    this.currentScope.error(params);
  }

  /**
   * Shows warn notification
   * @param  {string} message
   * @param  {Object} params={}
   */
  static warning(params) {
    const newParams = { ...toastParams, ...params }; // overriding toast params
    this.currentScope.warn(params);
  }



}

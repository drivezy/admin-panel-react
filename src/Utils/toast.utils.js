/*************************************************************************
 * Notification wrapper
 * Contain three methods for showing success, warn and error notification
 * All kind of notification will be sent through these methods
 ************************************************************************/





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
    // overriding toast params
    this.currentScope.success(params);
  }

  /**
   * Shows error notification
   * @param  {string} message
   * @param  {Object} params={}
   */
  static error(params) {
    // overriding toast params
    this.currentScope.error(params);
  }

  /**
   * Shows warn notification
   * @param  {string} message
   * @param  {Object} params={}
   */
  static warning(params) {
    // overriding toast params
    this.currentScope.warn(params);
  }



}

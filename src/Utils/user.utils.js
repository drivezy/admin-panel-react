

import GLOBAL from './../Constants/global.constants';

import { Get } from './http.utils';
import { StoreEvent } from './stateManager.utils';
/************************************
 * All user related utility methods
 ***********************************/

import { GetItem } from './localStorage.utils';

import { LoginCheckEndPoint } from './../Constants/api.constants';


let CurrentUser = {};

let fireToken = '';
/**
 * Returns firebase token for users
 * first checks in local variable, if its undefined, returns from Asyncstorage
 */
export const GetFireToken = async () => {
    if (fireToken) {
        return fireToken;
    }
    fireToken = GetItem('FIRE_TOKEN');
    return fireToken;
};

export const LoginCheck = async () => {
    const result = await Get({ urlPrefix: GLOBAL.ROUTE_URL, url: LoginCheckEndPoint });
    let loggedUser = {};
    if (result.success) {
        loggedUser = GetUserDetail(result.response);
        CurrentUser = result.response;
    }

    StoreEvent({ eventName: 'loggedUser', data: { ...loggedUser, ...{ loggedCheckDone: true } } });
    return result;
}

export const GetUserDetail = (userObject) => {
    try {
        const currentUser = {
            id: userObject.id,
            username: userObject.username,
            display_name: userObject.display_name,
            email: userObject.email,
            image: userObject.image,
            last_login_time: userObject.last_login_time,
            photograph: userObject.photograph,
            mobile: userObject.mobile,
            license: userObject.license,
            dob: userObject.dob,
            license_number: userObject.license_number,
            is_station_manager: userObject.is_station_manager,
            is_license_validated: userObject.is_license_validated,
            is_mobile_validated: userObject.is_mobile_validated,
            is_email_verified: userObject.is_email_verified,
            booking_allowed: userObject.booking_allowed,
            blocked_reason: userObject.blocked_reason,
            zero_deposit: userObject.zero_deposit,
            oauth_token: userObject.oauth_token,
            calling_number: userObject.calling_number
        };

        // Takes role name if he has same role then return true otherwise false
        const hasRole = function (roleName) {
            for (let i in currentUser.roles) {
                if (currentUser.roleIdentifiers[i] == 'super-admin') {
                    return true;
                } else {
                    if (currentUser.roles[i] == roleName || currentUser.roleIdentifiers[i] == roleName) {
                        return true;
                    }
                }
            }
        };

        const hasAbsoluteRole = function (roleName) {
            for (let i in currentUser.roles) {
                if (currentUser.roles[i] == roleName) {
                    return true;
                } else {
                    return false;
                }
            }
            for (let i in currentUser.roleIdentifiers) {
                if (currentUser.roleIdentifiers[i] == roleName) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        // Takes permission name and return true and false if user has same permission
        const hasPermission = function (permissionName) {
            for (let i in currentUser.permissions) {
                if (currentUser.permissions[i] == permissionName || currentUser.permissionIdentifiers[i] == permissionName) {
                    return true;
                }
            }
        };

        const hasAbsolutePermission = function (permissionName) {
            for (let i in currentUser.permissions) {
                if (currentUser.permissions[i] == permissionName) {
                    return true;
                } else {
                    return false;
                }
            }
            for (let i in currentUser.permissionIdentifiers) {
                if (currentUser.permissionIdentifiers[i] == permissionName) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        // if (userObject.parent_user) {
        //     currentUser.parent_user = userObject.parent_user;
        //     currentUser.impersonated = true;
        // }

        currentUser.roles = [];
        currentUser.permissions = [];
        currentUser.roleIdentifiers = [];
        currentUser.permissionIdentifiers = [];
        currentUser.hasRole = hasRole;
        currentUser.hasPermission = hasPermission;
        currentUser.hasAbsoluteRole = hasAbsoluteRole;
        currentUser.hasAbsolutePermission = hasAbsolutePermission;

        for (let i in userObject.access_object.roles) {
            currentUser.roles.push(userObject.access_object.roles[i]);
        }

        for (let j in userObject.access_object.permissions) {
            currentUser.permissions.push(userObject.access_object.permissions[j]);
        }

        for (let i in userObject.access_object.roleIdentifiers) {
            currentUser.roleIdentifiers.push(userObject.access_object.roleIdentifiers[i]);
        }

        for (let j in userObject.access_object.permissionIdentifiers) {
            currentUser.permissionIdentifiers.push(userObject.access_object.permissionIdentifiers[j]);
        }
        // currentUser.isSuperAdmin = hasRole("super_admin");
        // currentUser.isAdmin = hasRole("admin");

        return currentUser;
    } catch (err) {
        return userObject;
    }
};

// export const GetUser = () => {
//     return CurrentUser;
// }

// export const ImpersonateUser = () => {
//     return CurrentUser;
// }
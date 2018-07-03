

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
        // loggedUser = result.response;
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
        // Takes role name and return true and false if user has same role
        const hasRole = function (roleName) {
            if (currentUser.isSuperAdmin) {
                return true;
            }
            if (currentUser.roles.indexOf(roleName) == -1) {
                return false;
            } else {
                return true;
            }
        };

        const hasAbsoluteRole = function (roleName) {
            if (currentUser.roles.indexOf(roleName) == -1) {
                return false;
            } else {
                return true;
            }
        };

        const hasPermission = function (permissionName) {
            if (currentUser.isSuperAdmin) {
                return true;
            }
            if (currentUser.permissions.indexOf(permissionName) == -1) {
                return false;
            } else {
                return true;
            }
        };

        if (userObject.parent_user) {
            currentUser.parent_user = userObject.parent_user;
            currentUser.impersonated = true;
        }

        currentUser.roles = [];
        currentUser.permissions = [];
        currentUser.hasRole = hasRole;
        currentUser.hasAbsoluteRole = hasAbsoluteRole;

        for (var i in userObject.roles) {
            currentUser.roles.push(userObject.roles[i].role.identifier);
        }

        for (var j in userObject.permissions) {
            if (userObject.permissions[j] && userObject.permissions[j]) {
                var permission = userObject.permissions[j].name;
                currentUser.permissions.push(permission);
            }
        }
        currentUser.isSuperAdmin = hasRole("super_admin");
        currentUser.isAdmin = hasRole("admin");

        return currentUser;
    } catch (err) {
        return userObject;
    }
};

export const GetUser = () => {
    return CurrentUser;
}

export const ImpersonateUser = () => {
    return CurrentUser;
}
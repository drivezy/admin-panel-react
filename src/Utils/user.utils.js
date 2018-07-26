/************************************
 * All user related utility methods
 ***********************************/
import GLOBAL from './../Constants/global.constants';
import { LoginCheckEndPoint } from './../Constants/api.constants';

import { Get } from 'common-js-util';
import { StoreEvent }from 'state-manager-utility';
import { GetItem } from 'storage-utility';

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

        const hasRole = function (roleName) {
            // super user should always get access to all the resources in the system
            return currentUser.roles.indexOf('super-admin') != -1 || currentUser.roles.indexOf(1) != -1 || currentUser.roleIdentifiers.indexOf(roleName) != -1 || currentUser.roleIdentifiers.indexOf(roleName) != -1;
        };

        const hasAbsoluteRole = function (roleName) {
            return currentUser.roles.indexOf(roleName) != -1 || currentUser.roleIdentifiers.indexOf(roleName) != -1;
        };

        const hasPermission = function (permissionName) {
            // super user should always get access to all the resources in the system
            return currentUser.permissions.indexOf('super-admin') != -1 || currentUser.permissions.indexOf(1) != -1 || currentUser.permissionIdentifiers.indexOf(permissionName) != -1 || currentUser.permissionIdentifiers.indexOf(permissionName) != -1;
        };

        const hasAbsolutePermission = function (permissionName) {
            return currentUser.permissions.indexOf(permissionName) != -1 || currentUser.permissionIdentifiers.indexOf(permissionName) != -1;
        };

        if (userObject.parent_user) {
            currentUser.parent_user = userObject.parent_user;
            currentUser.impersonated = true;
        }

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
        console.log('err');
        return userObject;
    }
};

export const GetUser = () => {
    return CurrentUser;
}

export const ImpersonateUser = () => {
    return CurrentUser;
}
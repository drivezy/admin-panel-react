

import GLOBAL from './../Constants/global.constants';

import { Get } from './http.utils';

/************************************
 * All user related utility methods
 ***********************************/

import { GetItem } from './localStorage.utils';


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
    const result = await Get({ urlPrefix: GLOBAL.ROUTE_URL, url: 'loginCheck' });
    if (result.success) {
        CurrentUser = result.response;
    }
    return result;
}

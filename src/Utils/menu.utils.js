

import { Get, Post } from './http.utils';

import { GetMenusEndPoint } from './../Constants/api.constants';

let menus = [];

export const GetMenusFromApi = () => {
    return Get({ url: GetMenusEndPoint, callback: setValues });
}

export const GetMenus = () => {
    return menus;
}

function setValues(values) {
    menus = values.response;
}

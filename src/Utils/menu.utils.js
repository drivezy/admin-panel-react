

import { Get, Post } from './http.utils';
import { ArrayToObject } from './common.utils';
import _ from 'lodash';

import { GetMenusEndPoint } from './../Constants/api.constants';
import { RECORD_URL } from './../Constants/global.constants';

let menus = [];

export const GetMenusFromApi = async () => {
    // const result = await Get({ url: GetMenusEndPoint, callback: setValues});
    // return result;

    const result = await Get({ url: GetMenusEndPoint, callback: setValues, urlPrefix: RECORD_URL });
    if (result.success) {
        const { response } = result;
        const paths = ArrayToObject(response.paths, 'id');
        const { modules } = response;


        if (!Array.isArray(modules)) {
            return [];
        }

        let activeModules = _.sortBy( modules, 'display_order' );

        activeModules.forEach(module => {
            const { menus } = module;
            module.menus.map(menu =>
                menu.component = paths[menu.page_id]
            );
        })

        return activeModules;
    }
}

export const GetMenus = () => menus;

function setValues(values) {
    menus = values.response;
}

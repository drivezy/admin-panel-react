

import { Get, Post } from './http.utils';
import { RECORD_URL } from './../Constants/global.constants';

let preferences = [];

export const GetPreferences = () => {
    return Get({ url: 'userPreference', callback: setValues });
}

/**
 * accepts source_type = JRAPP, source_id (menuId), user_id, name = default, query = null, column_definition
 * @param  {} key
 * @param  {} value
 * @param  {} override_all
 */
export function SetPreference({ userId, menuId, name, selectedColumns, override_all }) {
    // export function SetPreference(key, value, override_all) {
    console.log({ userId, menuId, name, selectedColumns, override_all });

    // @TODO add userid when saving for particular user (not for all)

    return Post({ url: 'listPreference', body: { source_type: 'JRAPP', query: null, source_id: menuId, name, column_definition: JSON.stringify(selectedColumns) }, urlPrefix: RECORD_URL });
    // return Post({ url: 'listPreference', body: { source_type: 'JRAPP', query: null, user_id: userId, source_id: menuId, name, column_definition: JSON.stringify(selectedColumns) }, urlPrefix: RECORD_URL });
    // return Post({ url: 'userPreference', body: { parameter: key, value: JSON.stringify(value) }, urlPrefix: RECORD_URL });
}

export function DeletePreference(key, value, forAll) {
    preferences[key] = value;

    return Post({ url: 'deleteUserPreference', body: { parameter: key, value: forAll } });
}

function setValues(values) {
    preferences = values.response;
}

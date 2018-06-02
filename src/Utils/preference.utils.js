

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
export function SetPreference({ userId, menuId, name = 'default', selectedColumns, override_all, source, query = null }) {
    const source_type = GetSourceMorphMap(source);
    if (!source_type) {
        alert('Please provide valid source for setting preference'); // @TODO replace with ToastUtils
    }

    // @TODO add userid when saving for particular user (not for all)

    return Post({ url: 'listPreference', body: { source_type, query, source_id: menuId, name, column_definition: JSON.stringify(selectedColumns) }, urlPrefix: RECORD_URL });
    // return Post({ url: 'userPreference', body: { parameter: key, value: JSON.stringify(value) }, urlPrefix: RECORD_URL });
}

export function DeletePreference(key, value, forAll) {
    preferences[key] = value;

    return Post({ url: 'deleteUserPreference', body: { parameter: key, value: forAll } });
}

function setValues(values) {
    preferences = values.response;
}


function GetSourceMorphMap(source) {
    const sourceMorph = {
        menu: 'Drivezy\\LaravelAdmin\\Models\\Menu',
        model: 'Drivezy\\LaravelRecordManager\\Models\\DataModel',
        modelAlias: 'Drivezy\\LaravelRecordManager\\Models\\ModelRelationship'
    };
    return sourceMorph[source];
}


import { Get, Post, Put, Delete } from './http.utils';
import { IsObjectHaveKeys } from './common.utils';

import { ListPreference } from './../Constants/api.constants';
import { RECORD_URL } from './../Constants/global.constants';

let preferences = [];

export const GetPreferences = () => {
    return Get({ url: 'userPreference?limit=1000', callback: setValues });
}

export const GetPreference = (preference) => {
    // return Get({ url: 'userPreference', callback: setValues });
    var custom = preferences.filter((preference) => preference.parameter === preference).pop()

    console.log(custom);
    // return preferences.filter((preference) => preference.parameter === preference).pop()
    // return preferences[preference];
}


/**
 * accepts source_type = JRAPP, source_id (menuId), user_id, name = default, query = null, column_definition
 * @param  {} key
 * @param  {} value
 * @param  {} override_all
 */
export function SetPreference({ userId, menuId, name = 'default', selectedColumns, override_all, source, query = null, layout, url = ListPreference }) {
    const source_type = GetSourceMorphMap(source);

    const methods = { Post, Put };
    let method = 'Post';

    const body = {
        // query,
        name,
        column_definition: JSON.stringify(selectedColumns),
        source_type
    };

    if (query) {
        body.query = query;
    }

    if (!source_type) {
        alert('Please provide valid source for setting preference'); // @TODO replace with ToastUtils
    }

    if (IsObjectHaveKeys(layout)) {
        url += '/' + layout.id;
        method = 'Put';
    } else {
        body.source_id = menuId;
    }

    // @TODO add userid when saving for particular user (not for all)

    return methods[method]({ url, body, urlPrefix: RECORD_URL });
    // return Post({ url: 'userPreference', body: { parameter: key, value: JSON.stringify(value) }, urlPrefix: RECORD_URL });
}

export function DeletePreference({ layout }) {
    const url = ListPreference + '/' + layout.id;
    return Delete({ url, urlPrefix: RECORD_URL });
}
// export function DeletePreference(key, value, forAll) {
//     preferences[key] = value;

//     return Post({ url: 'deleteUserPreference', body: { parameter: key, value: forAll } });
// }

function setValues(values) {
    preferences = values.response;
}


function GetSourceMorphMap(source) {
    const sourceMorph = {
        menu: 'Drivezy\\LaravelAdmin\\Models\\Menu',
        model: 'Drivezy\\LaravelRecordManager\\Models\\DataModel',
        modelAlias: 'Drivezy\\LaravelRecordManager\\Models\\ModelRelationship',
        form: 'Drivezy\\LaravelRecordManager\\Models\\CustomForm'
    };
    return sourceMorph[source];
}
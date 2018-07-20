

import { Get, Post, Put, Delete } from './http.utils';
import { IsObjectHaveKeys } from './common.utils';

import { ListPreference } from './../Constants/api.constants';
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
        alert('Please provide valid source for setting preference'); // @TODO replace with ToastNotifications
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

/**
 * Returns model hash value against given source and vice versa when reverse is true
 * @param  {string} source
 * @param  {boolean} reverse=false
 */
export function GetSourceMorphMap(source, reverse = false) {
    let sourceMorph = {
        menu: 'db8a887c48306740a6baa49e7b73b8ae',
        model: '07b76506c43824b152745fe7df768486',
        modelAlias: '2f7de4d415673d4da9ae054931189828',
        form: '5a46c74518b74fbe7d911758970f4950'
    };

    if (reverse) {
        sourceMorph = swap(sourceMorph);
    }
    // const sourceMorph = {
    //     menu: 'Drivezy\\LaravelAdmin\\Models\\Menu',
    //     model: 'Drivezy\\LaravelRecordManager\\Models\\DataModel',
    //     modelAlias: 'Drivezy\\LaravelRecordManager\\Models\\ModelRelationship',
    //     form: 'Drivezy\\LaravelRecordManager\\Models\\CustomForm'
    // };
    return sourceMorph[source];
}

/**
 * Reverse keys with value
 * for e.g. swap({A : 1, B : 2, C : 3, D : 4}) = {1 : A, 2 : B, 3 : C, 4 : D}
 * @param  {Object} json
 */
function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}
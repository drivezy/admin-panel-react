

import { Get, Post, Put, Delete } from 'common-js-util';

import { ListPreference , UserPreferenceEndPoint } from './../Constants/api.constants';
import { RECORD_URL } from './../Constants/global.constants';

let preferences = [];

export const GetUserPreferences = () => {
    return Get({ url: UserPreferenceEndPoint, callback: setValues });     //???
}

/**
 * accepts source_type = JRAPP, source_id (menuId), user_id, name = default, query = null, column_definition
 * @param  {} key
 * @param  {} value
 * @param  {} override_all
 */
export function SetUserPreference( key , value) {
   

    const methods = { Post, Put };
    let method = 'Post';

    const body = {
        // query,
        parameter: "spotlightkeys",
        key,
        value: JSON.stringify(value)
        
    };


    // @TODO add userid when saving for particular user (not for all)

    //return methods[method]({  body });
     return Post({ url: 'userPreference', body });
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
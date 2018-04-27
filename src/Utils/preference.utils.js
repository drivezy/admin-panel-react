

import { Get, Post } from './http.utils';

let preferences = [];

export const GetPreferences = () => {
    return Get({ url: 'userPreference', callback: setValues });
}

export function SetPreference(key, value, override_all) {
    preferences[key] = value;

    return Post({ url: 'userPreference', body: { parameter: key, value: JSON.stringify(value) } });
}

function setValues(values) {
    preferences = values.response;
}

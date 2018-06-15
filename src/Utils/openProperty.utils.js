import { Get } from './../Utils/http.utils';
import { SetItem, GetItem } from './../Utils/localStorage.utils';
import { SetCookie, GetCookie } from './../Utils/cookie.utils';
import { ArrayToObject } from './../Utils/common.utils';

import { OpenPropertiesEndPoint } from './../Constants/api.constants';

export async function FindProperty(propertyName) {
    const openProperties = GetItem('OPEN_PROPERTIES');
    let propertyDetail = openProperties ? openProperties[propertyName] : undefined;
    if (!propertyDetail) {
        const properties = await GetOpenPropertiesFromApi();
        propertyDetail = properties[propertyName];
    }
    return Object.hasOwnProperty.call(propertyDetail, 'property_value') ? propertyDetail.property_value : propertyDetail;
}

export async function GetProperties(forceLoad = false) {
    if (forceLoad) {
        return GetOpenPropertiesFromApi();
    }
    const isFreshDataInLocalStorage = GetCookie('OPEN_PROPERTIES');
    if (!isFreshDataInLocalStorage) {
        SetCookie('OPEN_PROPERTIES', true, 2);
        return GetOpenPropertiesFromApi();
    }
}

async function GetOpenPropertiesFromApi() {
    const url = `${OpenPropertiesEndPoint}?limit=100`;
    const result = await Get({ url });
    if (result.success) {
        const openProperties = ArrayToObject(result.response, 'name');
        SetItem('OPEN_PROPERTIES', openProperties);
        return openProperties;
    }
}
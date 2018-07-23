import { BuildUrlForGetCall, SelectFromOptions, Get } from 'common-js-util';

import { ColumnsEndPoint } from './../Constants/api.constants';
import { ROUTE_URL } from './../Constants/global.constants';

export function GetColumnDetail({ sourceId, sourceType }) {

    const apiParams = { query: `source_type='${sourceType}' and source_id=${sourceId}` }
    const url = BuildUrlForGetCall(ColumnsEndPoint, apiParams);
    return Get({ url, urlPrefix: ROUTE_URL });

}

export function ExtractColumnName(name, columns) {
    if (!name) {
        return '';
    }

    const splittedNames = name.split('.');
    const columnName = splittedNames[1];
    if (columnName) {
        return SelectFromOptions(columns,columnName, 'name');
    }
    return {};
}
import { BuildUrlForGetCall } from './common.utils';
import { Get } from './http.utils';

import { ColumnsEndPoint } from './../Constants/api.constants';
import { ROUTE_URL } from './../Constants/global.constants';

export function GetColumnDetail({ sourceId, sourceType }) {

    const apiParams = { query: `source_type='${sourceType}' and source_id=${sourceId}` }
    const url = BuildUrlForGetCall(ColumnsEndPoint, apiParams);
    return Get({ url, urlPrefix: ROUTE_URL });

}
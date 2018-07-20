import { Get } from 'common-js-util';

export function GetLookupValues(lookupId) {
    return Get({ url: "lookupValue?query=lookup_type=" + lookupId + "&limit=100" });
}
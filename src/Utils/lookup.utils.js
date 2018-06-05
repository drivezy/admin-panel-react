import { Get } from './../Utils/http.utils';

export function GetLookupValues(lookupId) {
    return Get({ url: "lookupValue?query=lookup_type=" + lookupId + "&limit=100" });
}
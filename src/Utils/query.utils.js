import { Get } from './../Utils/http.utils';

export function QueryData(queryId) {
    return Get({ url: "reportingQuery/" + queryId + "?includes=parameters.referenced_model,parameters.param_type,user_filter,actions.definition,user_view.group_filter,assets" });
}
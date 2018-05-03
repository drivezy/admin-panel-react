import { IsUndefinedOrNull, SelectFromOptions, BuildUrlForGetCall } from './common.utils';
import { GetColumnsForListing, ConvertToQuery, CreateFinalColumns } from './generic.utils';
import { Get } from './http.utils';

/**
* prepare query, pagination, and everything required according to
* url and menu detail, fetch data and being passed further to components
* to show listing data
*/
export async function GetListingRecord({ configuration, urlParameter = {}, callback, data }) {
    const params = Initialization(configuration, urlParameter);

    let tempQuery;
    const options = GetDefaultOptions();

    params.page = urlParameter.page ? parseInt(urlParameter.page) : data.currentPage;
    options.includes = params.includes;
    options.order = params.order + "," + params.sort;

    // @TODO search functionality
    // Add the input field on the generic listing page to query
    // if (self.searchObj && self.searchObj.hasOwnProperty("id")) {
    //     // @todo Should improve this , too much of manual
    //     globalSearchField = self.activeSelectField.selected.column_name;
    //     options.query += " and " + globalSearchField + "=" + self.searchObj.id;
    // } else if (!IsUndefinedOrNull(self.searchText) && self.activeSelectField.selected) {
    //     globalSearchField = self.activeSelectField.selected.column_name;
    //     if (self.activeSelectField.selected && (self.activeSelectField.selected.column_type == 107 || self.activeSelectField.selected.column_type == 117)) {
    //         options.query += " and " + globalSearchField + "=" + self.searchText;
    //     } else {
    //         var urlQuery = globalSearchField + " like " + self.searchText;
    //         options.query += " and " + globalSearchField + " like '%" + self.searchText + "%'";
    //     }
    // }

    // if there is a query in url , add it to the options.query
    options.query += IsUndefinedOrNull(urlParameter.query) ? '' : " and " + urlParameter.query;

    options.query += IsUndefinedOrNull(configuration.restricted_query) ? '' : ' and ' + configuration.restricted_query;

    // If a filter is applied , add the query to options.query
    if (urlParameter.filter && Object.keys(urlParameter.filter).length && Array.isArray(configuration.userFilter)) {
        const activeFilter = configuration.userFilter.filter(function (filter) {
            return filter.id == urlParameter.filter.id;
        })[0];
        if (!urlParameter.query) {
            options.query += " and " + activeFilter.filter_query;
        }
    }

    // @TODO add query
    // options.query += IsUndefinedOrNull(configuration.query) ? "" : convertToQuery(configuration.query);

    // If currentUser is specified in the query replace it with the currentUsers id
    // options.query = options.query.replace("'currentUser'", currentUser.id);

    options.stats = (data.stats && IsUndefinedOrNull(urlParameter.query)) ? false : true;
    // To be used to fetch stats when user selects some query and then deselects it

    // @TODO dont fetch dictionary if already available
    options.dictionary = data.dictionary ? false : true;

    options.page = data.currentPage || options.page;
    options.limit = urlParameter.size || 20;

    if (urlParameter.scopes) {
        options.scopes = urlParameter.scopes;
    }

    /** 
     * Variable maintained to be used inside table factory
     * The applied query params was required to do an aggregation on the column
     */
    // self.listingOptions = options;

    // const result = await Get({ url: configuration.url, body: options });
    const url = BuildUrlForGetCall(configuration.url, options);
    Get({ url, callback: PrepareObjectForListing, extraParams: { callback, page: options.page, data, configuration, params }, persist: true });
}


/**
 * Invoked when actual data for listing is fetched to process further and again callbacks with final data and columns list
 * @param  {object} result
 * @param  {object} {extraParams}
 */
function PrepareObjectForListing(result, { extraParams }) {
    const { callback, page, data, configuration, params } = extraParams;
    if (result && result.response) {
        // self.dictionary = params.dictionary[params.starter];
        // if (columns && columns.length === 0) {
        //     self.orderColumns = params.dictionary[params.starter];
        // }
        // columns = GetColumnsForListing(params);

        // @TODO search columns
        // self.searchSupportedColumns = [];
        // for (var key in columns) {
        //     if (columns[key].path.split('.').length == 1) {
        //         self.searchSupportedColumns.push(columns[key]);
        //     }
        // }

        params.dictionary = result.dictionary || data.dictionary;

        if (result.hasOwnProperty("relationship")) {
            params.relationship = result.relationship;
        }

        // relationship = result.relationship ? result.relationship : null;
        // gatherObject(result.daDeta);
        // var modelName = self.configuration.model.name.toLowerCase();

        // Preparing the generic listing object
        const genericListingObj = {
            stats: result.stats || data.stats,
            dictionary: result.dictionary || data.dictionary,
            relationship: result.relationship || data.relationship, // modelName: self.configuration.formPreferenceName + '.form',
            listing: result.response,
            currentPage: page,
            pageName: configuration.pageName,
            starter: configuration.starter,
            includes: configuration.includes,
            state_name: configuration.listName,
            listName: configuration.listName + ".list",
            defaultOrder: configuration.order + ',' + configuration.sort,
            finalColumns: [],
            columns: GetColumnsForListing(params),
            selectedColumns: configuration.preference[configuration.listName + ".list"] ? JSON.parse(configuration.preference[configuration.listName + ".list"]) : null, // formPreference: configuration.preference[configuration.listName + '.form'] ? JSON.parse(configuration.preference[configuration.listName + '.form']) : null,
            nextActions: configuration.nextActions,
            // userFilter: configuration.userFilter,

            // module: configuration.module,
            // formPreference: configuration.preference[modelName + ".form"] ? JSON.parse(configuration.preference[modelName + ".form"]) : null,
            // modelName: configuration.model.name.toLowerCase() + ".form",
            // dataModel: configuration.model,
            // modelId: configuration.model.id,
            // callbackFunction: callFunction,
            // icon: configuration.image,
            // show: configuration.show,
            // userMethod: configuration.method,
            // multiSelect: configuration.multiSelect,
            // formPreferenceName: configuration.formPreferenceName,
            // preference: configuration.preference,
            // scripts: configuration.scripts,
            // restrictColumn: configuration.restrictColumnFilter,
            // restrictQuery: configuration.query,
            // url: configuration.url,
            // listingOptions: listingOptions,
            // scopes: data.scopes,
        };
        // Prepairing object for configure-filter directive
        // filterContent = {
        //     dictionary: dictionary,
        //     selectedColumns: genericListingObj.selectedColumns,
        //     restrictColumn: genericListingObj.restrictColumnFilter,
        //     scopes: genericListingObj.scopes
        // };

        // Build the final columns that is required for the portlet table
        genericListingObj.finalColumns = CreateFinalColumns(genericListingObj.columns, genericListingObj.selectedColumns, genericListingObj.relationship);
        if (typeof callback == 'function') {
            callback(genericListingObj);
        }
    }
}

/**
 * Returns default option for get call params
 */
export function GetDefaultOptions() {
    return {
        includes: '',
        order: 'id,asc',
        query: 'id=id',
        limit: 20,
        page: 1,
        stats: false,
        dictionary: false
    };
}


/**
 * everytime few variables are being initialized whenever api call is made to fetch data
 */
function Initialization(configuration, urlParameter = {}) {
    const sorts = ["desc", "asc"];
    return {
        includes: configuration.includes,
        dictionary: null,
        starter: configuration.starter,
        order: IsUndefinedOrNull(urlParameter.order) ? configuration.order : urlParameter.order,
        sort: SelectFromOptions(sorts, urlParameter.sort || configuration.sort)
    };
}
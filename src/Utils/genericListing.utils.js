
import { IsUndefinedOrNull, SelectFromOptions, BuildUrlForGetCall } from './common.utils';
import { GetColumnsForListing, ConvertToQuery, CreateFinalColumns, RegisterMethod, GetPreSelectedMethods } from './generic.utils';
import { Get } from './http.utils';

let tempQuery; // used to decide if stats is to be fetched from server

/**
* prepare query, pagination, and everything required according to
* url and menu detail, fetch data and passes them further to the components
* to show listing data
*/
export const GetListingRecord = async ({ configuration, queryString = {}, callback, data, currentUser = {} }) => {
    const params = Initialization(configuration, queryString);
    // const this = {};
    this.currentUser = currentUser;
    const options = GetDefaultOptions();

    params.page = queryString.page ? parseInt(queryString.page) : data.currentPage;
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
    options.query += IsUndefinedOrNull(queryString.query) ? '' : " and " + queryString.query;

    options.query += IsUndefinedOrNull(configuration.restricted_query) ? '' : ' and ' + ConvertToQuery.call(this, configuration.restricted_query);

    // If a filter is applied , add the query to options.query
    if (queryString.filter && Object.keys(queryString.filter).length && Array.isArray(configuration.userFilter)) {
        const activeFilter = configuration.userFilter.filter(function (filter) {
            return filter.id == queryString.filter;
        })[0];
        if (!queryString.query && activeFilter) {
            options.query += " and " + activeFilter.filter_query;
        }
    }

    // @TODO add query
    // options.query += IsUndefinedOrNull(configuration.query) ? "" : ConvertToQuery.bind(this)(configuration.query);

    // If currentUser is specified in the query replace it with the currentUsers id
    if (options.query.includes("'currentUser'") && currentUser.id) {
        options.query = options.query.replace("'currentUser'", currentUser.id);
    }

    options.stats = (data.stats && IsUndefinedOrNull(queryString.query) && tempQuery) ? false : true;
    tempQuery = IsUndefinedOrNull(queryString.query);
    // To be used to fetch stats when user selects some query and then deselects it

    // @TODO dont fetch dictionary if already available
    options.dictionary = data.dictionary ? false : true;

    options.page = queryString.page || options.page;
    options.limit = queryString.size || 20;

    if (queryString.scopes) {
        options.scopes = queryString.scopes;
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
        const modelName = configuration.model.name.toLowerCase();

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
            formPreference: configuration.preference[modelName + ".form"] ? JSON.parse(configuration.preference[modelName + ".form"]) : null,
            modelName: configuration.model.name.toLowerCase() + ".form",
            module: configuration.module,
            dataModel: configuration.model,
            // scopes: data.scopes,
            // restrictColumn: configuration.restrictColumnFilter,
            // userFilter: configuration.userFilter,
            // modelId: configuration.model.id,
            // callbackFunction: callFunction,
            // icon: configuration.image,
            // show: configuration.show,
            // userMethod: configuration.method,
            // multiSelect: configuration.multiSelect,
            // formPreferenceName: configuration.formPreferenceName,
            // preference: configuration.preference,
            // scripts: configuration.scripts,
            // restrictQuery: configuration.query,
            // url: configuration.url,
            // listingOptions: listingOptions,
        };
        // Prepairing object for configure-filter directive
        const filterContent = {
            dictionary: genericListingObj.dictionary[params.starter],
            selectedColumns: genericListingObj.selectedColumns,
            restrictColumns: configuration.restrictColumnFilter,
            scopes: data.scopes
        };

        // Build the final columns that is required for the portlet table
        genericListingObj.finalColumns = CreateFinalColumns(genericListingObj.columns, genericListingObj.selectedColumns, genericListingObj.relationship);
        genericListingObj.preDefinedmethods = GetPreSelectedMethods(genericListingObj.nextActions);
        genericListingObj.methods = RegisterMethod(genericListingObj.nextActions);
        if (typeof callback == 'function') {
            callback({ genericData: genericListingObj, filterContent });
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

import { Get, IsUndefinedOrNull, SelectFromOptions, BuildUrlForGetCall, TrimQueryString, IsObjectHaveKeys } from 'common-js-util';

import { GetParsedLayoutScript, GetColumnsForListing, ConvertToQuery, CreateFinalColumns, RegisterMethod, GetPreSelectedMethods, ParseRestrictedQuery } from './generic.utils';

import { ROUTE_URL } from './../Constants/global.constants';

let tempQuery; // used to decide if stats is to be fetched from server

/**
* prepare query, pagination, and everything required according to
* url and menu detail, fetch data and passes them further to the components
* to show listing data
*/
export const GetListingRecord = async ({ configuration, queryString = {}, callback, data, currentUser = {}, index, isTab }) => {
    const params = Initialization(configuration, queryString);
    // const this = {};
    this.currentUser = currentUser;
    let options = GetDefaultOptions();

    params.page = queryString.page ? parseInt(queryString.page) : data.currentPage;
    if (params.includes) {
        options.includes = params.includes;
    }
    options.order = params.order + "," + params.sort;

    if (queryString.search) {
        options.query += ' and ' + queryString.search;
    }
    // @TODO search functionality
    // Add the input field on the generic listing page to query
    // if (self.searchObj && self.searchObj.hasOwnProperty("id")) {
    //     // @todo Should improve this , too much of manual
    //     globalSearchField = self.activeSelectField.selected.name;
    //     options.query += " and " + globalSearchField + "=" + self.searchObj.id;
    // } else if (!IsUndefinedOrNull(self.searchText) && self.activeSelectField.selected) {
    //     globalSearchField = self.activeSelectField.selected.name;
    //     if (self.activeSelectField.selected && (self.activeSelectField.selected.column_type == 107 || self.activeSelectField.selected.column_type == 117)) {
    //         options.query += " and " + globalSearchField + "=" + self.searchText;
    //     } else {
    //         var urlQuery = globalSearchField + " like " + self.searchText;
    //         options.query += " and " + globalSearchField + " like '%" + self.searchText + "%'";
    //     }
    // }

    // if there is a query in url , add it to the options.query
    options.query += IsUndefinedOrNull(queryString.query) ? '' : " and " + queryString.query;

    const restricted_query = configuration.restricted_query || configuration.query;
    options.query += IsUndefinedOrNull(restricted_query) ? '' : ' and ' + ConvertToQuery.call(this, restricted_query);
    options.request_identifier = data.request_identifier;
    // If a filter is applied , add the query to options.query

    /****************************************************
     * @TODO based on layout id of urlparam, select query
     ***************************************************/
    // let layout;
    if (queryString.layout) {
        options.layout_id = queryString.layout
    } else if (data.layout && data.layout.id) {
        options.layout_id = data.layout.id;
    } else if (configuration.layout && configuration.layout.id) {
        options.layout_id = configuration.layout.id;
    }
    // options.layout_id = 9;
    if (queryString.layout && Object.keys(queryString.layout).length && Array.isArray(configuration.layouts)) {
        const activeLayout = configuration.layouts.filter(function (layout) {
            return layout.id == queryString.layout;
        })[0];
        if (!queryString.query && activeLayout && activeLayout.query) {
            options.query += " and " + activeLayout.query;
            configuration.layout = activeLayout;
        }
    }

    // @TODO add query
    // options.query += IsUndefinedOrNull(configuration.query) ? "" : ConvertToQuery.bind(this)(configuration.query);

    // If currentUser is specified in the query replace it with the currentUsers id
    if (options.query.includes("'currentUser'") && currentUser.id) {
        options.query = options.query.replace("'currentUser'", currentUser.id);
    }

    options.stats = (data.stats && IsUndefinedOrNull(queryString.query) && tempQuery) ? false : true;
    tempQuery = IsUndefinedOrNull(queryString.query) || IsUndefinedOrNull(queryString.search);
    // To be used to fetch stats when user selects some query and then deselects it

    // @TODO dont fetch dictionary if already available
    options.dictionary = data.dictionary ? false : true;

    options.page = queryString.page || options.page;
    options.limit = queryString.limit || 20;

    if (queryString.scopes) {
        options.scopes = queryString.scopes;
    }

    /** 
     * Variable maintained to be used inside table factory
     * The applied query params was required to do an aggregation on the column
     */
    // self.listingOptions = options;

    options = TrimQueryString(options);

    // const result = await Get({ url: configuration.url, body: options });
    const url = BuildUrlForGetCall(configuration.url, options);
    return Get({ url, callback: PrepareObjectForListing, extraParams: { callback, page: options.page, limit: options.limit, data, configuration, params, index, currentUser, isTab }, persist: true, urlPrefix: ROUTE_URL });
}


/**
 * Invoked when actual data for listing is fetched to process further and again callbacks with final data and columns list
 * @param  {object} result
 * @param  {object} {extraParams}
 */
function PrepareObjectForListing(result, { extraParams }) {
    const { callback, page, limit, data, configuration, params, index, currentUser, isTab } = extraParams;
    if (result.success && result.response) {

        const { data: apiData, dictionary, relationship, stats, request_identifier, model_hash: modelHash } = result.response;
        let { base } = result.response;
        base = base || data.starter;
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

        params.dictionary = dictionary && Object.keys(dictionary).length ? dictionary : data.dictionary;
        params.relationship = relationship && Object.keys(relationship).length ? relationship : data.relationship;

        const restrictedQuery = ParseRestrictedQuery(configuration.restricted_query);
        if (IsObjectHaveKeys(restrictedQuery)) {
            let baseDictionary = params.dictionary[base];
            const restrictedColumns = Object.keys(restrictedQuery);
            baseDictionary = baseDictionary.filter(column => column && restrictedColumns.indexOf(column.name) == -1);

            params.dictionary[base] = baseDictionary;
        }



        // if (relationship && typeof Object.keys(relationship).length) {
        //     params.relationship = relationship;
        // }

        params.includesList = Object.keys(params.dictionary);

        const model = params.relationship[base];
        const modelName = model.name.toLowerCase();

        let modelAliasId;
        if (isTab) {
            modelAliasId = configuration.menuId;
        }

        let formPreference = {};
        let formPreferences = [];
        if (IsObjectHaveKeys(configuration.form_layouts)) {
            formPreferences = GetParsedLayoutScript(configuration.form_layouts);
            // formPreference = formPreferences[0] || {};
        } else {
            formPreferences = GetParsedLayoutScript(model.form_layouts);   
        }

        formPreference = formPreferences[0] || {};

        if (IsObjectHaveKeys(formPreference)) {
            if (typeof formPreference.column_definition == 'object') {
                formPreference.column_definition = formPreference.column_definition;
            } else {
                formPreference.column_definition = JSON.parse(formPreference.column_definition);
            }
        }

        // Preparing the generic listing object
        const genericListingObj = {
            stats: stats || data.stats,
            dictionary: params.dictionary,
            relationship: params.relationship, // modelName: self.configuration.formPreferenceName + '.form',
            listing: apiData,
            currentPage: page,
            limit,
            pageName: configuration.pageName,
            starter: base,
            model,
            modelAliasId,
            // state_name: configuration.listName,
            // listName: configuration.listName + ".list",
            includes: configuration.includes,
            defaultOrder: configuration.order + ',' + configuration.sort,
            finalColumns: [],
            columns: GetColumnsForListing({ ...params, ...{ isArray: false } }),
            // @TODO uncomment this line to get selectedColumn
            layout: configuration.layout || {},
            // layout: configuration.preference[configuration.listName + ".list"] ? JSON.parse(configuration.preference[configuration.listName + ".list"]) : null, // formPreference: configuration.preference[configuration.listName + '.form'] ? JSON.parse(configuration.preference[configuration.listName + '.form']) : null,
            nextActions: [...model.actions, ...configuration.uiActions],
            // nextActions: model.actions,
            formPreference,
            formPreferences,
            url: configuration.url,
            // formPreference: configuration.preference[modelName + ".form"] ? JSON.parse(configuration.preference[modelName + ".form"]) : null,
            // modelName: configuration.model.name.toLowerCase() + ".form",
            // module: configuration.module,
            dataModel: modelName,
            userFilter: configuration.layouts,
            userId: currentUser ? currentUser.id : null,
            menuId: configuration.menuId,
            modelId: model.id,
            request_identifier,
            modelHash
            // userFilter: configuration.userFilter,
            // scopes: data.scopes,
            // restrictColumn: configuration.restrictColumnFilter,
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
            dictionary: Object.values(genericListingObj.columns),
            // dictionary: genericListingObj.dictionary[params.starter],
            layout: genericListingObj.layout,
            restrictColumns: configuration.restrictColumnFilter,
            scopes: data.scopes
        };

        // Build the final columns that is required for the portlet table
        genericListingObj.finalColumns = CreateFinalColumns(genericListingObj.columns, genericListingObj.layout.column_definition, genericListingObj.relationship);
        genericListingObj.preDefinedmethods = GetPreSelectedMethods(genericListingObj.nextActions);
        genericListingObj.methods = RegisterMethod(genericListingObj.nextActions);
        if (typeof callback == 'function') {
            callback({ genericData: genericListingObj, filterContent, index });
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
        // query: 'id=id',
        query: '',
        limit: 20,
        page: 1,
        list: true,
        stats: false,
        dictionary: false,
        // layout_id: 1
    };
}


/**
 * everytime few variables are being initialized whenever api call is made to fetch data
 */
function Initialization(configuration, urlParameter = {}) {
    const sorts = ["desc", "asc"];
    return {
        includes: Array.isArray(configuration.includes) ? configuration.includes.join(',') : configuration.includes,
        dictionary: null,
        // starter: configuration.starter,
        order: IsUndefinedOrNull(urlParameter.order) ? configuration.order : urlParameter.order,
        sort: SelectFromOptions(sorts, urlParameter.sort || configuration.sort)
    };
}
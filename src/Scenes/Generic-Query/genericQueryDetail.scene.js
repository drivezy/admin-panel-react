import React, { Component } from 'react';

import './genericQueryDetail.scene.css';


import Dashboard from './../../Components/Query-Report/Dashboard/dashboard.component';
import QueryHeader from './../../Components/Query-Report/Query-Header/queryHeader.component';
import DynamicFilter from './../../Components/Dynamic-Filter/dynamicFilter.component';
import QueryTableSettings from './../../Components/Query-Report/Query-Table-Settings/queryTableSettings.component';
import QueryPredefinedFilter from './../../Components/Query-Report/Query-Predefined-Filter/queryPredefinedFilter.component';
import QueryConfigureDynamicFilter from './../../Components/Query-Report/Query-Configure-Filter/queryConfigureFilter.component';
import DashboardForm from './../../Components/Query-Report/Dashboard-Form/dashboardForm.component';
import QueryTable from './../../Components/Query-Report/Query-Table/queryTable.component';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import { Get, Post } from 'common-js-util';
import ListingPagination from './../../Components/Listing-Pagination/listingPagination.component';
import { GetUrlParams, Location } from 'drivezy-web-utils/build/Utils/location.utils';
import { QueryData } from './../../Utils/query.utils';
import { GetPreferences } from './../../Utils/preference.utils';
import { BuildUrlForGetCall, IsObjectHaveKeys } from './../../Utils/common.utils';
import { GetColumnsForListing, CreateFinalColumns, GetDefaultOptionsForQuery } from './../../Utils/query.utils';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import { GetLookupValues } from './../../Utils/lookup.utils';

import ListingSearch from './../../Components/Listing-Search/listingSearch.component';
import { SubscribeToEvent, UnsubscribeEvent, StoreEvent, DeleteEvent } from 'common-js-util';
import { ConvertLiteral } from './../../Utils/time.utils';

export default class GenericQueryDetail extends Component {
    filterContent = {};
    urlParams = Location.search();
    formContent = {};

    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props),
            formContent: {},
            useQueryTable: true,
            dateLiterals: [],
            operators: [],
            queryParamsData: {},
            queryListing: {},
            preference: {},
            stats: {},
            columns: [],
            currentPage: 1,
            limit: 20,
            finalColumns: [],
            isTab: null,
            resultData: {},
            localSearch: {},
            filterContent: null,
            isCollapsed: false,
            arrowstate: 'show',
            arrow: 'down',
            loading: true,
            actions: []

        };
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    componentDidMount = async () => {
        const { queryParamsData } = this.state

        this.getDateLiterals().then(() => {
            this.getOperators().then(() => {
                this.getQueryParamsData();
            })
        })

        const result = await Get({ url: 'userPreference', parameter: queryParamsData.short_name + "list" });
        result.response[0].column_definition = JSON.parse(result.response[0].value);
        const layout = result.response[0];
        this.setState({ layout: layout });

    }

    refreshPage() {
        this.getDataForListing();
    }

    layoutChanges = (layout) => {
        let { queryParamsData, columns } = this.state;
        queryParamsData.layout = layout;
        if (layout && layout.column_definition) {
            const finalColumns = CreateFinalColumns(columns, layout.column_definition);
            // this.setState({ queryParamsData });
            this.state.queryParamsData = queryParamsData;
            this.setState({ finalColumns: finalColumns });
            console.log(layout)
            // this.getDataForListing();
            this.setState({ layout });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (IsObjectHaveKeys(this.state.queryParamsData)) {
            const newProps = GetUrlParams(nextProps);

            // this.state.params = newProps.params;

            const formContent = { ...this.state.formContent, ...newProps.queryString };

            this.setState({ formContent });
            // this.state.queryString = newProps.queryString;
            // this.setState({ currentPage: this.state.queryString.page ? this.state.queryString.page : 1, limit: this.state.queryString.limit ? this.state.queryString.limit : 20 })
            this.getDataForListing(formContent);
        }
    }

    userDataArrived = (user) => {
        const { menuDetail, queryParamsData } = this.state;
        this.state.currentUser = user;

        if (queryParamsData) {
            this.state.filterContent = queryParamsData.filterContent;
            this.state.menuDetail = menuDetail;
            // this.state.loading = false;
            return;
        } else if (menuDetail) {
            this.state.menuDetail = menuDetail;
            // this.setState({ menuDetail });
            this.getDataForListing();
        } else {
            this.getQueryParamsData();
        }
    }

    getQueryParamsData = async () => {              //Get all the data 
        const { id } = this.props.match.params;
        const result = await QueryData(id);
        if (result.success) {
            let queryParamsData = result.response;

            let prefName = queryParamsData.short_name + ".list";

            let preferences = await GetPreferences(prefName);

            var preference = preferences.response.filter(function (item) {
                return item.parameter == prefName;
            })

            // Short Name
            this.formContent.query_name = queryParamsData.short_name;

            // For each parameter add the default value for submission 
            queryParamsData.parameters.forEach((parameter) => {
                var matchingValue = this.replaceLiterals(parameter.default_param_value);
                if (matchingValue) {
                    this.formContent[parameter.param] = ConvertLiteral(matchingValue.description);
                } else {
                    this.formContent[parameter.param] = parameter.default_param_value;
                }
            });


            // Set state with the loaded values
            this.setState({ preference: preference, queryParamsData, actions: queryParamsData.actions });

            let options = this.getParamsFromUrl(this.formContent);

            // Get the reports data for the formContent
            this.getDataForListing(options);

        }
    }

    getParamsFromUrl = (params) => {
        const urlParams = GetUrlParams(this.props);

        const { queryString } = urlParams;

        let formContent = {};

        formContent.from = queryString.from || params.from;
        formContent.to = queryString.to || params.to;

        if (queryString.group_column) {
            formContent.group_column = queryString.group_column;
        } else {
            formContent.group_column = '';
        }

        if (queryString.aggregate_column) {
            formContent.aggregate_column = JSON.parse(queryString.aggregate_column);
        } else {
            formContent.aggregate_column = [];
        }

        // Code for showing saved dashboard should come below 
        return formContent;
    }


    /**
     * Replace the literals with matching lookup value
     */
    replaceLiterals = (entry) => this.state.dateLiterals.filter((item) => item.name == entry).pop();

    getDateLiterals = async () => {
        const result = await GetLookupValues(102);
        if (result.success) {
            const dateLiterals = result.response;
            this.setState({ dateLiterals })
        }
    }

    getOperators = async () => {
        const result = await GetLookupValues(90);
        if (result.success) {
            const operators = result.response;
            this.setState({ operators })
        }
    }

    getDataForListing = async (formContent) => {
        const { preference, params } = this.state;

        const queryParamsData = this.state.queryParamsData;

        formContent.query_name = queryParamsData.short_name;

        // if (formContent.aggregate_column) {
        //     formContent.aggregate_column = JSON.parse(formContent.aggregate_column);
        // }

        // If there is a groupColumn or aggregateCoumn then disable useQueryTable
        if ((formContent.group_column && formContent.group_column != '') || (formContent.aggregate_column && formContent.aggregate_column != '')) {
            this.state.useQueryTable = false;
        }


        // let options = GetDefaultOptionsForQuery();
        let options = { includes: '', order: '1,asc', query: '', limit: this.state.limit, page: this.state.currentPage, dictionary: false, stats: true }

        const url = BuildUrlForGetCall("getReportData", options);

        const result = await Post({ url, body: formContent });
        if (result.success) {
            const queryListing = result.response;

            this.setState({ formContent: formContent, queryListing: queryListing });

            let stats = result.stats ? result.stats : stats;
            params.dictionary = result.dictionary ? result.dictionary : params.dictionary;
            params.includes = "";
            params.starter = this.state.queryParamsData.short_name;


            let tempColumns = GetColumnsForListing(params);

            let finalColumns;


            if (preference.length) {
                finalColumns = CreateFinalColumns(tempColumns, JSON.parse(preference[0].value));
            }

            this.setState({ stats, params, columns: tempColumns, finalColumns, stats });

            this.gatherData(result.response);

        }
    }

    gatherData = () => {
        const { queryListing = {}, queryParamsData = {}, stats, currentPage, params, columns } = this.state;
        let resultData = {
            columns: columns,
            listing: queryListing,
            selectedColumns: queryParamsData.short_name + ".list",
            listName: queryParamsData.short_name + ".list",
            pageName: queryParamsData.name,
            stats: stats,
            currentPage: currentPage,
            dictionary: params.dictionary[params.starter],
            restrictColumn: "",
        };
        this.state.loading = false;
        this.setState({ resultData: resultData });
    }

    toggleMenu = (arrowstate, arrow) => {
        const { isCollapsed } = this.state;
        this.setState({ isCollapsed: !isCollapsed });
        if (arrowstate == 'show')
            this.setState({ arrowstate: 'hide', arrow: 'up' });
        else
            this.setState({ arrowstate: 'show', arrow: 'down' });
        // StoreEvent({ eventName: 'ToggleAdvancedFilter', data: { isCollapsed: !isCollapsed, ...payload } });
    }

    toggleAdvancedFilter = (payload) => {
        const { isCollapsed } = this.state;
        this.setState({ isCollapsed: !isCollapsed });
        StoreEvent({ eventName: 'ToggleAdvancedFilter', data: { isCollapsed: !isCollapsed, ...payload } });

    }

    addFilter = () => {
        ModalManager.openModal({
            headerText: 'Input Form',
            modalBody: () => (
                <div className="metrics-form">
                    Form content
                </div>
            ),
        });
    }

    /**
     * Maintain localSearch for locally searching on type 
     */
    filterLocally = (column, value) => {
        console.log(column);
        this.setState({ localSearch: { field: column ? column.column_name : '', value: value ? value : null } });
    }

    render() {

        const { formContent, useQueryTable, localSearch, operators, arrowstate, arrow, queryParamsData = {}, preference, columns, params, finalColumns, resultData, currentPage, stats, isTab, layout, loading } = this.state;

        const { history, match, parentData } = this.props;

        let filteredResults = [];

        if (localSearch.value) {
            filteredResults = resultData.listing.filter(entry => entry[localSearch.field] && (entry[localSearch.field].toString().toLowerCase().indexOf(localSearch.value) != -1));
        }

        let filterContent = {};

        return (
            <div className="generic-query">
                {
                    loading ?
                        <div className="loading-text">
                            <h6>
                                Loading content
                                </h6>
                        </div> :
                        <div className="page-content">


                            <div className="page-bar">
                                <div className="listing-tools left">
                                    <div className="search-box-wrapper">
                                        <ListingSearch
                                            localSearch={localSearch}
                                            onEdit={this.filterLocally}
                                            searchQuery={this.urlParams.search}
                                            dictionary={resultData.dictionary}
                                        />
                                    </div>
                                    <div className="dynamic-filter-wrapper">

                                        {
                                            params && params.dictionary
                                            &&
                                            <DynamicFilter
                                                toggleAdvancedFilter={this.toggleAdvancedFilter}    //@Done
                                                //menuUpdatedCallback={this.predefinedFiltersUpdated}
                                                selectedColumns={this.state.layout ? this.state.layout.column_definition : null} //@Done
                                                menuId={this.props.menuId}  //@Done
                                                currentUser={this.state.layout.user_id} //@Done
                                                dictionary={params.dictionary.invoice_details}   //@done
                                                layouts={this.layout}   //@Done
                                                // restrictedQuery={menuDetail.restricted_query}
                                                // restrictedColumn={menuDetail.restrictColumnFilter}
                                                history={history}   //@Done
                                                match={match}   //@Done
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="listing-tools right">
                                    <div className="portlet-tools">


                                        {

                                            resultData && resultData.listName && resultData.columns && // finalColumns && 
                                            <QueryTableSettings

                                                listName={resultData.listName}
                                                columns={resultData.columns}
                                                selectedColumns={preference}
                                                onSubmit={this.layoutChanges}
                                                preference={this.state.preference}

                                            />
                                        }
                                        <button className="refresh-button btn btn-sm" onClick={() => { this.refreshPage() }}>
                                            <i className="fa fa-refresh"></i>
                                        </button>
                                        {
                                            resultData && queryParamsData.user_filter &&
                                            <QueryPredefinedFilter
                                                listingObject={resultData}
                                                finalColumns={finalColumns}
                                                filters={queryParamsData.user_filter}
                                            />
                                        }

                                    </div>



                                </div>

                            </div>

                            <div className="configure-filter-wrapper">
                                <div>

                                    {/* {filterContent &&
                                <QueryConfigureDynamicFilter
                                    history={history}
                                    match={match}
                                //    filters={genericData.userFilter} //@Todo Check the data required. And designthe function
                                //    content={filterContent}   //@Todo --dittoo--
                                      dictionary={params.dictionary.invoice_details}
                                      layout={layout}
                                
                                />} */}
                                </div>
                            </div>

                            <div className="query-details">
                                <div className="query-header">
                                    <div className="header-content">
                                        {
                                            <div className="content-name"> {queryParamsData.name} </div>
                                        }
                                    </div>
                                    {/* <div className="metrics-container">
                            {
                                <div className="metrics-wrapper">
                                    <button className="metrics cursor-pointer" onClick={() => this.toggleMenu(arrowstate, arrow)}>
                                        <i className={`fa fa-arrow-${arrow}`}>&nbsp;{arrowstate} metrics</i>
                                    </button>
                                </div>
                            }
                        </div> */}

                                </div>
                                {/* {
                        this.state.isCollapsed &&
                        <div className="active-filters-container">
                            <div className="active-filters">
                                <button className="btn btn-lg btn-primary" onClick={(e) => { e.preventDefault(); this.addFilter(); }}><i className="fa fa-plus"></i></button>
                            </div>
                        </div>
                    } */}
                            </div>

                            <div className="reports-content">

                                {
                                    !(queryParamsData.comparable == 0 && queryParamsData.parameters && queryParamsData.parameters.length == 0) &&
                                    // queryParamsData.parameters &&
                                    <DashboardForm
                                        operators={operators}
                                        // savedDashboard={savedDashboard}
                                        // queryTable={useQueryTable}
                                        queryData={queryParamsData}
                                        columns={columns}
                                        formContent={formContent}
                                        fields={queryParamsData.parameters}
                                    />
                                }


                                {/* When GroupColumn//Aggregations are active we use queryTable */}

                                {
                                    useQueryTable && resultData.listing && finalColumns &&
                                    <QueryTable
                                        // formContent={formContent}
                                        finalColumns={finalColumns}
                                        listing={resultData.listing}
                                        queryTableObj={resultData}
                                        queryData={queryParamsData}
                                        actions={this.state.actions}
                                    />
                                }

                                {/* Else Dashboard */}

                                {!useQueryTable && <Dashboard formContent={formContent} tableContents={resultData.listing} />}

                                {
                                    (resultData.stats) ?
                                        <ListingPagination
                                            history={history}
                                            match={match}
                                            current_page={this.state.currentPage}
                                            limit={this.state.limit}
                                            statsData={stats}
                                        />
                                        : <div className="noListMessage">Looks like no columns are selected , Configure it by pressing the settings icon.</div>
                                }
                            </div>
                        </div>
                }
            </div>
        )
    }
}
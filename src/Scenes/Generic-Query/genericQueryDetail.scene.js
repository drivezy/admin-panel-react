import React, { Component } from 'react';

import './genericQueryDetail.scene.css';
import QueryHeader from './../../Components/Query-Report/Query-Header/queryHeader.component';
import DynamicFilter from './../../Components/Dynamic-Filter/dynamicFilter.component';
import QueryTableSettings from './../../Components/Query-Report/Query-Table-Settings/queryTableSettings.component';
import QueryPredefinedFilter from './../../Components/Query-Report/Query-Predefined-Filter/queryPredefinedFilter.component';
import QueryConfigureDynamicFilter from './../../Components/Query-Report/Query-Configure-Filter/queryConfigureFilter.component';
import QueryDashboardForm from './../../Components/Query-Report/Query-Dashboard-Form/queryDashboardForm.component';
import QueryTable from './../../Components/Query-Report/Query-Table/queryTable.component';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import { Get } from './../../Utils/http.utils';
import ListingPagination from './../../Components/Listing-Pagination/ListingPagination';
import { GetUrlParams, Location } from './../../Utils/location.utils';
import { QueryData } from './../../Utils/query.utils';
import { GetPreferences } from './../../Utils/preference.utils';
import { BuildUrlForGetCall, IsObjectHaveKeys } from './../../Utils/common.utils';
import { Post } from './../../Utils/http.utils';
import { GetColumnsForListing, CreateFinalColumns, GetDefaultOptionsForQuery } from './../../Utils/query.utils';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';


import ListingSearch from './../../Components/Listing-Search/listingSearch.component';
import { SubscribeToEvent, UnsubscribeEvent, StoreEvent, DeleteEvent } from './../../Utils/stateManager.utils';


export default class GenericQueryDetail extends Component {
    filterContent = {};
    urlParams = Location.search();

    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props),
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
            loading: true ,
            actions: []
            
        };
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    componentDidMount = async () => {
        this.getQueryParamsData();
        const result = await Get({ url: 'userPreference', parameter: "invoice_details.list" });
        result.response[18].column_definition = JSON.parse(result.response[18].value);
        console.log(result.response[18]);
        const layout = result.response[18];
        this.setState({ layout: layout });
        console.log(this.state.layout);

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
            this.setState({ finalColumns });
            console.log(layout)
            // this.getDataForListing();
            this.setState({ layout });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (IsObjectHaveKeys(this.state.queryParamsData)) {


            const newProps = GetUrlParams(nextProps);
            this.state.params = newProps.params;
            this.state.queryString = newProps.queryString;
            this.setState({ currentPage: this.state.queryString.page ? this.state.queryString.page : 1, limit: this.state.queryString.limit ? this.state.queryString.limit : 20 })
            this.getDataForListing();
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
        const { queryId } = this.props.match.params;
        const result = await QueryData(queryId);
        if (result.success) {
            let queryParamsData = result.response;
            console.log(queryParamsData);
            this.setState({queryParamsData});

            let prefName = queryParamsData.short_name + ".list";
            console.log(queryParamsData);
            let preferences = await GetPreferences(prefName);
            
            var preference = preferences.response.filter(function (item) {
                return item.parameter == prefName;
            })

//            let preference = preferences.response.filter((item) => {return item.parameter == prefName} );

            

            

            this.setState({preference: preference});
            // this.setState(queryParamsData);
            console.log(preference);
            this.getDataForListing();

            this.setState({actions: queryParamsData.actions});
        }
    }

    getDataForListing = async () => {
        const { queryParamsData, preference, params } = this.state;

        // let options = GetDefaultOptionsForQuery();
        let options = { includes: '', order: '1,asc', query: '', limit: this.state.limit, page: this.state.currentPage, dictionary: false, stats: true }

        const url = BuildUrlForGetCall("getReportData", options);

        const result = await Post({ url, body: { month: "2016-07", query_name: "invoice_details" } });
        if (result.success) {
            const queryListing = result.response;
            this.setState({ queryListing });


            let stats = result.stats ? result.stats : stats;
            params.dictionary = result.dictionary ? result.dictionary : params.dictionary;
            params.includes = "";
            params.starter = queryParamsData.short_name;


            let tempColumns = GetColumnsForListing(params);

            let finalColumns;


            if (preference.length) {
                finalColumns = CreateFinalColumns(tempColumns, JSON.parse(preference[0].value));
                console.log(finalColumns);
            }

            this.setState({ stats, params, columns: tempColumns, finalColumns, stats });

            this.gatherData(result.response);

            // return Get({ url, queryString: { page } });
            console.log(GetUrlParams(this.props));
            console.log(queryParamsData);
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
        this.setState({ resultData });
    }

    // toggleMenu = (arrowstate, arrow) => {
    //     const { isCollapsed } = this.state;
    //     this.setState({ isCollapsed: !isCollapsed });
    //     if (arrowstate == 'show')
    //         this.setState({ arrowstate: 'hide', arrow: 'up' });
    //     else
    //         this.setState({ arrowstate: 'show', arrow: 'down' });
    //     // StoreEvent({ eventName: 'ToggleAdvancedFilter', data: { isCollapsed: !isCollapsed, ...payload } });
    // }

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
        this.setState({ localSearch: { field: column ? column.name : '', value: value ? value : null } });
    }

    render() {

        const { localSearch, arrowstate, arrow, queryParamsData = {}, preference, columns, params, finalColumns, resultData, currentPage, stats, isTab, layout, loading } = this.state;

        const { history, match, parentData } = this.props;

        let filteredResults = [];

        let filterContent = {};


        // if (localSearch.value) {
        //     filteredResults = listing.filter(entry => entry[starter + '.' + localSearch.field] && (entry[starter + '.' + localSearch.field].toString().toLowerCase().indexOf(localSearch.value) != -1));
        // }
        console.log(this.state.layout);
        return (
            <div className="generic-query">
                <div className="page-bar">
                    <div className="listing-tools left">
                        <div className="search-box-wrapper">
                            <ListingSearch localSearch={localSearch} onEdit={this.filterLocally} searchQuery={this.urlParams.search} dictionary={params.dictionary} />
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

                                resultData && finalColumns && resultData.listName && resultData.columns && preference &&
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
                    {!loading ?
                        <div>
                            {/* {console.log(params.dictionary.invoice_details)}
                            {this.setState.filterContent = params.dictionary}
                            {console.log(filterContent)} */}

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
                        : <div>Loading</div>}
                </div>

                <div className="query-details">
                    <div className="query-header">
                        <div className="header-content">
                            {
                                <div className="content-name"> {queryParamsData.name} </div>
                            }
                        </div>
                        <div className="metrics-container">
                            {
                                <div className="metrics-wrapper">
                                    <button className="metrics cursor-pointer" onClick={() => this.toggleMenu(arrowstate, arrow)}>
                                        <i className={`fa fa-arrow-${arrow}`}>&nbsp;{arrowstate} metrics</i>
                                    </button>
                                </div>
                            }
                        </div>

                    </div>
                    {
                        this.state.isCollapsed &&
                        <div className="active-filters-container">
                            {/* <div className="active-filters">
                                <button className="btn btn-lg btn-primary" onClick={(e) => { e.preventDefault(); this.addFilter(); }}><i className="fa fa-plus"></i></button>
                            </div> */}
                        </div>
                    }
                </div>

                <div className="reports-content">

                    {
                        !(queryParamsData.comparable == 0 && queryParamsData.parameters && queryParamsData.parameters.length == 0) &&
                        // queryParamsData.parameters &&
                        <QueryDashboardForm
                            // savedDashboard={savedDashboard}
                            // queryTable={useQueryTable}
                            queryData={queryParamsData}
                            columns={columns}
                            // formContent={formContent}
                            fields={queryParamsData.parameters}
                        />
                    }

                    {
                        resultData.listing && finalColumns &&
                        <QueryTable
                            // formContent={formContent}
                            finalColumns={finalColumns}
                            listing={resultData.listing}
                            queryTableObj={resultData}
                            queryData={queryParamsData}
                            actions={this.state.actions}
                        />
                        


                    }
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

        )
    }
}
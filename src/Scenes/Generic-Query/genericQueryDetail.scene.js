import React, { Component } from 'react';

import './genericQueryDetail.scene.css';

import QueryTableSettings from './../../Components/Query-Report/Query-Table-Settings/queryTableSettings.component';
import QueryPredefinedFilter from './../../Components/Query-Report/Query-Predefined-Filter/queryPredefinedFilter.component';
import QueryDashboardForm from './../../Components/Query-Report/Query-Dashboard-Form/queryDashboardForm.component';
import QueryTable from './../../Components/Query-Report/Query-Table/queryTable.component';

import ListingPagination from './../../Components/Listing-Pagination/ListingPagination';

import { QueryData } from './../../Utils/query.utils';
import { GetPreferences } from './../../Utils/preference.utils';
import { BuildUrlForGetCall } from './../../Utils/common.utils';
import { Post } from './../../Utils/http.utils';
import { GetColumnsForListing, CreateFinalColumns, GetDefaultOptionsForQuery } from './../../Utils/query.utils';

export default class GenericQueryDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            queryParamsData: {},
            queryListing: {},
            preference: {},
            stats: {},
            currentPage: 1,
            params: {},
            columns: [],
            finalColumns: [],
            resultData: {}
        };
    }

    componentDidMount() {
        this.getQueryParamsData();
    }

    getQueryParamsData = async () => {
        const { queryId } = this.props.match.params;
        const result = await QueryData(queryId);
        if (result.success) {
            let queryParamsData = result.response;
            console.log(queryParamsData);
            this.setState({ queryParamsData });

            let prefName = queryParamsData.short_name + ".list";

            let preferences = await GetPreferences(prefName);

            var preference = preferences.response.filter(function (item) {
                return item.parameter == prefName;
            })

            console.log(preference);

            this.setState({ queryParamsData, preference });

            this.getDataForListing();
        }
    }

    getDataForListing = async () => {
        const { queryParamsData, preference, params } = this.state;
        let options = GetDefaultOptionsForQuery();

        const url = BuildUrlForGetCall("getReportData", options);

        const result = await Post({ url, body: { month: "2016-07", query_name: "invoice_details" } });
        if (result.success) {
            const queryListing = result.response;
            this.setState({ queryListing });


            let stats = result.stats ? result.stats : stats;
            params.dictionary = result.dictionary ? result.dictionary : params.dictionary;
            params.includes = "";
            params.starter = queryParamsData.short_name;
            let currentPage = params.page ? params.page : 1;

            let tempColumns = GetColumnsForListing(params);

            let finalColumns;

            if (preference) {
                finalColumns = CreateFinalColumns(tempColumns, JSON.parse(preference[0].value));
            }

            this.setState({ stats, currentPage, params, columns: tempColumns, finalColumns, stats });

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

        this.setState({ resultData });
    }

    render() {

        const { queryParamsData = {}, preference, columns, finalColumns, resultData, currentPage, stats } = this.state;

        const { history, match } = this.props;

        return (
            <div className="generic-query">
                <div className="page-bar">
                    <div className="listing-tools left">
                        <div className="search-box-wrapper">

                        </div>
                        <div className="dynamic-filter-wrapper">

                        </div>
                    </div>
                    <div className="listing-tools right">
                        <div className="portlet-tools">

                            {
                                resultData &&
                                <QueryTableSettings
                                    finalColumns={finalColumns}
                                    listName={resultData.listName}
                                    columns={resultData.columns}
                                    selectedColumns={preference}
                                />
                            }

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
                <div className="query-details">
                    <div className="query-header">
                        <div className="header-content">
                            <h6>{queryParamsData.name}</h6>
                        </div>
                    </div>
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
                        resultData.listing &&
                        <QueryTable
                            // formContent={formContent}
                            finalColumns={finalColumns}
                            listing={resultData.listing}
                            queryTableObj={resultData}
                            queryData={queryParamsData}
                        />


                    }
                    {
                        (resultData.stats) ?
                            <ListingPagination
                                history={history}
                                match={match}
                                current_page={currentPage}
                                limit={20}
                                statsData={stats}
                            />
                            : <div className="noListMessage">Looks like no columns are selected , Configure it by pressing the settings icon.</div>
                    }



                </div>

            </div>

        )
    }
}
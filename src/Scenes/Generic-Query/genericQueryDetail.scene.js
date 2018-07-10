import React, { Component } from 'react';

import './genericQueryDetail.scene.css';

import QueryTableSettings from './../../Components/Query-Report/Query-Table-Settings/queryTableSettings.component';
import QueryPredefinedFilter from './../../Components/Query-Report/Query-Predefined-Filter/queryPredefinedFilter.component';
import QueryDashboardForm from './../../Components/Query-Report/Query-Dashboard-Form/queryDashboardForm.component';
import QueryTable from './../../Components/Query-Report/Query-Table/queryTable.component';

import { QueryData } from './../../Utils/query.utils';
import { GetPreferences } from './../../Utils/preference.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';
import { Post } from './../../Utils/http.utils';
import { GetColumnsForListing, CreateFinalColumns } from './../../Utils/query.utils';

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
            finalColumns: []
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

            var preference = preferences.response.filter(function(item){
                return item.parameter == prefName;
            })
            // preferences.find(x => x.parameter === prefName);

            console.log(preference);

            this.setState({ queryParamsData, preference });

            this.getDataForListing();
        }
    }

    getDataForListing = async () => {
        const { queryParamsData, preference, params } = this.state;
        let options = GetDefaultOptions;
        const url = "getReportData";
        const result = await Post({ url, options, body: { month: "2016-07", query_name: "invoice_details" } });
        if (result.success) {
            const queryListing = result.response;
            this.setState({ queryListing });


            let stats = result.stats ? result.stats : stats;
            params.dictionary = result.dictionary ? result.dictionary : params.dictionary;
            params.includes = "";
            params.starter = queryParamsData.short_name;
            let currentPage = params.page;

            let tempColumns = GetColumnsForListing(params);

            let finalColumns;

            if (preference) {
                finalColumns = CreateFinalColumns(tempColumns, JSON.parse(preference[0].value));
            }

            this.setState({ stats, currentPage, params, columns: tempColumns, finalColumns });

        }
    }

    render() {

        const { queryListing = {}, queryParamsData = {}, stats, currentPage, preference, params, columns, finalColumns } = this.state;

        // const { history, match } = this.props;

        let resultData;

        if (params.dictionary) {
            resultData = {
                columns: columns,
                listing: queryListing,
                selectedColumns: queryParamsData.short_name + ".list",
                listName: queryParamsData.short_name + ".list",
                pageName: queryParamsData.name,
                stats: stats,
                currentPage: currentPage,
                dictionary: params.dictionary[params.starter],
                restrictColumn: ""
            };
        }


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
                        resultData &&
                        <QueryTable
                            // formContent={formContent}
                            finalColumns={finalColumns}
                            listing={preference}
                            queryTableObj={resultData}
                            queryData={queryParamsData}
                        />
                    }

                </div>

            </div>

        )
    }
}
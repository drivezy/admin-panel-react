import React, { Component } from 'react';


import QueryForm from './../../Components/Manage-Report/Components/Query-Form/queryForm.component';
import QueryTable from './../../Components/Manage-Report/Components/Query-Table/queryTable.component';


import { GetColumnsForListing, CreateFinalObject } from './../../Utils/query.utils';

import { Get, Post } from './../../Utils/http.utils';
import { GetPreferences } from './../../Utils/preference.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';

import './manageReportDetail.css';


export default class ManageReportDetail extends Component {

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
        this.getReportingQuery();

    }

    getReportingQuery = async () => {
        const { reportId } = this.props.match.params;
        const url = 'reportingQuery/' + reportId + '?includes=parameters.referenced_model,parameters.param_type,user_filter,actions.definition,user_view.group_filter,assets'
        const result = await Get({ url });

        if (result.success) {
            const queryParamsData = result.response;
            let prefName = queryParamsData.short_name + ".list";

            const preference = await GetPreferences(prefName);
            console.log(preference);

            this.setState({ queryParamsData, preference });

            this.getDataForListing();

        }
    }


    getDataForListing = async () => {
        const { queryParamsData, preference, params, finalColumns, columns } = this.state;
        let options = GetDefaultOptions;
        const url = "getReportData";
        const result = await Post({ url, options, body: { month: "2016-07", query_name: "invoice_details" } });
        if (result.success) {
            const queryListing = result;
            this.setState({ queryListing });


            let stats = queryListing.stats ? queryListing.stats : stats;
            params.dictionary = queryListing.dictionary ? queryListing.dictionary : params.dictionary;
            params.includes = "";
            params.starter = queryParamsData.short_name;

            let currentPage = params.page;
            const columns = GetColumnsForListing(params);

            if (preference) {
                const finalColumns = CreateFinalObject(columns, preference);
            }

            this.setState({ stats, currentPage, params, columns, finalColumns });

        }
    }

    render() {
        const { queryListing = {}, queryParamsData = {}, stats, currentPage, preference, params, columns, finalColumns } = this.state;
        const { history, match } = this.props;

        let resultData = {
            columns: columns,
            listing: queryListing,
            selectedColumns: queryParamsData.short_name + ".list",
            listName: queryParamsData.short_name + ".list",
            pageName: queryParamsData.name,
            stats: stats,
            currentPage: currentPage,
            // dictionary: params.dictionary[params.starter],
            restrictColumn: ""
        };

        return (
            <div className="manage-report">
                {
                    queryParamsData.id &&
                    <div className="reporting-query">
                        <div className="reporting-query-header">
                            <div className="header-content">
                                <h6>{queryParamsData.name}</h6>
                            </div>
                        </div>
                    </div>
                }
                {
                    queryParamsData.parameters &&
                    <QueryForm payload={queryParamsData.parameters} />
                }

                {/* {
                    queryListing.response &&
                    <QueryTable
                        history={history}
                        match={match}
                        queryData={queryParamsData}
                        preference={preference}
                        finalColumns={finalColumns}
                        queryTableObj={resultData}
                    />
                } */}
            </div>
        )
    }
}
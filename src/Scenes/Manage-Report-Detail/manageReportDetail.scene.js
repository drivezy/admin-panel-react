import React, { Component } from 'react';


import QueryForm from './../../Components/Manage-Report/Components/Query-Form/queryForm.component';
import QueryTable from './../../Components/Manage-Report/Components/Query-Table/queryTable.component';


import { GetColumnsForListing, CreateFinalObject } from './../../Utils/query.utils';

import { Get, Post } from './../../Utils/http.utils';
import { GetPreference } from './../../Utils/preference.utils';
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

            // let preference = [];
            const preference = GetPreference(prefName);

            // if (preferenceResult.success) {
            //     preference = result.response;
            // }
            // console.log(preference);

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
                finalColumns = CreateFinalObject(tempColumns, preference);
            }

            this.setState({ stats, currentPage, params, columns: tempColumns, finalColumns });

        }
    }

    render() {
        const { queryListing = {}, queryParamsData = {}, stats, currentPage, preference, params, columns, finalColumns } = this.state;
        const { history, match } = this.props;
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

                {
                    queryListing.response && resultData &&
                    <QueryTable
                        history={history}
                        match={match}
                        queryData={queryParamsData}
                        preference={preference}
                        finalColumns={finalColumns}
                        queryTableObj={resultData}
                    />
                }
            </div>
        )
    }
}
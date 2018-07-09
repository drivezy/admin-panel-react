import React, { Component } from 'react';

import './genericQueryDetail.scene.css';

import QueryTableSettings from './../../Components/Query-Report/Query-Table-Settings/queryTableSettings.component';
import QueryPredefinedFilter from './../../Components/Query-Report/Query-Predefined-Filter/queryPredefinedFilter.component';
import QueryDashboardForm from './../../Components/Query-Report/Query-Dashboard-Form/queryDashboardForm.component';
import QueryTable from './../../Components/Query-Report/Query-Table/queryTable.component';

import { QueryData } from './../../Utils/query.utils';

export default class GenericQueryDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            queryParamsData: {}
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
            this.setState({ queryParamsData })
        }
    }

    render() {
        const { queryParamsData = {} } = this.state;
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

                <div class="reports-content">

                    {
                        !(queryParamsData.comparable == 0 && queryParamsData.parameters && queryParamsData.parameters.length == 0) &&
                        <QueryDashboardForm
                            savedDashboard={savedDashboard}
                            queryTable={useQueryTable}
                            queryData={queryParamsData}
                            columns={columns}
                            formContent={formContent}
                            fields={queryParamsData.parameters}
                        />
                    }

                    {
                        resultData && useQueryTable &&
                        <QueryTable
                            formContent={formContent}
                            finalColumns={finalColumns}
                            preference={preference}
                            queryTableObj={resultData}
                            queryData={queryParamsData}
                        />
                    }

                </div>

            </div>

        )
    }
}
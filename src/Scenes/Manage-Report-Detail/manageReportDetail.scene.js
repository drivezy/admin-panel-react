import React, { Component } from 'react';


import QueryForm from './../../Components/Manage-Report/Components/Query-Form/queryForm.component';
import PortletTable from './../../Components/Portlet-Table/PortletTable.component';

import { Get, Post } from './../../Utils/http.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';

import './manageReportDetail.css';

export default class ManageReportDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reportingQueryData: {},
            queryListingData: {}
        };
    }

    componentDidMount() {
        this.getReportingQuery();
        this.getDataForListing();
    }

    getReportingQuery = async () => {
        const { reportId } = this.props.match.params;
        const url = 'reportingQuery/' + reportId + '?includes=parameters.referenced_model,parameters.param_type,user_filter,actions.definition,user_view.group_filter,assets'
        const result = await Get({ url });

        if (result.success) {
            const reportingQueryData = result.response;
            this.setState({ reportingQueryData });
        }
    }


    getDataForListing = async () => {
        let options = GetDefaultOptions;
        const url = "getReportData";
        const result = await Post({ url, options, body: { month: "2018-07", query_name: "invoice_details" } });
        if (result.success) {
            const queryListingData = result;
            this.setState({ queryListingData });
        }
    }

    render() {
        const { queryListingData = {}, reportingQueryData = {} } = this.state;
        const { history, match } = this.props;
        return (
            <div className="manage-report">
                {
                    reportingQueryData.id &&
                    <div className="reporting-query">
                        <div className="reporting-query-header">
                            <div className="header-content">
                                <h6>{reportingQueryData.name}</h6>
                            </div>
                        </div>
                    </div>
                }
                {
                    reportingQueryData.parameters &&
                    <QueryForm payload={reportingQueryData.parameters} />
                }

                {
                    queryListingData.length &&
                    <PortletTable tableType="listing"
                        history={history}
                        match={match}
                        genericData={queryListingData}
                    />
                }
            </div>
        )
    }
}
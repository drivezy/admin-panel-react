import React, { Component } from 'react';
import './dashboard.component.css';

// Import the components used within the page

import TableContents from './../../Query-Report/Table-Contents/tableContents.component';

export default class Dashboard extends Component {

    graphTypes = [
        { graphType: 'bar', caption: 'Bar Graph', image: 'https://assets.highcharts.com/images/demo-thumbnails/highcharts/bar-basic-default.svg' },
        { graphType: 'pie', caption: 'Pie Graph', image: 'https://assets.highcharts.com/images/demo-thumbnails/highcharts/pie-donut-default.svg' },
        { graphType: 'column', caption: 'Column Graph', image: 'https://assets.highcharts.com/images/demo-thumbnails/highcharts/column-basic-default.svg' },
        { graphType: 'line', caption: 'Line Graph', image: 'https://assets.highcharts.com/images/demo-thumbnails/highcharts/line-basic-default.svg' },
    ];

    constructor(props) {
        super(props);

        this.state = {
            formContent: this.props.formContent,
            tableContents: this.props.tableContents,
            columns: this.getColumns(this.props.tableContents),
            ...this.setOtherParams(this.props.tableContents, this.props.formContent),

            graphs: this.props.graphs,//array used to save all the graphs
            formParams: this.props.formParams,
            savedDashboard: this.props.savedDashboard,
            savedGroupings: this.props.savedGroupings,
            tableFilters: this.props.tableFilters,
            innerFilter: this.props.innerFilter
        }
    }

    // Build a columns array with column and field
    getColumns = (tableData) => {
        if (tableData && tableData[0]) {
            return Object.keys(tableData[0]).map((col) => { return { column: col.replace(/_/g, " "), field: col }; });
        } else {
            return [];
        }
    }

    setOtherParams = (tableContents, formContent) => {

        // const { columns } = this.state;
        const columns = this.getColumns(tableContents);

        this.group_columns = [];
        this.aggregate_columns = [];

        var group_columns = formContent.group_column.split(',').filter((entry) => entry != '') || [];
        var aggregate_columns = formContent.aggregate_column || [];

        // Build the group Columns
        group_columns.forEach((column) => {
            columns.forEach((innerColumn) => {
                if (innerColumn.field == column) {
                    this.group_columns.push(innerColumn.field);
                }
            });
        });

        // Build the aggreagate columns data
        aggregate_columns.forEach((column) => {
            columns.forEach((innerColumn) => {
                if (innerColumn.field == (column.name.split(' ').join('_') + '_of_' + column.column)) {
                    this.aggregate_columns.push(innerColumn.field);
                }
            });
        });

        return {
            group_columns: this.group_columns,
            aggregate_columns: this.aggregate_columns
        };
    }

    componentDidMount() {
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState(
            {
                formContent: nextProps.formContent,
                tableContents: nextProps.tableContents,
                ...this.setOtherParams(nextProps.tableContents, nextProps.formContent)
            }
        );
    }

    render() {
        const { tableContents, group_columns, aggregate_columns, graphs, formParams, savedDashboard, savedGroupings, tableFilters, innerFilter } = this.state;

        console.log(tableContents);
        return (
            <div className="dashboard">
                <div className="flex-container {{expandTable?'expanded':''}}">
                    <div className="card" >
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>

                            {/* Show the table Contents */}
                            {tableContents && <TableContents tableData={tableContents} />}
                            {/* Table Contents Ends */}

                        </div>
                    </div>
                </div>
                <div className="flex-container">
                    {
                        graphs &&
                        graphs.map((graph, key) =>
                            <div className="panel graph-container">
                                <div className="panel-heading">
                                    <div className="graph-title">
                                        {graph.title || 'Graph'}
                                    </div>
                                    <div className="actions">
                                        <a className="btn btn-default btn-xs" ng-click="deleteGraph({index:$index})" href="#" data-original-title="" title="Delete graph">
                                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <p className="loading-text" ng-show="!showGraph">
                                        Loading Graph
                                    </p>
                                    {/* <pie-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='pie'"></pie-graph>
                                    <line-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='line'"></line-graph>
                                    <column-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='column'"></column-graph>
                                    <bar-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='bar'"></bar-graph> */}
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="flex-container">
                    <div className="graph-builder">

                        <div className="card" >
                            <div className="card-body">
                                <h5 className="card-title">Graph Builder</h5>
                                <strong>Add Graph</strong>
                                <small>Create a graph of your choice</small>

                                {/* Input for building form */}
                                <div className="portlet-body">
                                    {
                                        group_columns.length && aggregate_columns.length &&
                                        <div className="graph-form-container">
                                            <form name="graphForm" className="graph-form">
                                                <div className="form-child">
                                                    <div className="graph-wrapper">
                                                        <div class="graph-types">
                                                            <label for="graphTitle">Type of graph</label>
                                                            <div>
                                                                {
                                                                    this.graphTypes &&
                                                                    this.graphTypes.map((graph, key) =>
                                                                        <div class="graph-type-holder" ng-class="{'active':formContent.graph.graphType == graph.graphType}" ng-click="selectGraph(graph)">
                                                                            <div class="panel panel-default">
                                                                                <div class="panel-body">
                                                                                    <img src="{graph.image}" alt="" />
                                                                                </div>
                                                                                <div class="panel-footer">
                                                                                    {graph.caption}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-wrapper">
                                                        <div class="form-group">
                                                            <label for="graphTitle">Title</label>
                                                            <input type="text" ng-model="formContent.title" class="form-control" id="graphTitle" placeholder="Graph Title" />
                                                        </div>
                                                        <div ng-if="formContent.graph.graphType == 'pie'">
                                                            <div class="form-group">
                                                                <label for="graphTitle">Group</label>
                                                                {/* <custom-select-field required ng-model="formContent.xAxis" obj="group_columns" place-holder="Column 1"></custom-select-field> */}
                                                            </div>

                                                            <div class="form-group">
                                                                <label for="graphTitle">Aggregation</label>
                                                                {/* <custom-select-field required ng-model="formContent.yAxis" obj="aggregate_columns" place-holder="Column 2"></custom-select-field> */}
                                                            </div>
                                                        </div>
                                                        <div ng-if="formContent.graph.graphType != 'pie'">
                                                            <div class="form-group">
                                                                <label for="graphTitle">X Axis</label>
                                                                {/* <custom-select-field required ng-model="formContent.xAxis" obj="group_columns" place-holder="Select axis"></custom-select-field> */}
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="graphTitle">Y Axis</label>
                                                                {/* <custom-select-field required ng-model="formContent.yAxis" obj="aggregate_columns" place-holder="Select Axis"></custom-select-field> */}
                                                            </div>
                                                            <div class="form-group" ng-if="formContent.graph.graphType == 'line'||formContent.graph.graphType == 'column'">
                                                                <label for="graphTitle">Group Column</label>
                                                                {/* <custom-select-field required ng-model="formContent.zAxis" obj="group_columns" place-holder="Select Axis"></custom-select-field> */}
                                                            </div>
                                                        </div>
                                                        <button class="btn btn-success pull-right" ng-click="addGraph()">
                                                            Add Graph
                                                    </button>
                                                    </div>
                                                </div>
                                            </form>
                                            <p class="text-muted">
                                                <small>Select a type of graph and choose your preference of X/Y Axis.</small>
                                            </p>
                                        </div>
                                    }
                                </div>


                                <div>
                                    {
                                        group_columns.length == 0 &&
                                        <p>
                                            Group by column to show relevant data.
                                    </p>
                                    }
                                </div>
                                <div>
                                    {
                                        aggregate_columns.length == 0 &&
                                        <p>
                                            Select an aggregation to show relevant data.
                                    </p>
                                    }
                                </div>
                                {
                                    (group_columns.length == 0 || aggregate_columns.length == 0) &&
                                    <small>
                                        Group columns and add an aggregation to create a graph
                                </small>
                                }

                                {/* Form Builder Ends */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
import React, { Component } from 'react';

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
            tableContents: this.props.tableContents,
            graphs: this.props.graphs,//array used to save all the graphs
            formParams: this.props.formParams,
            savedDashboard: this.props.savedDashboard,
            savedGroupings: this.props.savedGroupings,
            tableFilters: this.props.tableFilters,
            innerFilter: this.props.innerFilter
        }
    }

    componentDidMount() {
    }


    UNSAFE_componentWillReceiveProps(nextProps) {

    }

    refreshData = function () {

        // Arrays for the custom select field
        let group_columns = [];
        let aggregate_columns = [];

        // Splitting empty string pushes an empty space to the array , filtering it out
        group_columns = formParams.group_column.split(',').filter(function (entry) { return entry != ""; });
        aggregate_column = formParams.aggregate_column;

        // Group columns and aggreagete columns length should be 1 
        hideGraph = (!!group_columns && !!aggregate_column) && (group_columns.length == 1 && aggregate_column.length == 1) ? false : true;

        // Hide the button selection for actual pie data
        // hideToggles = angular.copy(!hideGraph);

        // Built the data for the the custom select field to work
        angular.forEach(group_columns, function (column) {
            angular.forEach(columns, function (innerColumn) {
                if (innerColumn.field == column) {
                    group_columns.push(innerColumn.field);
                }
            });
        });

        angular.forEach(aggregate_column, function (column) {
            angular.forEach(columns, function (innerColumn) {
                if (innerColumn.field == (column.name.split(' ').join('_') + '_of_' + column.column)) {
                    aggregate_columns.push(innerColumn.field);
                }
            });
        });


        // If groupcolumn and aggregate columns are there built a graph with first entry
        if (group_columns.length && aggregate_columns.length) {
            formContent.xAxis = { selected: group_columns[0] };
            formContent.yAxis = { selected: aggregate_columns[0] };
        }

        // Add extra graph data to every item in the graph
        graphs.map(function (graph) {
            var formContent = { graph: { graphType: graph.graphType }, title: graph.title, xAxis: { selected: graph.xAxis }, yAxis: { selected: graph.yAxis } };
            if (graph.zAxis) {
                formContent.zAxis = { selected: graph.zAxis }
            }
            var graphData = GraphFactory.getGraphData(tableContents, formContent);
            return angular.extend(graph, { graphData: graphData.graphData, categories: graphData.categories })
        });
    }

    render() {
        const { tableContents, graphs, formParams, savedDashboard, savedGroupings, tableFilters, innerFilter } = this.state;
        return (
            <div class="dashboard">
                <div class="flex-container {{expandTable?'expanded':''}}">
                    <div class="panel table-panel">
                        <div class="panel-body flip-scroll">
                            {
                                tableContents &&
                                <TableContents innerFilter={innerFilter} savedDashboard={savedDashboard} tableFilters={tableFilters}
                                    fullWidth={expandTable} tableContents={tableContents} columns={columns}></TableContents>
                            }
                        </div>
                    </div>
                </div>
                <div class="flex-container">
                    {
                        graphs &&
                        graphs.map((graph, key) =>
                            <div class="panel graph-container">
                                <div class="panel-heading">
                                    <div class="graph-title">
                                        {graph.title || 'Graph'}
                                    </div>
                                    <div class="actions">
                                        <a class="btn btn-default btn-xs" ng-click="deleteGraph({index:$index})" href="#" data-original-title="" title="Delete graph">
                                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="panel-body">
                                    <p class="loading-text" ng-show="!showGraph">
                                        Loading Graph
                                    </p>
                                    <pie-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='pie'"></pie-graph>
                                    <line-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='line'"></line-graph>
                                    <column-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='column'"></column-graph>
                                    <bar-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='bar'"></bar-graph>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div class="flex-container">
                    <div class="graph-builder">
                        <div class="panel">
                            <div class="panel-heading">
                                <strong>Add Graph</strong>
                                <small>Create a graph of your choice</small>
                            </div>
                            <div class="panel-body">
                                <div class="portlet-body">
                                    {
                                        group_columns.length && aggregate_columns.length &&
                                        <div class="graph-form-container">
                                            <form name="graphForm" class="graph-form">
                                                <div class="form-child">
                                                    <div class="graph-wrapper">
                                                        <div class="graph-types">
                                                            <label for="graphTitle">Type of graph</label>
                                                            <div>
                                                                {
                                                                    this.graphTypes &&
                                                                    graphs.map((graph, key) =>
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
                                                                <custom-select-field required ng-model="formContent.xAxis" obj="group_columns" place-holder="Column 1"></custom-select-field>
                                                            </div>

                                                            <div class="form-group">
                                                                <label for="graphTitle">Aggregation</label>
                                                                <custom-select-field required ng-model="formContent.yAxis" obj="aggregate_columns" place-holder="Column 2"></custom-select-field>
                                                            </div>
                                                        </div>
                                                        <div ng-if="formContent.graph.graphType != 'pie'">
                                                            <div class="form-group">
                                                                <label for="graphTitle">X Axis</label>
                                                                <custom-select-field required ng-model="formContent.xAxis" obj="group_columns" place-holder="Select axis"></custom-select-field>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="graphTitle">Y Axis</label>
                                                                <custom-select-field required ng-model="formContent.yAxis" obj="aggregate_columns" place-holder="Select Axis"></custom-select-field>
                                                            </div>
                                                            <div class="form-group" ng-if="formContent.graph.graphType == 'line'||formContent.graph.graphType == 'column'">
                                                                <label for="graphTitle">Group Column</label>
                                                                <custom-select-field required ng-model="formContent.zAxis" obj="group_columns" place-holder="Select Axis"></custom-select-field>
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
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
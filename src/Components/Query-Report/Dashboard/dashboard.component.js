import React, { Component } from 'react';
import './dashboard.component.css';


// Import the components used within the page
import SelectBox from './../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';
import TableContents from './../../Query-Report/Table-Contents/tableContents.component';
import BarGraph from './../Graphs/Bar-Graph/barGraph.component';
import { GetGraphData } from './../../../Utils/graph.utils';

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
            graphs: [],
            graphForm: this.graphTypes[1],
            formContent: this.props.formContent,
            tableContents: this.props.tableContents,
            columns: this.getColumns(this.props.tableContents),
            ...this.setOtherParams(this.props.tableContents, this.props.formContent),

            // graphs: this.props.graphs,//array used to save all the graphs
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

    selectGraph = (graph) => {
        const { graphForm } = this.state;

        graphForm.graphType = graph.graphType;

        this.setState({ graphForm });
    }

    selectGroup = (input) => {
        let { graphForm } = this.state;
        graphForm.xAxis = input;
        this.setState({ graphForm });
    }

    selectAggregation = (input) => {
        let { graphForm } = this.state;
        graphForm.yAxis = input;
        this.setState({ graphForm });
    }

    /**
     * Add a graph with the formContent and tableContents
     */
    addGraph = () => {
        let { graphs, tableContents, graphForm } = this.state;

        graphs.push(GetGraphData(tableContents, graphForm));

        this.setState({ graphs })
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
        const { tableContents, graphForm, group_columns, aggregate_columns, graphs, formParams, savedDashboard, savedGroupings, tableFilters, innerFilter } = this.state;

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

                {/* Iterate Graphs Data to show different Graphs */}
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

                                    <BarGraph config={graph} />

                                    {/* <pie-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='pie'"></pie-graph>
                                    <line-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='line'"></line-graph>
                                    <column-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='column'"></column-graph>
                                    <bar-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='bar'"></bar-graph> */}
                                </div>
                            </div>
                        )
                    }
                </div>
                {/* Graphs End */}

                < div className="flex-container" >
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
                                                        <div className="graph-types">
                                                            <label for="graphTitle">Type of graph</label>
                                                            <div>
                                                                {
                                                                    this.graphTypes &&
                                                                    this.graphTypes.map((graph, key) =>
                                                                        <div className={`graph-type-holder ${graphForm.graphType == graph.graphType ? 'active' : ''}`} onClick={() => { this.selectGraph(graph) }}>
                                                                            <div className="panel panel-default">
                                                                                <div className="panel-body">
                                                                                    <img src={graph.image} alt="" />
                                                                                </div>
                                                                                <div className="panel-footer">
                                                                                    {graph.caption}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-wrapper">
                                                        <div className="form-group">
                                                            <label for="graphTitle">Title</label>
                                                            <input type="text" value={graphForm.title} className="form-control" id="graphTitle" placeholder="Graph Title" />
                                                        </div>

                                                        {/* For Pie Graph */}
                                                        <div ng-if="formContent.graph.graphType == 'pie'">
                                                            <div className="form-group">
                                                                <label for="graphTitle">Group</label>
                                                                <SelectBox onChange={this.selectGroup} value={graphForm.xAxis} name="group_column" options={group_columns} />
                                                            </div>

                                                            <div className="form-group">
                                                                <label for="graphTitle">Aggregation</label>
                                                                <SelectBox onChange={this.selectAggregation} value={graphForm.yAxis} name="aggregate_column" options={aggregate_columns} />
                                                            </div>
                                                        </div>
                                                        {/* Pie Graph Form Ends */}

                                                        {/* For Rest Type of Graphs */}
                                                        {/* <div ng-if="formContent.graph.graphType != 'pie'">
                                                            <div className="form-group">
                                                                <label for="graphTitle">X Axis</label>
                                                            </div>
                                                            <div className="form-group">
                                                                <label for="graphTitle">Y Axis</label>
                                                            </div>
                                                            <div className="form-group" ng-if="formContent.graph.graphType == 'line'||formContent.graph.graphType == 'column'">
                                                                <label for="graphTitle">Group Column</label>
                                                            </div>
                                                        </div> */}
                                                        {/* Graph Form Ends */}

                                                        <button type="button" className="btn btn-success pull-right" onClick={this.addGraph}>
                                                            Add Graph
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                            <p className="text-muted">
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
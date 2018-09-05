import React, { Component } from 'react';
import './dashboard.component.css';


// Import the components used within the page
import SelectBox from './../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';
import TableContents from './../../Query-Report/Table-Contents/tableContents.component';

/**
 * Import the graphs
 */
import PieGraph from './../Graphs/Pie-Graph/pieGraph.component';
import BarGraph from './../Graphs/Bar-Graph/barGraph.component';
import LineGraph from './../Graphs/Line-Graph/lineGraph.component';
import ColumnGraph from './../Graphs/Column-Graph/columnGraph.component';

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
            graphForm: { graphType: this.graphTypes[1].graphType },
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

        var aggregate_columns = [];

        var group_columns = formContent.group_column.split(',').filter((entry) => entry != '') || [];

        if (typeof formContent.aggregate_column == 'string') {
            aggregate_columns = JSON.parse(formContent.aggregate_column);
        } else {
            aggregate_columns = formContent.aggregate_column;
        }

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

    deleteGraph = (index) => {
        const { graphs } = this.state;
        graphs.splice(index, 1);
        this.setState({ graphs });
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
        const { tableContents, formContent, graphForm, group_columns, aggregate_columns, graphs, formParams, savedDashboard, savedGroupings, tableFilters, innerFilter } = this.state;

        console.log('formContent', formContent);
        return (
            <div className="dashboard">
                <div className="flex-container {{expandTable?'expanded':''}}">
                    <div className="card" >
                        <div className="card-body">
                            <h5 className="card-title">Table</h5>

                            {/* Show the table Contents */}
                            {tableContents && <TableContents tableData={tableContents} />}
                            {/* Table Contents Ends */}

                        </div>
                    </div>
                </div>

                {/* Iterate Graphs Data to show different Graphs */}
                {
                    graphs &&
                    graphs.map((graph, key) =>
                        <div key={key} className="flex-container">
                            <div className="card graph-container">
                                <div className="card-header">
                                    <div className="graph-title">
                                        {graph.title || 'Graph'}
                                    </div>
                                    <div className="actions">
                                        <a className="btn btn-default btn-sm" onClick={() => { this.deleteGraph(key) }} title="Delete graph">
                                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                    {/* <h5 className="card-title">Graph Builder</h5> */}
                                </div>
                                <div className="card-body">

                                    {/* According to graphType pass graphData to particular graph */}
                                    {graph.graphData && graph.graphType == 'bar' && <BarGraph config={graph} />}

                                    {graph.graphData && graph.graphType == 'pie' && <PieGraph config={graph} />}

                                    {graph.graphData && graph.graphType == 'column' && <ColumnGraph config={graph} />}

                                    {graph.graphData && graph.graphType == 'line' && <LineGraph config={graph} />}

                                    {/* <pie-graph graph={graph} show-graph="showGraph" delete-method="deleteGraph({index:$index})" ng-if="graph.graphData&&graph.graphType=='pie'"></pie-graph>*/}
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Graphs End */}

                <div className="flex-container">
                    <div className="graph-builder">

                        <div className="card" >
                            <div className="card-body">
                                <h5 className="card-title">Graph Builder</h5>
                                <strong>Add Graph </strong>
                                <small> Create a graph of your choice</small>

                                {/* Input for building form */}
                                <div className="portlet-body">
                                    {
                                        (group_columns.length && aggregate_columns.length) ?
                                            <div className="graph-form-container">
                                                <form name="graphForm" className="graph-form">
                                                    <div className="form-child">
                                                        <div className="graph-wrapper">
                                                            <div className="graph-types">
                                                                <label htmlFor="graphTitle">Type of graph</label>
                                                                <div className="graphs">
                                                                    {
                                                                        this.graphTypes &&
                                                                        this.graphTypes.map((graph, key) =>
                                                                            <div key={key} className={`graph-type-holder ${graphForm.graphType == graph.graphType ? 'active' : ''}`} onClick={() => { this.selectGraph(graph) }}>
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
                                                                <label htmlFor="graphTitle">Title</label>
                                                                <input onChange={(event) => {
                                                                    const { graphForm } = this.state;
                                                                    graphForm.title = event.target.value;
                                                                    this.setState({ graphForm });
                                                                }} type="text" value={graphForm.title} className="form-control" id="graphTitle" placeholder="Graph Title" />
                                                            </div>

                                                            {/* For Pie Graph */}
                                                            <div ng-if="formContent.graph.graphType == 'pie'">
                                                                <div className="form-group">
                                                                    <label htmlFor="graphTitle">{graphForm.pie ? 'Group' : 'X Axis'}</label>
                                                                    <SelectBox onChange={this.selectGroup} value={graphForm.xAxis} name="group_column" options={group_columns} />
                                                                </div>

                                                                <div className="form-group">
                                                                    <label htmlFor="graphTitle">{graphForm.pie ? 'Aggregation' : 'Y Axis'}</label>
                                                                    <SelectBox onChange={this.selectAggregation} value={graphForm.yAxis} name="aggregate_column" options={aggregate_columns} />
                                                                </div>

                                                                {/* For Line/Column Graph get zAxis aswell */}
                                                                {
                                                                    (graphForm.graphType == 'line' || graphForm.graphType == 'column') &&
                                                                    <div className="form-group">
                                                                        <label htmlFor="graphTitle">Group Column</label>
                                                                        <SelectBox onChange={(input) => {

                                                                            const { graphForm } = this.state;
                                                                            graphForm.zAxis = input;
                                                                            this.setState({ graphForm });

                                                                        }} value={graphForm.zAxis} name="aggregate_column" options={group_columns} />
                                                                    </div>
                                                                }
                                                            </div>
                                                            {/* Pie Graph Form Ends */}

                                                            <button type="button" className="btn btn-success pull-right" onClick={this.addGraph}>
                                                                Add Graph
                                                        </button>
                                                        </div>
                                                    </div>
                                                </form>
                                                <p className="text-muted">
                                                    <small>Select a type of graph and choose your preference of X/Y Axis.</small>
                                                </p>
                                            </div> : null
                                    }
                                </div>


                                {/* If there is no group_Column alert user with text */}

                                {
                                    !formContent.group_column
                                    &&
                                    <div className="alert alert-warning" role="alert">
                                        Group by column to show relevant data.
                                                                        </div>
                                }


                                {/* Aggregation */}
                                {
                                    formContent.aggregate_column.length == 0
                                    &&
                                    <div className="alert alert-warning" role="alert">
                                        Select an aggregation to show relevant data.
                                                                        </div>
                                }


                                {
                                    (!formContent.group_column && formContent.aggregate_column.length == 0) &&
                                    <div className="alert alert-warning" role="alert">
                                        Group columns and add an aggregation to create a graph
                                    </div>
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
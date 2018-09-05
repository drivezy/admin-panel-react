/**
 * Component takes the table data and prints every row and every columns 
 */

import React, { Component } from 'react';

import './tableContent.component.css';

class TableContents extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tableData: props.tableData || [],
            columns: this.getColumns(props.tableData)
        };
    }

    // Build a columns array with column and field
    getColumns = (tableData) => {
        if (tableData && tableData[0]) {
            return Object.keys(tableData[0]).map((col) => { return { column: col.replace(/_/g, " "), field: col }; });
        } else {
            return [];
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            tableData: props.tableData,
            columns: this.getColumns(props.tableData)
        });
    }

    render() {

        const { columns, tableData } = this.state;

        return <div className="table-body">
            {
                tableData.length ?
                    <div className="table-contents">
                        <table className="table table-hover table-fixed flip-content table-striped">
                            <thead className="flip-content">
                                <tr>
                                    <th> #</th>
                                    {/* Repeat the columns array for the header */}
                                    {columns.map((column, index) =>
                                        <th key={index}>
                                            {column.column}
                                        </th>
                                    )}
                                    {/* Columns End */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tableData.map((tableRow, index) =>
                                        <tr key={index}>
                                            <td> {index + 1}}</td>
                                            {/* Repeat the columns array for the header */}
                                            {
                                                columns.map((column, key) =>
                                                    <td key={key}>
                                                        {tableRow[column.field]}
                                                    </td>
                                                )
                                            }
                                            {/* Columns End */}
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div> : <p className="tex-muted">Nothing to show</p>
            }
        </div>
    }
}

export default TableContents;

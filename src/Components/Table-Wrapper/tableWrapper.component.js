import React, { Component } from 'react';

export default class TableWrapper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { listing, columns } = this.props;
        return (
            <div>
                <table className="table table-hover flip-content exportable table-bordered">
                    <thead className="flip-content white-background">
                        <tr>
                            <th>#</th>
                            {
                                columns.map((selectedColumn, key) => {
                                    return (
                                        <th className="column-header" key={key}>
                                            <span>{selectedColumn.label}</span>
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            listing.map((listingRow, rowKey) => {

                                return (
                                    <tr className="table-row" key={rowKey}>

                                        <td className="row-key">
                                            {rowKey + 1}
                                        </td>
                                        {
                                            columns.map((selectedColumn, key) => {
                                                return (
                                                    <td key={key}>
                                                        <span>
                                                            {selectedColumn.placeholder ? selectedColumn.placeholder : eval('listingRow.' + selectedColumn.field)}
                                                        </span>
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

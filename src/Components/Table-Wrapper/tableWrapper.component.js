import React, { Component } from 'react';

export default class TableWrapper extends Component {
    constructor(props) {
        super(props);
    }

    checkType = (selectedColumn, listingRow) => {
        switch (selectedColumn.type) {
            case 'link':
                return <a target="_blank" href={`${eval('listingRow.' + selectedColumn.field)}`}>{selectedColumn.placeholder ? selectedColumn.placeholder : eval('listingRow.' + selectedColumn.field)}</a>
            case 'sref':
                return <a href={`${selectedColumn.sref}${selectedColumn.id ? `${eval('listingRow.' + selectedColumn.id)}` : listingRow.id}`}>
                    <i className={`fa ${selectedColumn.class}`} />
                    <span>{eval('listingRow.' + selectedColumn.field)}</span>
                </a>
            default:
                return <span>{selectedColumn.placeholder ? selectedColumn.placeholder : eval('listingRow.' + selectedColumn.field)}</span>
        }
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
                                                            {
                                                                this.checkType(selectedColumn, listingRow)
                                                            }
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

import React, { Component } from 'react';

export default class TableWrapper extends Component {
    constructor(props) {
        super(props);
    }

    getValue(selectedColumn, listingRow) {
        let value;

        // if (typeof selectedColumn == 'object' && listingRow[selectedColumn.field.split(".")[0]] && selectedColumn.field.split(".")[0] == 'booking' ) {
        //     value = listingRow[selectedColumn.field.split(".")[0]]['token']
        //     // console.log(selectedColumn.field.split(".")[0], selectedColumn.field.split(".")[1])
        // }
        try {
            value = eval('listingRow.' + selectedColumn.field);
            if (value && typeof value == 'object') {
                value = value.id;
            }

        } catch (e) {
            console.log(selectedColumn);
            console.log(listingRow);
            console.log('fuck u');
        }
        return value
    }

    checkType = (selectedColumn, listingRow) => {
        if (listingRow.booking && listingRow.booking.token)
            listingRow.token = listingRow.booking.token

        else if (listingRow.order && listingRow.order.identifier)
            listingRow.token = listingRow.order.identifier

        switch (selectedColumn.type) {
            case 'link':
                return <a target="_blank" href={`${this.getValue(selectedColumn, listingRow)}`}>{selectedColumn.placeholder ? selectedColumn.placeholder : this.getValue(selectedColumn, listingRow)}</a>
            case 'sref':
                return <a href={`${selectedColumn.sref}${selectedColumn.id ? `${eval('listingRow.' + selectedColumn.id)}` : listingRow.id}`}>
                    <i className={`fa ${selectedColumn.class}`} />
                    <span>{this.getValue(selectedColumn, listingRow)}</span>
                </a>
            default:
                return <span>{selectedColumn.placeholder ? selectedColumn.placeholder : this.getValue(selectedColumn, listingRow)}</span>
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

import React, { Component } from 'react';

import './queryTable.css';

export default class QueryTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filters: this.props.filters,
            finalColumns: this.props.finalColumns,
            listingObject: this.props.listingObject
        }
    }

    render() {

        const { filters, finalColumns, listingObject } = this.props;

        return (
            <div></div>
        )
    }
}
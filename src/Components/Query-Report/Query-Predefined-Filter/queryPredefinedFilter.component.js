import React, { Component } from 'react';

import './queryPredefinedFilter.css';

export default class QueryPredefinedFilter extends Component {

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
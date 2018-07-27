
// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';
import { Get, IsEqualObject } from 'common-js-util';

import { ROUTE_URL } from './../../../../Constants/global.constants';

import SelectBox from './../Select-Box/selectBoxForGenericForm.component';
import './listSelect.css';

export default class ListSelect extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: '',
            value: this.props.model || '',
            options: []
        }

        this.loadOptions(this.props.column);
    }

    loadOptions = async (column) => {

        let url = '';

        if ((column.reference_model) && column.reference_model.route_name) {
            var route = column.reference_model.route_name;
            url = route;
        } else if (column.route) {
            var route = column.route;
            url = route;
        }

        const result = await Get({ url: url, urlPrefix: ROUTE_URL });

        if (result.success) {
            const options = result.response;
            this.setState({ options });
        }
    }

    componentDidUpdate(updatedProps) {
        const { column } = this.props;
        const { column: updatedColumn } = updatedProps;
        if (updatedColumn && !IsEqualObject(updatedColumn.reference_model, column.reference_model)) {
            this.loadOptions(updatedColumn);
        }
    }

    render() {
        const { column, isClearable } = this.props;
        const reference_model = column.reference_model ? column.reference_model : {};
        const { value, options } = this.state;

        return (
            <div className="reference-input">
                <SelectBox
                    multi={this.props.multi}
                    options={options}
                    isClearable={isClearable}
                    name={this.props.name}
                    onChange={this.props.onChange}
                    index="id"
                    field={reference_model.display_column || column.display_column}
                    queryField={reference_model.display_column || column.display_column}
                    sortingType={column.sorting_type}
                    // async={url}
                    value={value} />
            </div>
        );
    }
}
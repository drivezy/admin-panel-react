
// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';

import GLOBAL from './../../../../Constants/global.constants';

import SelectBox from './../../Components/Select-Box/selectBox';
// import SelectBox from './../Select-Box/selectBoxForGenericForm.component';
import './referenceInput.css';

import { Get } from './../../../../Utils/http.utils';

export default class ReferenceInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: '',
            value: this.props.model || ''
        }
    }

    loadInitialContent = async (column) => {

        let url = '';

        if ((column.referenced_model) && column.referenced_model.route_name) {
            var route = column.referenced_model.route_name;

            url = route.split('api/admin/')[1]
        } else if (column.route) {

            var route = column.route;

            url = route.split('api/admin/')[1]
        }

        this.setState({ url });
    }

    getOptions = async () => {

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.column) {
            this.loadInitialContent(nextProps.column);
        }
    }

    render() {

        const { column } = this.props;

        const { url, value } = this.state;

        return (
            <div className="reference-input">
                <SelectBox
                    name={this.props.name}
                    onChange={this.props.onChange}
                    index="id"
                    field={column.display_column || column.referenced_model.display_column}
                    sortingType={column.sorting_type}
                    // getOptions={this.getOptions}
                    async={url}
                    value={value}
                />
            </div>
        );
    }
}

// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';

import GLOBAL from './../../../../Constants/global.constants';

import SelectBox from './../Select-Box/selectBox';
import './referenceInput.css';

import { Get } from './../../../../Utils/http.utils';

export default class ReferenceInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: '',
            value: ''
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

        url += '?query=' + 'id' + '=' + this.props.value

        const result = await Get({ url });

        if (result.success && result.response.length) {
            this.setState({ value: result.response[0] });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.column) {
            this.loadInitialContent(nextProps.column);
        }
    }

    render() {

        const { column, value } = this.props;

        const { url } = this.state;

        return (
            <div className="reference-input">
                <SelectBox async={url} value={value} />
            </div>
        );
    }
}
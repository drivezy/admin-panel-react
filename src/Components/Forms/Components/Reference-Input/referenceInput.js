
// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';

import GLOBAL from './../../../../Constants/global.constants';

import SelectBox from './../../Components/Select-Box/selectBox';
import Typeahead from './../../Components/Typeahead/typeahead.component';

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


    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.column) {
            this.loadInitialContent(nextProps);
        }
    }

    loadInitialContent = async (props) => {


        const { column, model } = props;

        let url = '';

        if ((column.reference_model) && column.reference_model.route_name) {
            var route = column.reference_model.route_name;

            url = route;
        } else if (column.route) {

            var route = column.route;

            url = route;
        }

        if (model) {
            let preloadUrl = url + '?query=id=' + model

            const result = await Get({ url: preloadUrl, urlPrefix: GLOBAL.ROUTE_URL });

            if (result.success) {

                let options = result.response.map((entry) => {
                    let option = entry;
                    option.value = option.id;
                    option.label = option.name;
                    return option
                });

                console.log(options)

                this.setState({ url: url, value: options.pop() });
            }
        } else {
            this.setState({ url });
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
                    field={column.reference_model.display_column || column.display_column}
                    sortingType={column.sorting_type}
                    // getOptions={this.getOptions}
                    queryField={column.reference_model.display_column || column.display_column}
                    async={url}
                    value={value}
                />

                {/* <Typeahead
                    options={[]}
                    onType={this.getOptions}
                    onChange={this.props.onChange}
                // value={child.inputField}
                // field={'path'}
                // placeholder='Input Value'
                />; */}
            </div>
        );
    }
}

// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';
import { Get } from 'common-js-util';

import SelectBox from './../../Components/Select-Box/selectBoxForGenericForm.component';

import GLOBAL from './../../../../Constants/global.constants';
import './referenceInput.css';


let unmounted = false;

export default class ReferenceInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: '',
            value: this.props.model || ''
        }

        this.loadInitialContent(props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // if (nextProps.column) {
        //     if (!unmounted) {
        //         this.loadInitialContent(nextProps);
        //     }
        // }

        const { column } = nextProps;
        const url = this.extractUrlFromColumn(column);

        const stateObj = { url };

        if (nextProps.model && typeof nextProps.model == 'object') {
            stateObj.value = nextProps.model;
        }
        this.setState(stateObj);
    }

    componentWillUnmount = () => {
        // unmounted = true;
    }

    extractUrlFromColumn(column) {
        if ((column.reference_model) && column.reference_model.route_name || column.reference_model.modified_route) {
            return column.reference_model.modified_route ? column.reference_model.modified_route : column.reference_model.route_name;
        } else if (column.route) {
            return column.route;
        }
    }

    loadInitialContent = async (props) => {

        const { column, model } = props;

        let url = this.extractUrlFromColumn(column);

        // this.setState({ url });
        this.state.url = url;

        if (model && url) {
            let preloadUrl;
            if (url.includes('query')) {
                preloadUrl = url + ' and id=' + model
            } else {
                preloadUrl = url + '?query=id=' + model
            }

            const result = await Get({ url: preloadUrl, urlPrefix: GLOBAL.ROUTE_URL });

            if (result.success) {

                let options = result.response.map((entry) => {
                    let option = entry;
                    option.value = option.id;
                    option.label = option.name;
                    return option
                });

                // console.log(options)

                this.setState({ value: options.pop() });
            }
        }
    }
    render() {

        const { column, isClearable } = this.props;
        const reference_model = column.reference_model ? column.reference_model : {};

        const { url, value } = this.state;

        return (
            <div className="reference-input">
                <SelectBox
                    name={this.props.name}
                    isClearable={isClearable}
                    onChange={this.props.onChange}
                    index="id"
                    field={reference_model.display_column || column.display_column}
                    sortingType={column.sorting_type}
                    // getOptions={this.getOptions}
                    queryField={reference_model.display_column || column.display_column}
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
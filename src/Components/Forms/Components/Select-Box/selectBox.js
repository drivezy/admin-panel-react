
// Refer https://github.com/JedWatson/react-select

import React, { Component } from 'react';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';
// import Async from 'react-select';

import { Get } from './../../../../Utils/http.utils';
import { callbackify } from 'util';

export default class SelectBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
            async: this.props.async,

            multi: this.props.multi,
            selectedOption: [],
            field: this.props.field || 'name',
            key: this.props.key || 'id'
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.options && nextProps.options.length) {
            const options = nextProps.options.map((option) => (
                { ...option, ...{ label: option[this.state.field], value: option[this.state.key] } }
            ));
            this.setState({ options });
        }
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });

        this.props.onChange(this.props.model, selectedOption);
    }

    removeSelected = (selectedOption) => {
        // this.setState({ selectedOption });
    }

    getOptions = async (input, callback) => {
        const { async } = this.props;
        const result = await Get({ url: async });

        if (result.success) {

            const options = result.response.map((option) => (
                { ...option, ...{ label: option[this.state.field], value: option[this.state.key] } }
            ));

            callback(null, {
                options: options
            });
        }
    }

    render() {

        const { async } = this.props;

        const { selectedOption, options, multi } = this.state;

        return (
            <div>
                {
                    async ?
                        <div>
                            <Async
                                name="form-field-name"
                                // value={selectedOption}
                                loadOptions={this.getOptions}
                                onChange={this.handleChange}
                                multi={this.props.multi}
                            />
                        </div> :
                        <div>
                            <Select
                                name="form-field-name"
                                value={selectedOption}
                                onChange={this.handleChange}
                                options={options}
                                multi={this.props.multi}
                            />
                        </div>
                }
            </div>
        );
    }
}
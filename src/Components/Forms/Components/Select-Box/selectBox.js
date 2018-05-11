
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
            value: this.props.value || '',
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

        if (nextProps.value && nextProps.value != this.state.value) {
            const { value } = nextProps;
            this.setState({ value });
        }

    }

    handleChange = (value) => {
        // this.setState({ value: value[this.state.key] });

        if (this.state.async) {
            this.setState({ value: value[this.state.key] });
        } else {
            this.setState({ value });
        }


        if (this.props.onChange) {
            console.log(this.props.name, value[this.state.key]);
            // this.props.onChange(this.props.name, value[this.state.key]);
        }
    }

    removeSelected = (value) => {
        // this.setState({ value });
    }

    getOptions = async (input, callback) => {
        const { async } = this.props;

        // For first time match the id with provided value to preselect the field 
        if (input) {

            const url = async + '?query=' + this.state.field + ' LIKE \'%' + input + '%\'';

            const result = await Get({ url: url });

            if (result.success) {

                const options = result.response.map((option) => (
                    { ...option, ...{ label: option[this.state.field], value: option[this.state.key] } }
                ));

                callback(null, {
                    options: options
                });
            }

        } else {
            if (this.props.value) {
                let preloadUrl = async + '?query=' + this.state.key + '=' + this.props.value

                const result = await Get({ url: preloadUrl });

                if (result.success) {
                    const options = result.response.map((option) => (
                        { ...option, ...{ label: option[this.state.field], value: option[this.state.key] } }
                    ));

                    callback(null, {
                        options: options
                    });
                }
            }
        }
    }

    render() {

        const { async } = this.props;

        const { value, options, multi } = this.state;

        return (
            <div>
                {
                    async ?
                        <div>
                            <Async
                                name="form-field-name"
                                value={value}
                                loadOptions={this.getOptions}
                                onChange={this.handleChange}
                                multi={this.props.multi}
                            />
                        </div> :
                        <div>
                            <Select
                                name="form-field-name"
                                value={value}
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
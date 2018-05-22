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
            // options: [],
            // value: this.props.value || '',
            ...this.setOptions(props),
            field: this.props.field || 'name',
            key: this.props.key || 'id'
            // key: this.props.key
        };

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ ...this.setOptions(nextProps) });
    }

    setOptions = props => {
        let options = [];
        let value = '';
        if (props.options && props.options.length) {
            options = props.options.map((option) => {
                return { ...option, ...{ label: option[props.field || 'name'], value: option[props.key || 'id'] } }
            });
            // this.setState({ options });
        }

        if (props.value) {
            value = props.value;
            // this.setState({ value });
        }
        return { value, options, key: props.key || 'id' };
    }

    handleChange = (value) => {
        // this.setState({ value: value[this.state.key] });
        if (!value) {
            return;
        }
        if (this.props.async) {
            // this.setState({ value: this.props.key ? value[this.state.key] : value });
            this.setState({ value: value[this.state.key] });
        } else {
            this.setState({ value });
        }


        if (this.props.onChange) {
            this.props.onChange(this.props.name, this.props.key ? value[this.state.key] : value);
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
        const { async, getOptions } = this.props;
        const { value, options, field } = this.state;
        let elem;

        if (async) {
            elem = <Async
                name="form-field-name"
                value={value}
                loadOptions={this.getOptions}
                onChange={this.handleChange}
                multi={this.props.multi}
            />
        } else if (getOptions) {
            elem = <Async
                name="form-field-name"
                value={value}
                loadOptions={getOptions}
                onChange={this.handleChange}
                multi={this.props.multi}
            />
        } else {
            elem = <Select
                name="form-field-name"
                value={value}
                onChange={this.handleChange}
                options={options}
                multi={this.props.multi}
            />
        }

        return (
            <div>
                {elem}
            </div>
        );
    }
}
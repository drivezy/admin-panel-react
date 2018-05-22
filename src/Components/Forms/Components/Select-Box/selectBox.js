
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
            ...this.returnStateObj(props)
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ ...this.returnStateObj(props) });
    }

    /**
     * extracts options, value, and field
     * expects array of object as options but even if string of array is passed as options,
     * converts array of object internally and passes forward (since this library doesnt support array of strings)
     * @param  {object} props - expected to have options, value, field(optional when array of strings), queryField(for async calls), key
     */
    returnStateObj(props) {
        let options = [], value = {};
        if (Array.isArray(props.options) && typeof props.options[0] != 'object') {
            props.options.forEach(option => {
                options.push({ label: option });
            });
            if (props.value && Object.keys(props.value).length) {
                value = { label: props.value };
            }
        } else {
            options = props.options;
            value = props.value || {};
        }

        return {
            options,
            value,
            field: props.field || 'label',
            queryField: props.queryField
        }
    }

    handleChange = (value) => {
        const { onChange, async, name, field } = this.props;
        const { field: stateField } = this.state;
        if (!value) {
            return;
        }
        this.setState({ value });

        if (typeof onChange == 'function') {
            const finalValue = !field ? value[stateField] : value;
            onChange(finalValue, name);
        }
    }

    getOptions = async (input, callback) => {
        const { async, queryField, value, index } = this.props;

        // For first time match the id with provided value to preselect the field 
        if (input) {
            const url = async + '?query=' + queryField + ' LIKE \'%' + input + '%\'';
            const result = await Get({ url });
            if (result.success) {
                callback(null, {
                    options: result.response
                });
            }
        } else if (value) {
            console.log(value);
            let preloadUrl = async + '?query=' + index + '=' + value
            const result = await Get({ url: preloadUrl });

            if (result.success) {
                console.log(result);

                callback(null, {
                    options: result.response,
                    // value: result.response[0]
                });

                this.props.onChange(result.response[0]);
                // this.setState({ value: result.response[0] });
            }
        }
    }

    render() {
        const { async, getOptions, multi, placeholder } = this.props;
        const { value, options, field } = this.state;

        let elem;
        if (async) {
            elem = <Async
                name="form-field-name"
                value={value}
                loadOptions={this.getOptions}
                onChange={this.handleChange}
                labelKey={field}
                placeholder={placeholder}
                multi={multi}
            />
        } else if (getOptions) {
            elem = <Async
                name="form-field-name"
                value={value}
                loadOptions={getOptions}
                onChange={this.handleChange}
                labelKey={field}
                placeholder={placeholder}
                multi={multi}
            />
        } else {
            elem = <Select
                name="form-field-name"
                value={value}
                onChange={this.handleChange}
                options={options}
                labelKey={field}
                autoFocus
                clearable
                placeholder={placeholder}
                multi={multi}
            />
        }

        return (
            <div>
                {elem}
            </div>
        );
    }
}

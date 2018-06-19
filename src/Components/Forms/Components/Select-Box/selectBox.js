
// Refer https://github.com/JedWatson/react-select

import React, { Component } from 'react';
import './selectBox.css';

import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

import { Get } from './../../../../Utils/http.utils';
import { IsObjectHaveKeys } from './../../../../Utils/common.utils';

export default class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.returnStateObj(props)
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
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

        // console.log(props.options);

        if (Array.isArray(props.options) && typeof props.options[0] != 'object') {
            props.options.forEach(option => {
                options.push({ label: typeof option == 'number' ? option.toString() : option, value: typeof option == 'number' ? option.toString() : option });
            });

            if (props.value) {
                // ,value: typeof props.value == 'number' ? props.value.toString() : props.value 
                value = typeof props.value == 'object' ? {} : { label: typeof props.value == 'number' ? props.value.toString() : props.value };
            }
        } else {
            options = props.options && !Array.isArray(props.options) && Object.keys(props.options).length ? Object.values(props.options) : props.options;
            value = props.value || {};
        }

        return {
            options,
            value,
            field: props.field || 'label',
            valueKey: props.valueKey || 'value',
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
            const result = await Get({ url: url });
            if (result.success) {
                callback(null, {
                    options: result.response
                });
            }
        } else if (value) {
            let preloadUrl = async + '?query=' + index + '=' + value
            const result = await Get({ url: preloadUrl, urlPrefix: 'https://newadminapi.justride.in/' });

            if (result.success) {

                console.log(result);

                let options = result.response.map((entry) => {
                    let option = entry;
                    option.value = option.id;
                    option.label = option.name;
                    return option
                });

                console.log(options)

                callback(null, {
                    options
                });

                // this.props.onChange(result.response[0]);
            }
        }
    }

    render() {
        const { async, getOptions, multi, placeholder } = this.props;
        const { value, options, field, valueKey } = this.state;
        let elem;
        console.log(value);
        if (async) {
            elem = <Async
                name="form-field-name"
                value={(typeof value != 'object' || IsObjectHaveKeys(value)) ? value : undefined}
                // value={value}
                loadOptions={this.getOptions}
                onChange={this.handleChange}
                // labelKey={field}
                // valueKey={valueKey}
                placeholder={placeholder}
                multi={multi}
            />
        } else if (getOptions) {
            elem = <Async
                name="form-field-name"
                // value={value}
                value={(typeof value != 'object' || IsObjectHaveKeys(value)) ? value : undefined}
                loadOptions={getOptions}
                onChange={this.handleChange}
                labelKey={field}
                valueKey={valueKey}
                placeholder={placeholder}
                multi={multi}
            />
        } else {
            elem = <Select autoFocus={false}
                name="form-field-name"
                // value={value}
                value={(typeof value != 'object' || IsObjectHaveKeys(value)) ? value : undefined}
                onChange={this.handleChange}
                options={options}
                labelKey={field}
                valueKey={valueKey}
                clearable
                placeholder={placeholder}
                multi={multi}
            />
        }

        return (
            <div className="select-box">
                {elem}
            </div>
        );
    }
}

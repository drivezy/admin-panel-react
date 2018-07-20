
// Refer https://github.com/JedWatson/react-select

import React, { Component } from 'react';
import './selectBox.css';

import Select, { Async } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
// import 'react-select/dist/react-select.css';

import { Get, IsObjectHaveKeys } from 'common-js-util';

export default class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = {

            // 
            // options: props.options,
            // value: props.value,
            // field: props.field || 'name',
            // valueKey: props.valueKey || 'value',
            // queryField: props.queryField
            ...this.setOptions(props),
            field: this.props.field || 'name',
            key: this.props.key || 'id'
        }

    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({ ...this.setOptions(props) });
    }

    /**
     * extracts options, value, and field
     * expects array of object as options but even if string of array is passed as options,
     * converts array of object internally and passes forward (since this library doesnt support array of strings)
     * @param  {object} props - expected to have options, value, field(optional when array of strings), queryField(for async calls), key
     */
    setOptions(props) {
        let options = [], value = {};

        if (Array.isArray(props.options) && typeof props.options[0] != 'object') {
            props.options.forEach(option => {
                options.push({ label: typeof option == 'number' ? option.toString() : option, value: typeof option == 'number' ? option.toString() : option });
            });

            if (props.value) {
                value = typeof props.value == 'object' ? {} : { label: typeof props.value == 'number' ? props.value.toString() : props.value };
            }
        } else {
            options = props.options && !Array.isArray(props.options) && Object.keys(props.options).length ? Object.values(props.options) : props.options;
            value = props.value || {};
        }

        return {
            options,
            value,
            label: props.label || 'label', // Label is what will be displayed of the selected option
            field: props.field || 'name', // Field is what will be assigned  
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

        // this.state.value = value.id;
        this.state.value = value;
        // this.setState({ value: value });

        if (typeof onChange == 'function') {
            const finalValue = !field ? value[stateField] : value;
            // onChange(finalValue, name);
            // onChange(name, finalValue);
            onChange(value);
            // onChange(name, finalValue.id);
        }
    }

    getOptions = async (input, callback) => {
        const { async, queryField, value, index } = this.props;

        // For first time match the id with provided value to preselect the field 
        if (input) {
            let url = async;
            // const url = async + '?query=' + queryField + ' LIKE \'%' + input + '%\'';

            if (url.includes('query')) {
                url = url + ' and ' + queryField + '= LIKE \'%' + input + '%\'';
            } else {
                url = url + '?query=' + queryField + '= LIKE \'%' + input + '%\'';
            }


            const result = await Get({ url: url, urlPrefix: 'https://newadminapi.justride.in/' });
            if (result.success) {

                let options = result.response.map((entry) => {
                    let option = entry;
                    option.value = option.id;
                    option.label = option.name;
                    return option
                });

                callback(options);
            }
        }

    }

    render() {
        const { async, getOptions, multi, placeholder } = this.props;
        const { value, options, label, valueKey } = this.state;

        let elem;

        if (async) {
            elem = <AsyncSelect
                name="form-field-name"
                value={value}
                loadOptions={this.getOptions}
                onChange={this.handleChange}
                // onInputChange={this.handleChange}
                defaultOptions
                placeholder={placeholder}
                multi={multi}
            />
        } else if (getOptions) {
            elem = <AsyncSelect
                name="form-field-name"
                value={(typeof value != 'object' || IsObjectHaveKeys(value)) ? value : undefined}
                loadOptions={getOptions}
                onChange={this.handleChange}
                placeholder={placeholder}
                multi={multi}
            />
        } else {
            elem = <Select autoFocus={false}
                name="form-field-name"
                value={(typeof value != 'object' || IsObjectHaveKeys(value)) ? value : undefined}
                onChange={this.handleChange}
                options={options}
                clearable
                placeholder={placeholder}
                multi={multi}
                key='id'
                // formatOptionLabel={(context, inputValue) => <span>{context[label]}</span>}
                getOptionLabel={(context, inputValue) => <span>{context[label]}</span>}
                getOptionValue={(context, inputValue) => <span>{context[label]}</span>}
                menuPlacement="auto"
            />
        }

        return (
            <div className="select-box" >
                {elem}
            </div>
        );
    }
}

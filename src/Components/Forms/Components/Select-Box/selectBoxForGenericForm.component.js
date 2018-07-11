// Refer https://github.com/JedWatson/react-select

import React, { Component } from 'react';

import Select, { Async } from 'react-select';
// import 'react-select/dist/react-select.css';
// import Async from 'react-select';
import GLOBAL from './../../../../Constants/global.constants';

import { IsObjectHaveKeys } from './../../../../Utils/common.utils';
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ ...this.setOptions(nextProps) });
    }

    // setOptions = props => {
    //     let options = [];
    //     let value = '';
    //     if (props.options && props.options.length) {
    //         options = props.options.map((option) => {
    //             return { ...option, ...{ label: option[props.field || 'name'], value: option[props.key || 'id'] } }
    //         });
    //         // this.setState({ options });
    //     }

    //     if (props.value) {
    //         value = props.value;
    //         // this.setState({ value });
    //     }
    //     return { value, options, key: props.key || 'id' };
    // }

    setOptions(props) {
        let options = [], value = {};

        if (Array.isArray(props.options) && typeof props.options[0] != 'object') {
            props.options.forEach(option => {
                options.push({ name: typeof option == 'number' ? option.toString() : option, value: typeof option == 'number' ? option.toString() : option });
            });

            if (props.value) {
                value = typeof props.value == 'object' ? {} : { name: typeof props.value == 'number' ? props.value.toString() : props.value };
            }
        } else {
            options = props.options && !Array.isArray(props.options) && Object.keys(props.options).length ? Object.values(props.options) : props.options;
            value = props.value || {};
        }

        return {
            options,
            value,
            key: props.key || 'id'
        }
    }

    handleChange = (value, e) => {
        const { key } = this.state;
        const { options } = this.props;
        // this.setState({ value: value[this.state.key] });

        if (e && e.action == 'clear') {
            this.props.onChange(null, this.props.name);
            return;
        }
        if (!value) {
            return;
        }
        if (this.props.async) {
            // this.setState({ value: this.props.key ? value[this.state.key] : value });
            this.setState({ value: value[key] });
        } else {
            this.setState({ value });
        }

        if (Array.isArray(options) && typeof options[0] != 'object') {
            value = value['value'];
        }

        if (this.props.onChange) {
            this.props.onChange(value, this.props.name);
            // this.props.onChange(this.props.name, key ? value[key] : value);
        }
    }

    removeSelected = (value) => {
        // this.setState({ value });
    }

    getOptions = async (input, callback) => {
        const { async } = this.props;

        // For first time match the id with provided value to preselect the field 
        if (input) {

            let url = async;
            // const url = async + '?query=' + this.state.field + ' LIKE \'%' + input + '%\'';

            if (url.includes('query')) {
                url = url + ' and ' + this.state.field + ' LIKE \'%' + input + '%\'';
            } else {
                url = url + '?query=' + this.state.field + ' LIKE \'%' + input + '%\'';
            }

            const result = await Get({ url: url, urlPrefix: GLOBAL.ROUTE_URL });

            if (result.success) {

                const options = result.response.map((option) => (
                    { ...option, ...{ label: option[this.state.field], value: option[this.state.key] } }
                ));

                // callback(null, {
                //     options: options
                // });
                callback(options);
            }

        } else {
            if (this.props.value) {
                let preloadUrl = async + '?query=' + this.state.key + '=' + this.props.value;
                // let preloadUrl = async + '?query=' + this.state.key + '=' + this.props.value

                if (preloadUrl.includes('query')) {
                    preloadUrl = preloadUrl + ' and ' + this.state.field + '=' + input;
                } else {
                    preloadUrl = preloadUrl + '?query=' + this.state.field + '=' + input;
                }

                const result = await Get({ url: preloadUrl, urlPrefix: GLOBAL.ROUTE_URL });

                if (result.success) {
                    const options = result.response.map((option) => (
                        { ...option, ...{ label: option[this.state.field], value: option[this.state.key] } }
                    ));

                    // callback(null, {
                    //     options: options
                    // });
                    callback(options);
                }
            }
        }
    }

    render() {
        const { async, getOptions, isClearable = true } = this.props;
        const { options, field, key } = this.state;
        let { value } = this.state;
        let elem;

        let param = {};
        if (IsObjectHaveKeys(value)) {
            param.value = value;
        }

        // value = (typeof value != 'object' || IsObjectHaveKeys(value)) ? value : undefined;

        if (async) {
            elem = <Async
                name="form-field-name"
                // value={value}
                {...param}
                isClearable={isClearable}
                loadOptions={this.getOptions}
                onChange={this.handleChange.bind(this)}
                multi={this.props.multi}
                getOptionLabel={(context, inputValue) => <span>{context[field]}</span>}
                getOptionValue={(context, inputValue) => <span>{context[key]}</span>}
            />
        } else if (getOptions) {
            elem = <Async
                name="form-field-name"
                // value={value}
                {...param}

                loadOptions={getOptions}
                isClearable={isClearable}
                onChange={this.handleChange.bind(this)}
                multi={this.props.multi}
                getOptionLabel={(context, inputValue) => <span>{context[field]}</span>}
                getOptionValue={(context, inputValue) => <span>{context[key]}</span>}
            />
        } else {
            elem = <Select
                name="form-field-name"
                {...param}

                // value={value}
                onChange={this.handleChange.bind(this)}
                options={options}
                multi={this.props.multi}
                isClearable={isClearable}
                getOptionLabel={(context, inputValue) => <span>{context[field]}</span>}
                getOptionValue={(context, inputValue) => <span>{context[key]}</span>}
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
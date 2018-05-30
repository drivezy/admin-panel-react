import React, { Component } from 'react';

import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';


export default class TypeaheadComponent extends Component {
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

        return {
            options: props.options,
            value: props.value,
            field: props.field || undefined,
        }
    }

    handleChange = (value) => {
        value = value[0];
        const { onChange, async, name, field } = this.props;
        const { field: stateField } = this.state;
        if (!value) {
            return;
        }
        this.setState({ value });

        if (typeof onChange == 'function') {
            // const finalValue = !field ? value[stateField] : value;
            onChange(value, name);
        }
    }

    render() {
        const { field, options, isLoading = false } = this.state;
        const { searchLabel, placeholder, value, onType } = this.props;


        return (
            <div className="home-scene">
                <Typeahead
                    onInputChange={onType}
                    selected={[value]}
                    emptyLabel={searchLabel ? searchLabel : ''}
                    labelKey={field}
                    options={options}
                    placeholder={placeholder}
                    selectHintOnEnter
                    onChange={this.handleChange}
                />

            </div>
        );
    }
}
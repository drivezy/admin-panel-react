import React, { Component } from 'react';

import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css';

// import './dateTimePicker.css';

export default class DateTimePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            format: props.format,
            minDate: props.minDate,
            maxDate: props.maxDate,
            value: props.value,
            onChange: props.onChange
        }
    }

    applyDate = (dt) => {

        const { onChange } = this.state;

        onChange(this.state.name, dt.format(this.state.format));

    }

    componentDidMount() {
    }

    render() {

        const { format, minDate, maxDate, name, value, onChange } = this.state;

        return (
            <div className="datetime-picker-wrapper">
                <Datetime dateFormat={format} value={value} onChange={this.applyDate} />
            </div>
        )
    }
}
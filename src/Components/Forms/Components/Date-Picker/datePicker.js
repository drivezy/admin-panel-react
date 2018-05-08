
// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';


import './datePicker.css';


import GLOBAL from './../../../../Constants/global.constants';

export default class DatePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            format: this.props.format || GLOBAL.DATE_FORMAT,
            minDate: this.props.minDate,
            maxDate: this.props.maxDate,
            model: {},

        }
    }

    applyDate = (event, picker) => {
        console.log(picker);
        const { model } = this.state;
        model.startDate = picker.startDate.format(this.state.format);
        model.endDate = picker.startDate.format(this.state.format)
        this.setState({ model });
    }

    render() {

        const { startDate, endDate } = this.state.model;

        return (

            <div className="form-group datepicker">
                <label htmlFor="exampleInputEmail1">Date Picker</label>
                <div className="form-control">
                    <DateRangePicker startDate="1/1/2014" endDate="3/1/2014" onApply={this.applyDate}>
                        <div className="picker">
                            {startDate} - {endDate}
                        </div>
                    </DateRangePicker>
                </div>
                <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                </small>
            </div>
        );
    }
}

// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';


import './datePicker.css';


import GLOBAL from './../../../../Constants/global.constants';
import { spawn } from 'child_process';

export default class DatePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            format: this.props.format || GLOBAL.DATE_FORMAT,
            minDate: this.props.minDate,
            maxDate: this.props.maxDate,
            value: this.props.value || '',
        }
    }

    applyDate = (event, picker) => {
        // console.log(picker);
        let { value } = this.state;

        if (this.props.single) {
            value = picker.startDate.format(this.state.format);
        } else {
            value.startDate = picker.startDate.format(this.state.format);
            value.endDate = picker.endDate.format(this.state.format)
        }
        this.setState({ value });
    }

    render() {


        var value=0;

        if (this.props.single) {
            var value = this.state.value;
            // const { value } = this.state;
        } else {
            var { startDate, endDate } = this.state.value;
        }

        return (

            <div className="form-group datepicker">
                <div className="form-control">
                    {
                        this.props.single ?
                            <DateRangePicker timePicker={this.props.timePicker} singleDatePicker onApply={this.applyDate}>
                                <div className="picker">
                                    {value}
                                </div>
                            </DateRangePicker>
                            : <DateRangePicker timePicker={this.props.timePicker} onApply={this.applyDate}>
                                <div className="picker">
                                    {/* {startDate} - {endDate} */}
                                </div>
                            </DateRangePicker>
                    }
                </div>
            </div>
        );
    }
}
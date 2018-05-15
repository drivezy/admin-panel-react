
// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import moment from 'moment';


import './datePicker.css';


import GLOBAL from './../../../../Constants/global.constants';

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

        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }

        this.setState({ value });
    }

    render() {


        var value = 0;

        if (this.props.single) {
            value = moment(this.state.value).format('DD/MM/YYYY HH:MM');
            // const { value } = this.state;
        } else {
            var { startDate, endDate } = this.state.value;
        }

        return (

            <div className="form-group datepicker">
                <div className="form-control">
                    {
                        this.props.single ?
                            <DateRangePicker timePicker={this.props.timePicker} startDate="1/1/2018 10:10" singleDatePicker onApply={this.applyDate}>
                                <div className="picker">
                                    {value}
                                </div>
                            </DateRangePicker>
                            : <DateRangePicker timePicker={this.props.timePicker} startDate={startDate} endDate={endDate} onApply={this.applyDate}>
                                <div className="picker">
                                    {startDate} - {endDate}
                                </div>
                            </DateRangePicker>
                    }
                </div>
            </div>
        );
    }
}
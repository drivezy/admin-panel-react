
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
            format: props.format || GLOBAL.DATE_TIME_FORMAT,
            minDate: props.minDate,
            maxDate: props.maxDate,
            value: props.value || '',
        }
    }

    applyDate = (event, picker) => {
        let { value } = this.state;

        if (this.props && this.props.single) {
            value = picker.startDate.format(this.state.format);
        } else {
            value.startDate = picker.startDate.format(this.state.format);
            value.endDate = picker.endDate.format(this.state.format)
        }

        if (this.props.onChange) {
            // this.props.onChange(...event);
            this.props.onChange(this.props.name, value);
        }

        this.setState({ value });
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            format: nextProps.format || GLOBAL.DATE_TIME_FORMAT,
            minDate: nextProps.minDate,
            maxDate: nextProps.maxDate,
            value: nextProps.value || '',
        });
    }

    render() {

        let props = {
            locale: { format: this.state.format },
            timePicker: this.props.timePicker,

        };

        if (this.props.single) {
            if (this.state.value) {
                props.startDate = moment(this.state.value).format(this.state.format);
            }
        } else {

            props.startDate = moment(this.state.value.startDate).format(this.state.format)
            props.endDate = moment(this.state.value.endDate).format(this.state.format)
        }

        return (

            <div className="datepicker">
                <div className="form-control">
                    {
                        this.props.single ?
                            <DateRangePicker showDropdowns={true} singleDatePicker onApply={this.applyDate} {...props}>
                                <div className="picker">
                                    {props.startDate}
                                </div>
                            </DateRangePicker>
                            : <DateRangePicker showDropdowns={true} {...props} onApply={this.applyDate}>
                                <div className="picker">
                                    {props.startDate} - {props.endDate}
                                </div>
                            </DateRangePicker>
                    }
                </div>
            </div>
        );
    }
}
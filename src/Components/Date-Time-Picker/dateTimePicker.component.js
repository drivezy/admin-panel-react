import React, { Component } from 'react';
import DateRangePicker from 'eonasdan-bootstrap-datetimepicker';
import './dateTimePicker.css';
import './../../../node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'


import $ from 'jquery';
// import GLOBAL from './../../../../Constants/global.constants'

export default class DateTimePicker extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        let $image = $('.date-time-wrapper');

        $image.datetimepicker({
            viewMode: this.props.viewMode,
            format: this.props.format,
            // inline: true,
            sideBySide: true
        });

    }

    render() {
        return (
            <div className="form-group-wrapper">
                <div className='input-group date'>
                    <input id='datetimepicker10' type='text' autoComplete="off" className="form-control date-time-wrapper" />
                    {/* <span className="input-group-addon">
                                <span>
                                    <i className="fa fa-calendar" aria-hidden="true">
                                    </i>
                                </span>
                            </span> */}
                </div>
            </div>
        )
    }
}
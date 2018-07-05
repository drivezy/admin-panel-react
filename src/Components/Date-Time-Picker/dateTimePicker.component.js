import React, { Component } from 'react';
import DateRangePicker from 'eonasdan-bootstrap-datetimepicker';
import './dateTimePicker.css';

import $ from 'jquery';
// import GLOBAL from './../../../../Constants/global.constants'

export default class DateTimePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewMode: props.viewMode || 'years',
            format: props.format || 'MM/YYYY'

        }
    }

    componentDidMount() {
        let $image = $('#datetimepicker10');

        $image.datetimepicker({
            viewMode: 'years',
            format: 'MM/YYYY'
        });
        // $(function () {
        //     $('#datetimepicker10').datetimepicker({
        //         viewMode: 'years',
        //         format: 'MM/YYYY'
        //     });
        // });
    }

    render() {
        return (

            <div className="container">
                <div className="col-sm-6">
                    <div className="form-group">
                        <div className='input-group date' id='datetimepicker10'>
                            <input type='text' className="form-control" />
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-calendar">
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
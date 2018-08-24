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
        let $image = $('#datetimepicker11');
        

        $image.datetimepicker({
            viewMode: this.props.viewMode,
            format: this.props.format,
            // inline: true,
            sideBySide: true
        });

        // $(function () {
        //     $('#datetimepicker10').datetimepicker({
        //         viewMode: this.props.viewMode,
        //         format: this.props.format
        //     });
        // });
    }

    render() {
        return (

            <div>
                <div className="">
                    <div className="form-group-wrapper">
                        <div className='input-group date' id='datetimepicker10' >
                            <input type='text' autocomplete="off" className="form-control" id='datetimepicker11' />
                            <span className="input-group-addon">
                                {/* <span>
                                    <i className="fa fa-calendar" aria-hidden="true">
                                    </i>
                                </span> */}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
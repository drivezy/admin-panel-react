import React, { Component } from 'react';
import DateRangePicker from 'eonasdan-bootstrap-datetimepicker';
import './dateTimePicker.css';
import './../../../node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'


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
        let $image1 = $('#datetimepicker1');

        $image.datetimepicker({
            viewMode: 'years',
            format: 'MM/YYYY'
        });
        $image1.datetimepicker({
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

            <div>
                <div className="col-sm-12">
                    <div className="form-group-wrapper">
                        <div className='input-group date' id='datetimepicker10' >
                            <input type='text' autocomplete="off" className="form-control" id='datetimepicker1'  />
                            <span className="input-group-addon">
                                <span>
                                    <i className="fa fa-calendar" aria-hidden="true">
                                    </i>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
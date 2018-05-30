
// Refer https://github.com/skratchdot/react-bootstrap-daterangepicker

import React, { Component } from 'react';

import moment from 'moment';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';


import './timePicker.css';


import GLOBAL from './../../../../Constants/global.constants';

export default class DatePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    applyDate = (event, picker) => {

    }

    render() {


        return (

            <div className="form-group datepicker">
                <div className="form-control">
                    <TimePicker />

                </div>
            </div>
        );
    }
}
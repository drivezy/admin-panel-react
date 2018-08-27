import React, { Component } from 'react';

import Datetime from 'react-date'

// import './dateTimePicker.css';

export default class DateTimePicker extends Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
    }

    render() {
        return (
            <div className="datetime-picker-wrapper">
                <Datetime />
            </div>
        )
    }
}
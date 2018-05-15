import React, { Component } from "react";
// import SwitchComponent from "react-switch";
import Switch from 'rc-switch';

import './switch.css';

export default class SwitchComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    handleChange = (value) => {
        this.setState({ value });

        // Emit the value to the parent
        this.props.onChange(this.props.name, value ? 1 : 0);
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor="normal-switch">
                    <Switch
                        onChange={this.handleChange}
                        checked={this.state.value ? true : false}
                        id="normal-switch"
                    />
                </label>
            </div>
        );
    }
}
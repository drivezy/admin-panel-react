import React, { Component } from "react";
import SwitchComp from "react-switch";

import './switch.css';

export default class Switch extends Component {

    constructor(props) {
        super(props);
        this.state = { checked: false };
    }

    render() {
        return (
            <div class="form-group">
                <label htmlFor="exampleInputEmail1">Label</label>
                <div className="form-control">
                    <label htmlFor="normal-switch">
                        <SwitchComp
                            onChange={this.handleChange}
                            checked={this.state.checked}
                            id="normal-switch"
                        />
                    </label>
                </div>
                <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                </small>
            </div>
        );
    }
}
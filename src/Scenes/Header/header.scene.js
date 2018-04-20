import React, { Component } from 'react';
import './header.css';

import ActiveModule from './../../Components/Active-Module/ActiveModule';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {

        return (
            <div className="header">
                <ActiveModule />
            </div>
        )
    }
}
import React, { Component } from 'react';
import './header.css';


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
            </div>
        )
    }
}
import React, { Component } from 'react';
import './header.css';

import ActiveModule from './../../Components/Active-Module/ActiveModule.component';
import PageNav from './../../Components/Page-Nav/PageNav';

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
            <div className="landing-header">
                <div className="header-content">
                    <ActiveModule />
                    <PageNav />
                </div>
            </div>
        )
    }
}
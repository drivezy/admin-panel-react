import React, { Component } from 'react';
import { SubscribeToEvent } from './../../Utils/stateManager.utils';

export default class ConfigureDynamicFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true
        };
        SubscribeToEvent({ eventName: 'ToggleAdvancedFilter', callback: this.listenToggleAdvancedFilter });
    }

    listenToggleAdvancedFilter = (data) => {
        console.log('data');
        this.setState({ isCollapsed: data });
    }

    render() {
        const { isCollapsed } = this.state;
        return (
            <h3> {isCollapsed ? 'Collapsed' : 'OPen'} </h3>
        );
    }
}
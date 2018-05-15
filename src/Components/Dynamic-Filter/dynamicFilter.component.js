import React, { Component } from 'react';
import { StoreEvent } from './../../Utils/stateManager.utils';
import './dynamicFilter.css';

export default class DynamicFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true
        };
    }

    toggleAdvancedFilter = () => {
        const { isCollapsed } = this.state;
        this.setState({ isCollapsed: !isCollapsed });
        StoreEvent({ eventName: 'ToggleAdvancedFilter', data: !isCollapsed });
    }


    render() {
        const { isCollapsed } = this.state;
        return (
            <div
                className="dynamic-filter-container cursor-pointer"
                onClick={() => this.toggleAdvancedFilter()}
            >
                Advanced
            </div>
        );
    }
}
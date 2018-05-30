import React, { Component } from 'react';
import './searchSidebar.css';

import { Link } from 'react-router-dom';

import { SubscribeToEvent } from './../../Utils/stateManager.utils'


export default class SearchSidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        }
    }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'toggledMenu', callback: this.toggledMenu })
    }

    toggledMenu = () => {
        this.setState({ collapsed: false });
    }

    toggleMenus() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const { visible, collapsed } = this.state;
        return (
            <div className="search-sidebar">
                <div className={`search-box ${collapsed ? '' : 'expanded'}`}>
                    <div class="input-box search-input">
                        <input placeholder="Search...." type="text" className="form-control mousetrap" />
                    </div>
                    <button class="btn btn-default" ng-click="searchSidebar.toggleSearch()">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                <div className="menus">
                    <div className="menu-item" onClick={() => this.toggleMenus()}>
                        <div className="menu-label">
                            <div className="menu-icon">
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </div>
                            <div className="item-label"> Search</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
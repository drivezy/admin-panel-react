import React, { Component } from 'react';
import './ActiveModule.css';

import { Link } from 'react-router-dom';

import { SubscribeToEvent } from './../../Utils/stateManager.utils'


export default class ActiveModule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: props.collapsed || true,
            menus: [],
            menuName: ''
        }

        this.toggledMenu = this.toggledMenu.bind(this);
    }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'showMenuName', callback: this.listenMenuChange });
        SubscribeToEvent({ eventName: 'toggledMenu', callback: this.toggledMenu })
    }

    listenMenuChange = (data) => {
        this.setState({
            menuName: data.menuName
        })
    }

    toggledMenu = (module) => {
        this.setState({ menus: module.menus, collapsed: false });
    }

    toggleMenus() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    clickedValue = (menu) => {
        this.setState({
            collapsed: true,
            menuName: menu.name
        })
    }

    render() {
        const { menuName, menus } = this.state;

        return (
            <div className="active-module">
                <div className={`search-box ${this.state.collapsed ? '' : 'expanded'}`}>
                    <div className="search-box-header">
                        <div className="input-box">
                            {/* <input placeholder="Search Menus" type="text" className="form-control mousetrap" on-change="activeModule.findMatchingMenus()"
                            ng-model="activeModule.searchText" /> */}
                        </div>
                        <button className="btn btn-default" onClick={() => this.toggleMenus()}>
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="search-box-body">
                        <p className="search-hint">
                            Select a module to list menus in it or type to search all the menus
                        </p>
                        {
                            menus.length != 0 ?
                                <div className="panel menus">
                                    <div className="panel-heading">
                                        Menus
                                    </div>
                                    <div className="panel-body">
                                        {
                                            menus.map((menu, key) => (
                                                (menu.visible == 1) && (<Link onClick={() => this.clickedValue(menu)} to={menu.url} className="menu-list" key={key}>
                                                    {menu.name}
                                                </Link>)
                                            ))
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>
                </div>
                <div className="search-button">
                    <button className="btn btn-default" onClick={() => this.toggleMenus()}>
                        <i className="fa fa-bars" aria-hidden="true"></i> {menuName}
                    </button>
                </div>
            </div >
        )
    }
}
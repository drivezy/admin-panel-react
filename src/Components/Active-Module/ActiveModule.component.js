import React, { Component } from 'react';
import './ActiveModule.css';

import { Link } from 'react-router-dom';
import { SubscribeToEvent, StoreEvent } from 'state-manager-utility';
import _ from 'lodash';

export default class ActiveModule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: props.collapsed || true,
            menus: [],
            menuName: '',
            module: '',
            searchArray: {}
        }

        this.toggledMenu = this.toggledMenu.bind(this);
    }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'showMenuName', callback: this.listenMenuChange });
        SubscribeToEvent({ eventName: 'toggledMenu', callback: this.toggledMenu });
        SubscribeToEvent({ eventName: 'searchInMenu', callback: this.menuSearch })
    }

    listenMenuChange = (data) => {
        this.setState({
            menuName: data.menuName
        })
    }

    toggledMenu = (module) => {
        this.setState({ module: module, menus: module.menus, collapsed: false });
    }

    menuSearch = (searchArray) => {
        this.setState({ searchArray });
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

    searchMenus = (search) => {
        StoreEvent({ eventName: 'searchMenu', data: search })
    }

    render() {
        const { menuName, menus, module, searchArray } = this.state;
        let sortMenu = this.state.menus;
        sortMenu = _.orderBy(menus, 'name', 'asc')


        return (
            <div className="active-module">
                <div className={`search-box ${this.state.collapsed ? '' : 'expanded'}`}>
                    <div className="search-box-header">
                        <div className="input-box">
                            <input placeholder="Search Menus" type="text" className="form-control mousetrap" onChange={(e) => (this.searchMenus(e.target.value))} />
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
                            sortMenu.length != 0 ?
                                <div className="panel menus">
                                    <div className="panel-heading">
                                        {module.name}
                                    </div>
                                    <div className="panel-body">
                                        {
                                            sortMenu.map((menu, key) => (
                                                (menu.visible == 1) && (<Link onClick={() => this.clickedValue(menu)} to={'/' + menu.url} className="menu-list" key={key}>
                                                    <span className="menu-icon">
                                                        <i className={`menu-icon fa ${menu.image ? menu.image : 'fa-flickr'}`}></i>
                                                    </span>
                                                    <div className="item-label `${visible ? 'menu-visible' : 'menu-hide'}`">
                                                        {menu.name}
                                                    </div>
                                                </Link>)
                                            ))
                                        }
                                    </div>
                                </div> : null
                        }
                        {
                            Object.keys(searchArray).length ?
                                <div className="listing-matching-menus">
                                    Listing Matching Menus
                                </div>
                                : null
                        }
                        {

                            Object.keys(searchArray).map((menus, i) => {
                                return (
                                    <div className="panel menus ">
                                        <div className="panel-heading ">
                                            {menus}
                                        </div>
                                        <div className="panel-body ">
                                            {
                                                Object.keys(searchArray[menus]).map((menu, key) =>
                                                    (<Link onClick={() => this.clickedValue(searchArray[menus][menu])} to={'/' + searchArray[menus][menu].url} className="menu-list" key={key}>
                                                        <span className="menu-icon">
                                                            <i className={`menu-icon fa ${searchArray[menus][menu].image ? searchArray[menus][menu].image : 'fa-flickr'}`}></i>
                                                        </span>
                                                        <div>
                                                            {searchArray[menus][menu].name}
                                                        </div>
                                                    </Link>)
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            })
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
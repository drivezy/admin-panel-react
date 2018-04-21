import React, { Component } from 'react';
import './ActiveModule.css';

import { SubscribeToEvent } from './../../Utils/stateManager.utils'


export default class ActiveModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: props.collapsed || true,
            menus: []
        }

        this.toggledMenu = this.toggledMenu.bind(this);
    }

    componentDidMount() {
        // const main = document.getElementById("main");

        // if (main) {
        //     main.addEventListener('click', () => {
        //         if (this.state.visible) {
        //             this.toggleNav();
        //         }
        //     })
        // }
        // this.closeNav();

        SubscribeToEvent({ eventName: 'toggledMenu', callback: this.toggledMenu })
    }

    toggledMenu = (module) => {
        this.setState({ menus: module.menus, collapsed: false });
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.visible != this.props.visible) {
        //     this.setState({ visible: nextProps.visible });
        // }
    }

    openNav = () => {
        // const sideNav = document.getElementById("mySidenav");
        // const main = document.getElementById("main");
        // if (sideNav && main) {
        //     sideNav.style.width = "250px";
        //     main.style.marginLeft = "250px";
        //     document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        // }
    }

    closeNav = () => {
        // const sideNav = document.getElementById("mySidenav");
        // const main = document.getElementById("main");
        // if (sideNav && main) {
        //     sideNav.style.width = "50px";
        //     main.style.marginLeft = "50px";
        //     document.body.style.backgroundColor = "white";
        // }
    }

    operation(visible) {
        // if (!visible) {
        //     this.closeNav();
        // } else {
        //     this.openNav();
        // }
    }

    toggleNav = (visible = this.state.visible) => {
        // this.state.visible = !visible;
        // this.setState({ visible: !visible });
        // this.operation(this.state.visible);
    }

    toggleMenus() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    navigateTo(menu) {
        // console.log(menu);
    }

    render() {
        // const { visible } = this.state;
        // this.operation(visible);
        // const { menus } = this.props;
        // const { menus } = this.state;

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
                        <div className="panel menus">
                            <div className="panel-heading">
                                Menus
                    </div>
                            <div className="panel-body">

                                {this.state.menus.map((menu, key) => (
                                    <div key={key} className="menu-list" onClick={this.navigateTo(menu)}>
                                        {menu.name}
                                    </div>
                                ))}
                                {/* <div className="menu-list"
                                ng-click="activeModule.navigateTo(menu)" ng-repeat="menu in (filteredResults = (activeModule.selectedModule.menus|filter:activeModule.searchText))">
                                <span className="pull-right" ng-if="activeModule.state.current.name == 'landing.'+menu.state_name">
                                    <i className="fa fa-check" aria-hidden="true"></i>
                                </span>
                            </div> */}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="search-button">
                    <button className="btn btn-default" onClick={() => this.toggleMenus()}>
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    </button>
                </div>
            </div >
        )
    }
}
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

    listenMenuChange = (data) => {
        this.setState({
            menuName: data.menuName
        })
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

    clickedValue = (menu) => {
        this.setState({
            collapsed: true,
            menuName: menu.name
        })
    }

    render() {
        // const { visible } = this.state;
        // this.operation(visible);
        // const { menus } = this.props;
        const { menuName } = this.state;

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
                                {
                                    this.state.menus.map((menu, key) => {
                                        return (menu.active == 1) && (menu.visibility == 1) && (<Link onClick={() => this.clickedValue(menu)} to={menu.url} className="menu-list" key={key}>
                                            {menu.name}
                                        </Link>)
                                    })
                                }
                            </div>
                        </div>
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
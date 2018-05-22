import React, { Component } from 'react';
import './sideNav.css';

import { StoreEvent } from './../../Utils/stateManager.utils'


export default class Sidenav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false,
            onCollapse: props.onCollapse
        }
    }

    componentDidMount() {
        const main = document.getElementById("main");

        if (main) {
            main.addEventListener('click', () => {
                if (this.state.visible) {
                    this.toggleNav();
                }
            })
        }
        this.closeNav();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.props.visible) {
            this.setState({ visible: nextProps.visible });
        }
    }

    openNav = () => {
        const sideNav = document.getElementById("mySidenav");
        const main = document.getElementById("main");
        if (sideNav && main) {
            sideNav.style.width = "180px";
            main.style.marginLeft = "180px";
            document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        }
    }

    closeNav = () => {
        const sideNav = document.getElementById("mySidenav");
        const main = document.getElementById("main");
        if (sideNav && main) {
            sideNav.style.width = "40px";
            main.style.marginLeft = "40px";
            document.body.style.backgroundColor = "white";
        }
    }

    operation(visible) {
        this.state.onCollapse(visible);
        if (!visible) {
            this.closeNav();
        } else {
            this.openNav();
        }
    }


    toggleNav = (visible = this.state.visible) => {
        // this.state.visible = !visible;
        this.setState({ visible: !visible });
        this.operation(this.state.visible);
    }

    toggleMenu = (menu) => {
        StoreEvent({ eventName: 'toggledMenu', data: menu })
    }

    render() {
        const { visible } = this.state;
        this.operation(visible);
        const { menus } = this.props;

        return (
            <div id="mySidenav" className="sidebar-wrapper">
                <div className="sidebar-logo">
                    <div className="logo-image">
                        {/* <span className="logo-container">
                            <img src={require('./../../Assets/images/logo-main.png')} />
                        </span> */}
                        <span className="toggle-icon" onClick={() => this.toggleNav()}>
                            <i className={`fa ${visible ? 'fa-chevron-left' : 'fa-chevron-down'}`}></i>
                        </span>

                    </div>
                    <div className="sidebar-menus `${visible}?'expanded':'collapsed'`">
                        <div className="menus">
                            {
                                menus.map((menu, key) => (
                                    <div className="menu-item" key={key} onClick={() => this.toggleMenu(menu)}>
                                        <div className="menu-label">
                                            <div className="menu-icon">
                                                <i className={`menu-icon fa ${menu.image}`}></i>

                                            </div>
                                            <div className="item-label `${visible ? 'menu-visible' : 'menu-hide'}`">
                                                {menu.name}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
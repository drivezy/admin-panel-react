import React, { Component } from 'react';
import './sideNav.css';

import { StoreEvent } from 'common-js-util';

import { HotKeys } from 'react-hotkeys';

export default class Sidenav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false,
            // onCollapse: props.onCollapse
        }
    }

    keyMap = {
        moveUp: 'shift+b',
    }
    handlers = {
        'moveUp': (event) => this.toggleNav(this.state.visible)
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
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visible != this.props.visible) {
            this.setState({ visible: this.props.visible });
        }
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.visible != this.props.visible) {
    //         this.setState({ visible: nextProps.visible });
    //     }
    // }

    toggleNav = (visible = this.state.visible) => {
        this.props.onCollapse(visible);
    }

    toggleMenu = (menu) => {
        StoreEvent({ eventName: 'toggledMenu', data: menu })
    }

    render() {
        const { visible } = this.state;
        const { menus } = this.props;

        return (

            <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
                <div id="mySidenav" className={`sidebar-wrapper ${visible ? 'expanded' : 'collapsed'}`}>
                    <div className="sidebar-logo">
                        <div className="logo-image">
                            <span className="logo-container">
                                <img src={require('./../../Assets/images/logo-main.png')} />
                            </span>
                            <span className="toggle-icon" onClick={() => this.toggleNav()}>
                                <i className={`fa ${visible ? 'fa-chevron-left' : 'fa-chevron-down'}`}></i>
                            </span>

                        </div>
                        <div className="sidebar-menus">
                            <div className="menus">
                                {
                                    menus.map((menu, key) => (
                                        <div className="menu-item" key={key} onClick={() => this.toggleMenu(menu)}>
                                            <div className="menu-label">
                                                <div className="menu-icon">
                                                    <i className={`menu-icon fa ${menu.image?menu.image:'fa-flickr'}`}></i>
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
            </HotKeys>
        )
    }
}
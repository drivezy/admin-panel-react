import React, { Component } from 'react';
import './sideNav.css';
import { GroupBy } from 'common-js-util/build/common.utils'
import { StoreEvent, SubscribeToEvent } from 'state-manager-utility';
import _ from 'lodash';
import { HotKeys } from 'react-hotkeys';

export default class Sidenav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false,
            searchBarStatus: 0
            // onCollapse: props.onCollapse
        }
    }


    keyMap = {
        moveUp: 'shift+b',
    }
    handlers = {
        'moveUp': (event) => this.toggleNav(this.state.visible)
    }

    // componentDidMount() {
    //     // const main = document.getElementById("main");

    //     // if (main) {
    //     //     main.addEventListener('click', () => {
    //     //         if (this.state.visible) {
    //     //             this.toggleNav();
    //     //         }
    //     //     })
    //     // }
    //     // this.closeNav();
    // }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'searchMenu', callback: this.searchInMenus });
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

    searchInMenus = (data) => {
        const menus = this.props.menus;
        let matches = [];
        menus.forEach((module) => {
            module.menus.forEach((menu) => {
                if (data != "" && menu.name.toLowerCase().indexOf(data) != -1 && menu.visible == 1) {
                    menu.module = module.name
                    matches.push(menu)
                }
            });
        });

        let sortMenu = GroupBy(matches, 'module')
        StoreEvent({ eventName: 'searchInMenu', data: sortMenu })
    }

    toggleNav = (visible = this.state.visible) => {
        this.props.onCollapse(visible);
    }

    toggleMenu = (menu) => {
        StoreEvent({ eventName: 'toggledMenu', data: menu })
    }

    toggleSearchBar = (searchBarStatus) => {
        if (searchBarStatus) {

            this.setState({ searchBarStatus })
        }
        else {

            this.setState({ searchBarStatus })
        }
    }


    render() {
        const { visible } = this.state;
        const { menus } = this.props;


        return (

            <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
                <div id="mySidenav" className={`sidebar-wrapper no-scrollbar ${visible ? 'expanded' : 'collapsed'}`}>
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


                                <div className="menu-item" onClick={() => this.toggleMenu([])} >
                                    <div className="menu-label">
                                        <div className="menu-icon">
                                            <i className={`menu-icon fa ${'fa-search'}`}></i>
                                        </div>
                                        <div className="item-label `${visible ? 'menu-visible' : 'menu-hide'}`">
                                            Search
                                                </div>
                                    </div>
                                </div>

                                {
                                    menus.map((menu, key) => (
                                        <div className="menu-item" key={key} onClick={() => this.toggleMenu(menu)}>
                                            <div className="menu-label">
                                                <div className="menu-icon">
                                                    <i className={`menu-icon fa ${menu.image ? menu.image : 'fa-flickr'}`}></i>
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
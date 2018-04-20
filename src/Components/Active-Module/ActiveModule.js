import React, { Component } from 'react';
import './ActiveModule.css';

export default class ActiveModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // visible: props.visible || false
        }
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

    render() {
        // const { visible } = this.state;
        // this.operation(visible);
        // const { menus } = this.props;

        return (
            <div className="active-module">
                <div class="search-box">
                    <div class="search-box-header">
                        <div class="input-box">
                            {/* <input placeholder="Search Menus" type="text" class="form-control mousetrap" on-change="activeModule.findMatchingMenus()"
                            ng-model="activeModule.searchText" /> */}
                        </div>
                        <button class="btn btn-default" ng-click="activeModule.toggleMenus()">
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="search-box-body">
                        <p class="search-hint">
                            Select a module to list menus in it or type to search all the menus
                    </p>
                        <div class="panel menus">
                            <div class="panel-heading">
                                Menus
                    </div>
                            <div class="panel-body">
                                {/* <div class="menu-list"
                                ng-click="activeModule.navigateTo(menu)" ng-repeat="menu in (filteredResults = (activeModule.selectedModule.menus|filter:activeModule.searchText))">
                                <span class="pull-right" ng-if="activeModule.state.current.name == 'landing.'+menu.state_name">
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </span>
                            </div> */}

                            </div>
                        </div>
                    </div>

                    {/* <div class="panel menus" ng-if="activeModule.searchText" ng-repeat="module in activeModule.modules" ng-show="matchingFilteredResults.length">
                    <div class="panel-heading">
                    </div>
                    <div class="panel-body">
                        <div class="menu-list" ng-class="{'selected':activeModule.state.current.name=='landing.'+menu.state_name}" ng-if="(menu.active==1)&&(menu.visibility==1)"
                            ng-click="activeModule.navigateTo(menu)" ng-repeat="menu in (matchingFilteredResults = (module.menus|filter:activeModule.searchText|filter:{active:1,visibility:1}))">
                            <small>
                            </small>
                            <span class="pull-right" ng-if="activeModule.state.current.name == 'landing.'+menu.state_name">
                                <i class="fa fa-check" aria-hidden="true"></i>
                            </span>
                        </div>

                        <div ng-if="!matchingFilteredResults.length" class="empty">
                            <p class="lead">
                                No matching menus
                            </p>
                        </div>
                    </div>
                </div> */}

                </div>
                <div class="search-button">
                    <button class="btn btn-default" ng-click="activeModule.toggleMenus()">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        )
    }
}
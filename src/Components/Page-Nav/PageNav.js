import React, { Component } from 'react';
import './PageNav.css';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Redirect } from 'react-router-dom';

import GLOBAL from './../../Constants/global.constants';

import { SubscribeToEvent } from './../../Utils/stateManager.utils';
import { Get } from './../../Utils/http.utils';
import { SetItem, GetItem } from './../../Utils/localStorage.utils';

import CustomTooltip from '../Custom-Tooltip/customTooltip.component';


export default class PageNav extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            currentUser: {},
            selectedTheme: undefined
        };
    }

    themes = [{ theme: 'drivezy-light-theme', name: 'Light theme', class: 'light-theme' }, { theme: 'drivezy-dark-theme', name: 'Dark theme', class: 'dark-theme' }];

    componentDidMount() {
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
        const theme = GetItem('CURRENT_THEME') || this.themes[1];
        this.changeTheme(theme);
    }

    userDataFetched = (data) => {
        this.setState({ currentUser: data });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    logout = async () => {
        const res = await Get({ urlPrefix: GLOBAL.ROUTE_URL, url: 'logout' });
        // const l = res;
        if (res.success) {

            const a = (this.props.location ? this.props.location.state : null) || { from: { pathname: '/login' } };

            // this.props.history.push("/login");
            // location.href
            // alert('user loggedout successfully');

            this.setState({ redirectToReferrer: true });
        }
    }

    changeTheme = (theme) => {
        SetItem('CURRENT_THEME', theme);
        const div = document.getElementById('parent-admin-element');
        this.themes.forEach((themeDetail, key) => {
            if (themeDetail.theme != theme.theme) {
                div.classList.remove(themeDetail.theme);
                return;
            }

            div.classList.add(theme.theme);
        });
        this.setState({ selectedTheme: theme });
    }


    render() {
        const { currentUser, selectedTheme = {} } = this.state;
        const { from } = (this.props.location ? this.props.location.state : null) || { from: { pathname: '/login' } };
        const { redirectToReferrer } = this.state
        // this.props.setCurrentRoute(from)
        if (redirectToReferrer) {
            // Global.currentRoute = from;
            return (
                <Redirect to={from} />
            )
        }
        // const from = { pathname: '/' };
        // // this.logout();
        // return (
        //     <Redirect to={from} />
        // )
        return (
            <div className="page-nav flex">
                <div className='theme-selection-container flex'>
                    {
                        this.themes.map((theme, key) => {
                            const html = <div className={`cursor-pointer theme-box ${theme.class} ${selectedTheme.theme == theme.theme ? 'current-theme' : null}`} onClick={() => this.changeTheme(theme)} />

                            return (
                                <CustomTooltip placement="top" key={key} html={html} title={theme.name}></CustomTooltip>
                            )
                            // <div className='theme-box light-theme' onClick={() => this.changeTheme('drivezy-light-theme')} />
                        })
                    }

                    {/* <div className='theme-box dark-theme' onClick={() => this.changeTheme('drivezy-dark-theme')} /> */}
                </div>

                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle>

                        <div className="user-profile">
                            <div className="profile-image">
                                {this.state.currentUser.photograph ? <img src={`${this.state.currentUser.photograph}`} /> : <i className="fa fa-user-o" aria-hidden="true"></i>}

                            </div>
                        </div>

                    </DropdownToggle>

                    <DropdownMenu right>
                        <DropdownItem className="user-wrapper">
                            <a className="user-details">
                                <div className="display-name">
                                    {this.state.currentUser.display_name}
                                </div>
                                <div className="email">
                                    {this.state.currentUser.email}
                                    <i className="fa fa-cog" aria-hidden="true"></i>
                                </div>
                            </a>
                        </DropdownItem>
                        <DropdownItem>Clear Storage</DropdownItem>
                        <DropdownItem>Set Homepage</DropdownItem>
                        <DropdownItem>Change Password</DropdownItem>
                        <DropdownItem>Configure Search</DropdownItem>
                        <DropdownItem>Impersonate User</DropdownItem>
                        <DropdownItem onClick={(event) => { event.preventDefault(); this.logout() }}>Sign Out</DropdownItem>
                    </DropdownMenu>

                </ButtonDropdown>

            </div>
        );
    }
}
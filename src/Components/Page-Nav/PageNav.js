import React, { Component } from 'react';
import './PageNav.css';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Redirect } from 'react-router-dom';

import { ToastNotifications, LoaderComponent, LoaderUtils, ModalManager } from 'drivezy-web-utils/build/Utils';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';
import { Get, Post } from 'common-js-util';
import { SubscribeToEvent, StoreEvent, UnsubscribeEvent } from 'state-manager-utility';
import { Link } from 'react-router-dom';

import GLOBAL from './../../Constants/global.constants';

import SettingsUtil from './../../Utils/settings.utils';
import ThemeUtil from './../../Utils/theme.utils';
import ImpersonateFrom from './../../Components/Impersonate-Form/impersonateForm.component';
import { RemoveItem } from './../../Utils/localStorage.utils';
import { SetUserPreference } from './../../Utils/userPreference.utils';

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

    themes = ThemeUtil.getThemes();

    componentDidMount() {
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
        const theme = ThemeUtil.getCurrentTheme();
        const spacing = ThemeUtil.getCurrentSpacing();
        this.changeSpacing(spacing);
        this.changeTheme(theme);
    }

    componentWillUnmount() {
        UnsubscribeEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    userDataFetched = (data) => {
        this.setState({ currentUser: data });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    configureSettings = () => {
        SettingsUtil.configureModal();
    }

    impersonateUser = () => {

        ModalManager.openModal({
            headerText: "Impersonate User",
            modalBody: () => (<ImpersonateFrom ></ImpersonateFrom>)

        })

    }

    clearStorage = () => {
        RemoveItem({ clearLocalStorage: true });
        ToastNotifications.success({ title: 'Local-Storage cleared successfully' });
    }

    setHomepage = async() => {
        const result = await SetUserPreference('homepage', window.location.pathname);
        if(result.success){
            ToastNotifications.success({ title: 'Homepage has been set!' });
        }
    }

    deimpersonateUser = () => {
        const method = async () => {
            const result = await Post({ urlPrefix: GLOBAL.ROUTE_URL, url: "api/deImpersonateUser" });
            if (result.success) {
                ToastNotifications.success({ title: 'User is deimpersonated' });
                window.location.reload(true);
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to deimpersonate?", callback: method });
    }

    logout = async () => {
        const res = await Get({ urlPrefix: GLOBAL.ROUTE_URL, url: 'logout' });
        if (res.success) {
            const a = (this.props.location ? this.props.location.state : null) || { from: { pathname: '/login' } };
            StoreEvent({ eventName: 'loggedUser', data: {} });
            this.setState({ redirectToReferrer: true });
        }
    }


    changeSpacing = (spacing) => {
        ThemeUtil.setSpacing(spacing);
    }

    changeTheme = (theme) => {
        ThemeUtil.setTheme(theme);
        this.setState({ selectedTheme: theme });
    }


    render() {
        const { currentUser, selectedTheme = {} } = this.state;
        const { from } = (this.props.location ? this.props.location.state : null) || { from: { pathname: '/login' } };
        const { redirectToReferrer } = this.state
        if (redirectToReferrer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div className="page-nav flex">
                <LoaderComponent ref={(elem) => LoaderUtils.RegisterLoader(elem)} />


                {
                    currentUser.impersonated &&
                    <div className="impersonating-link">
                        <span className="link" onClick={this.deimpersonateUser}>
                            Deimpersonate
                        </span>
                    </div>
                }
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
                            <span className="user-details">
                                <Link to={`/user/${currentUser.id}`}>
                                    <div className="display-name">
                                        {this.state.currentUser.display_name}
                                    </div>
                                    <div className="email">
                                        {this.state.currentUser.email ? this.state.currentUser.email.substring(0, 6) : null}
                                        <i className="fa fa-cog" aria-hidden="true"></i>
                                    </div>
                                </Link>
                            </span>
                        </DropdownItem>
                        <DropdownItem onClick={this.clearStorage}>Clear Storage</DropdownItem>
                        <DropdownItem onClick={this.setHomepage}>Set Homepage</DropdownItem>
                        <DropdownItem>Change Password</DropdownItem>
                        <DropdownItem onClick={this.configureSettings}>Settings</DropdownItem>
                        <DropdownItem onClick={this.impersonateUser}>Impersonate User</DropdownItem>
                        <DropdownItem onClick={(event) => { event.preventDefault(); this.logout() }}>Sign Out</DropdownItem>
                    </DropdownMenu>

                </ButtonDropdown>

            </div>
        );
    }
}
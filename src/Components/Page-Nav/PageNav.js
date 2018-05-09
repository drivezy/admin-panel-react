import React, { Component } from 'react';
import './PageNav.css';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import GLOBAL from './../../Constants/global.constants';

import { SubscribeToEvent } from './../../Utils/stateManager.utils';

import { Get } from './../../Utils/http.utils';

import {
    Redirect
} from 'react-router-dom';

export default class PageNav extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            currentUser: {}
        };
    }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
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



    render() {

        const { currentUser } = this.state;
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
            <div className="page-nav">
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle>

                        <div className="user-profile">
                            <div className="profile-image">
                                <img src={`${this.state.currentUser.photograph}`} />
                            </div>
                        </div>

                    </DropdownToggle>

                    <DropdownMenu>
                        <DropdownItem>
                            <a className="user-details">
                                <div className="display-name">
                                    {this.state.currentUser.display_name}
                                </div>
                                <div className="email">
                                    {this.state.currentUser.email}
                                    <i className="fas fa-cog" aria-hidden="true"></i>
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
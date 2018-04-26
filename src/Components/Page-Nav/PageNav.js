import React, { Component } from 'react';
import './PageNav.css';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


export default class PageNav extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (
            <div className="page-nav">
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle>

                        <div className="user-profile">
                            <div className="profile-image"></div>
                        </div>

                    </DropdownToggle>

                    <DropdownMenu>
                        <DropdownItem>Clear Storage</DropdownItem>
                        <DropdownItem>Set Homepage</DropdownItem>
                        <DropdownItem>Change Password</DropdownItem>
                        <DropdownItem>Configure Search</DropdownItem>
                        <DropdownItem>Impersonate User</DropdownItem>
                        <DropdownItem>Sign Out</DropdownItem>
                    </DropdownMenu>
                    
                </ButtonDropdown>
            </div>
        );
    }
}
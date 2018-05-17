import React, { Component } from 'react';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import './filter.component.css';

export default class PredefinedFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false
        };
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    submit = (data) => {
        //console.log(data);
    }

    render() {
        const { userFilter } = this.props;
        return (



            <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                {/* <DropdownToggle data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}> */}
                <DropdownToggle caret
                    color="primary"
                    onClick={this.toggle}
                    data-toggle="dropdown"
                    aria-expanded={this.state.dropdownOpen}
                >
                    Filter
                </DropdownToggle>
                <DropdownMenu right
                >
                    {
                        userFilter.map((filter, index) => {
                            return (
                                <div className="dropdown-item" key={index} onClick={this.submit(filter)}>
                                    {filter.filter_name}
                                </div>
                            )
                        })
                    }
                </DropdownMenu>
            </Dropdown >

        );
    }
}

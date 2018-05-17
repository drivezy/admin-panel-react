import React, { Component } from 'react';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { Location } from './../../Utils/location.utils';

import './filter.component.css';

export default class PredefinedFilter extends React.Component {

    urlParams = Location.search();

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
        };
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    submit = (filter) => {
        const paramProps = {
            history: this.props.history, match: this.props.match
        };

        const urlParams = this.urlParams;

        urlParams.filter = filter.id;

        Location.search(urlParams, { props: paramProps });
    }

    render() {
        const { userFilter, history, match } = this.props;
        return (

            <div>

                {/* <div>
                    {
                        this.state.data ?
                            <span>{this.data.filter_name}</span>
                            :
                            null
                    }
                </div> */}

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
                    <DropdownMenu right>
                        {
                            userFilter.map((filter, index) => {
                                return (
                                    <div className="dropdown-item" key={index} onClick={() => this.submit(filter)}>
                                        {filter.filter_name}
                                    </div>
                                )
                            })
                        }
                    </DropdownMenu>
                </Dropdown >
            </div>

        );
    }
}

import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { Location } from './../../Utils/location.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { Delete } from './../../Utils/http.utils';
import { MenuFilterEndPoint } from './../../Constants/api.constants';

import './filter.component.css';

export default class PredefinedFilter extends React.Component {

    urlParams = Location.search();

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            searchText: '',
            filteredUserFilter: []
        };
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    setUrlProps = (urlParams) => {
        const { history, match } = this.props;
        Location.search(urlParams, { props: { history, match } });
    }

    deleteFilter = async (filter, event) => {
        let { userFilter, onFilterUpdate } = this.props;
        event.stopPropagation();
        if (window.confirm('Are you sure you want to delete the filter?')) {
            const result = await Delete({ url: `${MenuFilterEndPoint}/${filter.id}` });
            if (result.success) {
                userFilter = userFilter.filter(filterObj => filterObj.id != filter.id);
                onFilterUpdate(userFilter);
                const urlParams = Location.search();
                if (urlParams.filter && filter.id == urlParams.filter) {
                    urlParams.filter = null;
                    this.setUrlProps(urlParams);
                }
                ToastNotifications.success('Records has been deleted');
            }
        }
    }

    /**
     * Filters out list of filters according to text entered
     * @param  {object} event
     */
    searchFilter = (event) => {
        const searchText = event.target.value || '';
        const { userFilter } = this.props;

        const filteredUserFilter = userFilter.filter(filter => filter.filter_name.toLowerCase().includes(searchText.toLowerCase()));
        this.setState({ searchText, filteredUserFilter });
    }

    submit = (filter) => {
        const urlParams = Location.search();
        urlParams.filter = filter.id;
        this.setUrlProps(urlParams);
    }

    render() {
        const { userFilter, history, match } = this.props;
        const { filteredUserFilter, searchText } = this.state;
        const filters = searchText ? filteredUserFilter : userFilter;
        return (
            <div >
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
                    <DropdownMenu className="dropdown-menu custom-click pull-right menu-operations" right>
                        {
                            userFilter.length > 3 ?
                                <div>
                                    <div className="form-group has-feedback">
                                        <input value={searchText} onChange={this.searchFilter} type="text" className="form-control" id="search-operation" placeholder='Search Actions' />
                                        <i className="fa fa-search form-control-feedback" aria-hidden="true"></i>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            filters.map((filter, index) => {
                                return (
                                    <div className="menu-item" key={index} role="menuitem" onClick={() => this.submit(filter)}>
                                        <a className="menu-link">
                                            <span className="badge" onClick={(event) => this.deleteFilter(filter, event)}>
                                                <i className="fa fa-times" aria-hidden="true"></i>
                                            </span>
                                            {filter.filter_name}
                                        </a>
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

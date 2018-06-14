import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { Location } from './../../Utils/location.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { Delete } from './../../Utils/http.utils';
import { IsUndefined } from '../../Utils/common.utils';
import { DeletePreference } from './../../Utils/preference.utils';

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

    // @TODO delete preference from preference utils method
    deleteFilter = async (layout, event) => {
        let { layouts, onFilterUpdate } = this.props;
        event.stopPropagation();
        if (window.confirm('Are you sure you want to delete the filter?')) {
            const result = await DeletePreference({ layout });
            // const result = await Delete({ url: `${MenuFilterEndPoint}/${layout.id}` });
            if (result.success) {
                layouts = layouts.filter(filterObj => filterObj.id != layout.id);
                onFilterUpdate(layouts);
                const urlParams = Location.search();
                if (urlParams.layout && layout.id == urlParams.layout) {
                    urlParams.layout = null;
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
    searchFilter = ({ target = {}, value } = {}) => {
        const searchText = IsUndefined(value) ? target.value : '';
        const { layouts } = this.props;

        const filteredUserFilter = layouts.filter(layout => layout.name.toLowerCase().includes(searchText.toLowerCase()));
        this.setState({ searchText, filteredUserFilter });
    }

    submit = (layout) => {
        const urlParams = Location.search();
        urlParams.layout = layout.id;
        this.setUrlProps(urlParams);

        let dropdownOpen = this.state.dropdownOpen;
        this.setState({
            dropdownOpen: false
        });
    }

    render() {
        const { layouts, history, match } = this.props;
        const { filteredUserFilter, searchText } = this.state;
        const filters = searchText ? filteredUserFilter : layouts;
        return (
            <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                {/* <DropdownToggle data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}> */}
                <DropdownToggle caret
                    className='dropdown-button'
                    color="primary"
                    onClick={this.toggle}
                    data-toggle="dropdown"
                    aria-expanded={this.state.dropdownOpen}
                >
                    Filter
                    </DropdownToggle>
                <DropdownMenu className="dropdown-menu custom-click pull-right menu-operations" right>
                    {
                        layouts.length > 3 ?
                            <div>
                                <div className="form-group has-feedback">
                                    <input value={searchText} onChange={this.searchFilter} type="text" className="form-control" id="search-operation" placeholder='Search Actions' />
                                    <i onClick={() => searchText ? this.searchFilter({ value: null }) : null} className={`fa fa-${searchText ? 'times-circle cursor-pointer' : 'search'} form-control-feedback`} aria-hidden="true"></i>
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        filters.map((filter, index) => {
                            if (filter.name && filter.query) {
                                return (
                                    <div className="menu-item" key={index} role="menuitem" onClick={() => this.submit(filter)}>
                                        <a className="menu-link">
                                            <span className="badge" onClick={(event) => this.deleteFilter(filter, event)}>
                                                <i className="fa fa-times" aria-hidden="true"></i>
                                            </span>
                                            {filter.name}
                                        </a>
                                    </div>

                                )
                            }
                        })
                    }
                </DropdownMenu>
            </Dropdown>
        );
    }
}

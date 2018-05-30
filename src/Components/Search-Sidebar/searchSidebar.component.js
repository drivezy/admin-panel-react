import React, { Component } from 'react';
import './searchSidebar.css';

import { SubscribeToEvent } from './../../Utils/stateManager.utils';
import SearchBox from './../../Components/Search-Box/searchBox.component'
import { IsUndefined } from '../../Utils/common.utils';
import { SearchUtils } from './../../Utils/search.utils'

export default class SearchSidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            searchOptions: [],
            searchText: ''
        }
    }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'toggledMenu', callback: this.toggledMenu })
    }

    toggledMenu = () => {
        this.setState({ collapsed: false });
    }

    toggleSearch() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    search = ({ target = {}, value } = {}) => {
        const searchText = IsUndefined(value) ? target.value : '';
        this.setState({ searchText });
        const searchOptions = SearchUtils.searchKeyword(searchText)
    }

    render() {
        const { visible, collapsed, searchOptions = [], searchText } = this.state;
        return (
            <div className="search-sidebar">
                <div className={`search-box ${collapsed ? '' : 'expanded'}`}>
                    <div className="search-box-header">
                        <div className="input-box search-input">
                            <input placeholder="Search..." type="text" className="form-control mousetrap" value={searchText} onChange={this.search} />
                        </div>
                        <button className="btn btn-default" onClick={() => this.toggleSearch()}>
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="search-box-body">

                        {
                            searchText &&
                            <p className="search-hint">
                                Enter the keyword to search
                        </p>
                        }


                        {
                            searchOptions.map((option, key) => {
                                <SearchBox param={{ param: option, keyword: searchText }} onSelect={() => this.toggleSearch()} />
                            })
                        }

                        <div className="empty">
                            {
                                searchText && searchOptions.length &&
                                < p className="lead">
                                    No matching records
                                </p>
                            }
                        </div>
                    </div>
                </div>
                <div className="menus">
                    <div className="menu-item" onClick={() => this.toggleSearch()}>
                        <div className="menu-label">
                            <div className="menu-icon">
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </div>
                            <div className="item-label"> Search</div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
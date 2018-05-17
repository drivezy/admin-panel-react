import React, { Component } from 'react';
import { StoreEvent } from './../../Utils/stateManager.utils';
import { Location } from './../../Utils/location.utils';
import { IsEqualObject, SelectFromOptions } from './../../Utils/common.utils';
import { CreateQuery } from './../../Utils/dynamicFilter.utils';

import './dynamicFilter.css';

export default class DynamicFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true,
            urlParams: Location.search(),
            activeFilter: {},
            filters: props.userFilters,
            sqlArray: []
        };
    }

    componentWillReceiveProps(nextProps) {
        const urlParams = Location.search();
        const { filters } = this.state;

        this.state.urlParams = urlParams;
        this.state.filters = nextProps.userFilters;
        this.setActiveFilter();
        this.fetchSql(urlParams);
        
        // if (!IsEqualObject(this.state.urlParams, urlParams)) {
        //     // this.setState({ urlParams });
        //     this.state.urlParams = urlParams;
        //     this.fetchSql(urlParams);
        // } else {
        //     this.state.filters = nextProps.userFilters;
        //     this.setActiveFilter();
        // }
    }

    componentDidMount() {
        const { urlParams } = this.state;
        this.fetchSql(urlParams);
        // Find the active filter from the url
        this.setActiveFilter();
    }

    fetchSql = async (urlParams) => {
        const { dictionary } = this.props;
        if (urlParams.query) {
            // this.createQuery(urlParams.query);
            const result = await CreateQuery({ rawQuery: urlParams.query, dictionary, finalSql: this.finalSql });
            console.log(result);
        }
    }

    removeFilter = (index) => {
        // var params = $location.search();
        const { urlParams } = this.state;
        const [params] = [urlParams];
        const { match, history } = this.props;
        if (!params.query) {
            return;
        }
        const queries = params.query.split(" AND ");
        queries.splice(index, 1);
        // self.utilityMethod.resetColumns();

        params.query = queries.join(" AND ");

        if (params.query) {
            Location.search(params, { props: { history, match } });
        } else {
            delete params.query;
            Location.search(params, { props: { history, match } });
            this.setState({ sqlArray: [] });
        }

        // self.prepopulate.collapseMethod(true);
    }


    finalSql = ({ sql, key, parentKey, arr, sqlArray }) => {
        arr[parentKey] = arr[parentKey] ? arr[parentKey] : [];
        arr[parentKey][key] = sql;
        sqlArray[parentKey] = arr[parentKey];
        sqlArray[parentKey] = sqlArray[parentKey].join(" OR ");
        this.setState({ sqlArray });
    }

    /**
     * Iterates over predefined filters and match the id of provided filter
     * @param  {int} selectedFilterId
     */
    setActiveFilter() {
        const { filter: selectedFilterId } = this.state.urlParams;
        if (!selectedFilterId) {
            return;
        }
        const { filters = [] } = this.state;
        filters.forEach(filter => {
            if (selectedFilterId == filter.id) {
                this.setState({ activeFilter: filter });
            }
        });
    }

    /**
    * Remove the active saved filter
    */
    removeActiveFilter = () => {
        const { urlParams } = this.state;
        const { match, history } = this.props;
        delete urlParams.filter;
        Location.search(urlParams, { props: { match, history } });
        this.setState({ activeFilter: {} });
    }

    toggleAdvancedFilter = () => {
        const { isCollapsed } = this.state;
        this.setState({ isCollapsed: !isCollapsed });
        StoreEvent({ eventName: 'ToggleAdvancedFilter', data: !isCollapsed });
    }


    render() {
        const { isCollapsed, activeFilter, sqlArray = [], currentUser } = this.state;
        console.log(sqlArray);
        return (
            <div className="current-filter-view flex">
                <div
                    className="dynamic-filter-container cursor-pointer"
                    onClick={() => this.toggleAdvancedFilter()}
                >
                    Advanced
                </div>

                <div className="active-filters">
                    <ul className="form-groups">
                        {/* Blocks shows the active filter  */}
                        {
                            activeFilter && activeFilter.id ?
                                <li className="saved-filter form-badge list-group-item">
                                    <span className="delete-icon" onClick={this.removeActiveFilter}>
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </span>
                                    <p className="filter-name item-label">
                                        {activeFilter.filter_name}
                                    </p>
                                </li>
                                :
                                null
                        }
                        {/* Active Filter Ends  */}

                        {/* List of applied filters  */}
                        {
                            sqlArray.map((filter, key) => {
                                return (
                                    <li key={key} className="form-badge list-group-item">
                                        <span className="delete-icon" onClick={() => this.removeFilter(key)}>
                                            <i className="fa fa-times" aria-hidden="true"></i>
                                        </span>
                                        <p className="filter-name">
                                            {filter}
                                        </p>
                                    </li>
                                )
                            })
                        }

                        {
                            sqlArray.length ?
                                (!activeFilter.id ?
                                    <li className="clear-link">
                                        <button className="btn btn-xs btn-success" onClick={this.saveFilter}>
                                            <i className="fa fa-floppy-o" aria-hidden="true"></i>
                                            Save
                                </button>
                                    </li>
                                    :
                                    <li className="clear-link" >
                                        <button className="btn btn-xs btn-success" onClick={this.updateFilter}>
                                            <i className="fa fa-floppy-o" aria-hidden="true"></i>
                                            {currentUser.isSuperAdmin ? 'Update for All' : 'Create New'}
                                        </button>
                                    </li>
                                )
                                :
                                null
                        }

                        {
                            (sqlArray.length || activeFilter.id) ?
                                <li className="clear-link">
                                    <a onClick={this.clearQuery}>
                                        Clear
                                </a>
                                </li>
                                : null
                        }

                    </ul>
                </div>
            </div>
        );
    }
}
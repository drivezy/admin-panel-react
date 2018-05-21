import React, { Component } from 'react';
import { Location } from './../../Utils/location.utils';
import { IsEqualObject, SelectFromOptions, IsUndefinedOrNull } from './../../Utils/common.utils';
import { CreateQuery } from './../../Utils/dynamicFilter.utils';
import { Put, Post } from './../../Utils/http.utils';
import ToastNotifications from './../../Utils/toast.utils';

import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import { MenuFilterEndPoint } from './../../Constants/api.constants';

import './dynamicFilter.css';

export default class DynamicFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

    /**
     * takes query param from url and convert into array of queries
     * @param  {object} urlParams
     */
    fetchSql = async (urlParams) => {
        const { dictionary } = this.props;
        if (urlParams.query) {
            // this.createQuery(urlParams.query);
            const result = await CreateQuery({ rawQuery: urlParams.query, dictionary, finalSql: this.finalSql });
        } else {
            this.setState({ sqlArray: [] });
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
            params.query = null;
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
            this.setState({ activeFilter: {} });
            return;
        }
        const { filters = [] } = this.state;
        filters.forEach(filter => {
            if (selectedFilterId == filter.id) {
                this.setState({ activeFilter: filter });
            }
        });
    }

    clearQuery = () => {
        const { match, history } = this.props;
        this.state.sqlArray = [];
        Location.search({}, { props: { match, history } });
        // self.prepopulate.collapseMethod(true);
    }

    /**
    * Remove the active saved filter
    */
    removeActiveFilter = () => {
        const { urlParams } = this.state;
        const { match, history } = this.props;
        urlParams.filter = null;
        Location.search(urlParams, { props: { match, history } });
        this.setState({ activeFilter: {} });
    }

    /**
     * Updates the filter with the new filter
     * @param  {} activeFilter
     */
    updateLocalFetchedFilters = (activeFilter) => {
        let { filters } = this.state;
        const { menuUpdatedCallback } = this.props;
        filters.push(activeFilter);
        this.state.activeFilter = activeFilter;
        this.state.filters = filters;
        menuUpdatedCallback(filters);
    }

    /**
     * Update the existing filter with the query params
     */
    updateFilter = async () => {
        const { currentUser, selectedColumns = {}, match, history } = this.props;
        const { activeFilter = {}, urlParams } = this.state;
        if (currentUser.isSuperAdmin) {
            const result = await Put({
                url: MenuFilterEndPoint + '/' + activeFilter.id,
                body: {
                    filter_query: urlParams.query,
                    column_definition: JSON.stringify(selectedColumns)
                }
            });
            this.validateResult(result);
        } else {
            // Add a new filter
            this.openSaveFilterModal();
        }
    }

    /**
     * Once predefined filter is updated for being new created, their result is
     * passed to this method to validate and take actions on success
     * @param  {object} result
     */
    validateResult = (result) => {
        const { urlParams, activeFilter } = this.state;
        const { match, history } = this.props;
        if (result.success) {
            this.closeModal();
            // delete urlParams.query;
            // Assign the new filter to activeFilter
            this.updateLocalFetchedFilters(result.response);

            urlParams.filter = result.response.id;
            urlParams.query = null;
            Location.search(urlParams, { props: { match, history } });
            ToastNotifications.success("Filter updated");
        }
    }

    /**
     * Triggers modal for taking filter name
     */
    openSaveFilterModal = () => {
        ModalManager.openModal({
            headerText: 'Input Form',
            modalBody: this.renderform,
        });
    }

    /**
     * Closes filter name modal
     */
    closeModal = () => {
        ModalManager.closeModal();
    }

    /**
     * Opens modal to save filter for the user
     * @param  {boolean} override=false
     */
    saveFilter = async (override = false) => {
        const { menuId, selectedColumns } = this.props;
        const { filterName, urlParams, activeFilter, filters } = this.state;
        // Get the filter name 

        if (IsUndefinedOrNull(filterName)) {
            ToastNotifications.error('Please input filter name');
            return;
        }
        const result = await Post({
            url: MenuFilterEndPoint,
            body: {
                source_id: menuId,
                source_type: 'menu',
                filter_name: filterName,
                filter_query: urlParams.query,
                column_definition: JSON.stringify(selectedColumns),
                override_all: override
            }
        });

        this.validateResult(result);
    };

    renderform = () => {
        const { currentUser } = this.props;
        return (
            [
                <div key={1} className="modal-body whitesmoke-bg">
                    <div className="panel panel-info">
                        <div className="panel-body">
                            <div className="form-group">
                                <label htmlFor="filter">Filter</label>
                                <input validate="required" type="text"
                                    onChange={(event) => this.setState({ filterName: event.target.value })}
                                    className="form-control" placeholder="Enter Filter" />
                            </div>
                        </div>
                    </div>
                </div>,
                <div key={2} className="modal-footer ">
                    <div className="col-md-6 text-left">
                        {
                            currentUser.isSuperAdmin ?
                                <button className="btn btn-danger" onClick={() => this.saveFilter(true)}>
                                    Save for All
                                </button>
                                :
                                null
                        }
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-default" onClick={this.closeModal}> Cancel</button>
                        <button className="btn btn-success" onClick={() => this.saveFilter()} type="submit"> Save</button>
                    </div>
                </div>
            ]
        )
    }

    render() {
        const { activeFilter, sqlArray = [] } = this.state;
        const { currentUser = {}, toggleAdvancedFilter } = this.props;
        return (
            <div className="current-filter-view flex">
                <div
                    className="dynamic-filter-container cursor-pointer"
                    onClick={() => toggleAdvancedFilter()}
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
                                        <button className="btn btn-xs btn-success" onClick={this.openSaveFilterModal}>
                                            <i className="fa fa-floppy-o" aria-hidden="true"></i> &nbsp;
                                            Save
                                </button>
                                    </li>
                                    :
                                    <li className="clear-link" >
                                        <button className="btn btn-xs btn-success" onClick={this.updateFilter}>
                                            <i className="fa fa-floppy-o" aria-hidden="true"></i> &nbsp;
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
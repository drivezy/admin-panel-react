import React, { Component } from 'react';

import { Put, IsUndefinedOrNull } from 'common-js-util';

import { Location, ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';
import { CreateQuery } from './../../Utils/dynamicFilter.utils';
import { SetPreference } from './../../Utils/preference.utils';

import { MenuFilterEndPoint } from './../../Constants/api.constants';
import './dynamicFilter.css';

export default class DynamicFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urlParams: Location.search(),
            activeLayout: {},
            layouts: props.layouts,
            attachedSqlQueries: [props.restrictedQuery],
            sqlArray: []
            // sqlArray: [props.restrictedQuery]
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const urlParams = Location.search();
        const { layouts } = this.state;

        this.state.urlParams = urlParams;
        this.state.layouts = nextProps.layouts;
        this.setActiveFilter();
        this.fetchSql(urlParams);

        // if (!IsEqualObject(this.state.urlParams, urlParams)) {
        //     // this.setState({ urlParams });
        //     this.state.urlParams = urlParams;
        //     this.fetchSql(urlParams);
        // } else {
        //     this.state.layouts = nextProps.layouts;
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
        const { dictionary, restrictedQuery } = this.props;

        if (urlParams.query || restrictedQuery) {
            let query = urlParams.query || '';
            // query += urlParams.query && restrictedQuery ? ' and ' : '';
            // query += restrictedQuery || '';

            const result = await CreateQuery({ rawQuery: query, dictionary, finalSql: this.finalSql });
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
        const { restrictedQuery } = this.props;
        arr[parentKey] = arr[parentKey] ? arr[parentKey] : [];
        arr[parentKey][key] = sql;
        sqlArray[parentKey] = arr[parentKey];
        sqlArray[parentKey] = sqlArray[parentKey].join(" OR ");
        // if (restrictedQuery) {
        //     sqlArray = [...sqlArray, ...[restrictedQuery]];
        // }
        this.setState({ sqlArray });
    }

    /**
     * Iterates over predefined layouts and match the id of provided filter
     * @param  {int} selectedFilterId
     */
    setActiveFilter() {
        const { layout: selectedLayoutId } = this.state.urlParams;
        if (!selectedLayoutId) {
            this.setState({ activeLayout: {} });
            return;
        }
        const { layouts = [] } = this.state;
        layouts.forEach(filter => {
            if (selectedLayoutId == filter.id) {
                this.setState({ activeLayout: filter });
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
        urlParams.layout = null;
        Location.search(urlParams, { props: { match, history } });
        this.setState({ activeLayout: {} });
    }

    /**
     * Updates the filter with the new filter
     * @param  {} activeLayout
     */
    updateLocalFetchedFilters = (activeLayout) => {
        let { layouts } = this.state;
        const { menuUpdatedCallback } = this.props;
        activeLayout.column_definition = JSON.parse(activeLayout.column_definition);
        layouts.push(activeLayout);
        this.state.activeLayout = activeLayout;
        this.state.layouts = layouts;
        menuUpdatedCallback(layouts);
    }

    /**
     * Update the existing filter with the query params
     */
    updateFilter = async () => {
        const { currentUser, selectedColumns = {}, match, history } = this.props;
        const { activeLayout = {}, urlParams } = this.state;
        if (currentUser.isSuperAdmin) {
            // @TODO complete update process
            const result = await Put({
                url: MenuFilterEndPoint + '/' + activeLayout.id,
                body: {
                    query: urlParams.query,
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
        const { urlParams, activeLayout } = this.state;
        const { match, history } = this.props;
        if (result.success) {
            this.closeModal();
            // delete urlParams.query;
            // Assign the new filter to activeLayout
            this.updateLocalFetchedFilters(result.response);

            urlParams.layout = result.response.id;
            urlParams.query = null;
            Location.search(urlParams, { props: { match, history } });
            ToastNotifications.success({ message: "Filter updated" });
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
        const { menuId, selectedColumns, currentUser } = this.props;
        const { filterName, urlParams, activeLayout, layouts } = this.state;
        // Get the filter name 

        if (IsUndefinedOrNull(filterName)) {
            ToastNotifications.error('Please input filter name');
            return;
        }
        const result = await SetPreference({
            menuId,
            source: 'menu',
            name: filterName,
            query: urlParams.query,
            selectedColumns,
            user: override ? null : currentUser.id
        })
        // const result = await Post({
        //     url: MenuFilterEndPoint,
        //     body: {
        //         source_id: menuId,
        //         source_type: 'menu',
        //         name: filterName,
        //         filter_query: urlParams.query,
        //         column_definition: JSON.stringify(selectedColumns),
        //         user: override ? null : currentUser.id
        //     }
        // });

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
        let { activeLayout, sqlArray = [], attachedSqlQueries } = this.state;
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
                            activeLayout && activeLayout.id ?
                                <li className="saved-filter form-badge list-group-item">
                                    <span className="delete-icon" onClick={this.removeActiveFilter}>
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </span>
                                    <p className="filter-name item-label">
                                        {activeLayout.name}
                                    </p>
                                </li>
                                :
                                null
                        }
                        {/* Active Filter Ends  */}

                        {/* List of applied layouts  */}
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
                            attachedSqlQueries.map((query, key) => {
                                if (query) {
                                    return (
                                        <li key={key} className="form-badge list-group-item">
                                            <p className="filter-name">
                                                {query}
                                            </p>
                                        </li>
                                    )
                                }
                            })
                        }

                        {
                            sqlArray.length ?
                                (!activeLayout.id ?
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
                            (sqlArray.length || activeLayout.id) ?
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
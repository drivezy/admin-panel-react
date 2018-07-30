import React, { Component } from 'react';

import './genericListing.css';

import {
    Card, CardBody
} from 'reactstrap';

import { HotKeys } from 'react-hotkeys';

import { Get, BuildUrlForGetCall, SelectFromOptions, CopyToClipBoard } from 'common-js-util';
import { SubscribeToEvent, UnsubscribeEvent, StoreEvent, DeleteEvent } from 'state-manager-utility';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { GetUrlParams, Location } from 'drivezy-web-utils/build/Utils/location.utils';

import DynamicFilter from './../../Components/Dynamic-Filter/dynamicFilter.component';
import ConfigureDynamicFilter from './../../Components/Configure-Filter/configureFilter.component';
import ListingPagination from './../../Components/Listing-Pagination/ListingPagination';
import TableSettings from './../../Components/Table-Settings/TableSettings.component';
import PortletTable from './../../Components/Portlet-Table/PortletTable.component';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import PredefinedFilter from './../../Components/Dropdown-Filter/filter.component';
import ListingSearch from './../../Components/Listing-Search/listingSearch.component';

import { GetDefaultOptions, FilterTable, GetAggregation } from './../../Utils/genericListing.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage, CreateFinalColumns, GetPathWithParent } from './../../Utils/generic.utils';
import { GetListingRecord } from './../../Utils/genericListing.utils';

export default class GenericListing extends Component {
    filterContent = {};
    urlParams = Location.search();

    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            localSearch: {},
            genericData: this.props.genericData || {},
            filterContent: null,
            isCollapsed: true,
            source: this.props.source || 'menu',
            isTab: this.props.source ? true : false,
            loading: true
        };
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.urlParams = Location.search();
        const newProps = GetUrlParams(nextProps);
        this.state.params = newProps.params;
        this.state.queryString = newProps.queryString;
        if (this.state.menuDetail.url) {
            this.getListingData();
        }
    }

    componentWillUnmount() {
        this.state.isCollapsed = false;
        DeleteEvent({ eventName: 'ToggleAdvancedFilter' });
        UnsubscribeEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    userDataArrived = (user) => {
        const { menuDetail, genericData } = this.props;
        this.state.currentUser = user;

        if (genericData) {
            this.state.filterContent = genericData.filterContent;
            this.state.menuDetail = menuDetail;
            this.state.loading = false;
            return;
        } else if (menuDetail) {
            this.state.menuDetail = menuDetail;
            // this.setState({ menuDetail });
            this.getListingData();
        } else {
            this.getMenuData();
        }
    }

    getMenuData = async () => {
        const { queryString } = this.state;
        const { menuId, limit, page } = this.props;
        const result = await GetMenuDetail(menuId);
        if (result.success) {

            const { response = {} } = result;
            const menuDetail = ConvertMenuDetailForGenericPage(response || {});
            // if (typeof response.controller_path == 'string' && response.controller_path.includes('genericListingController.js') != -1) {
            this.state.menuDetail = menuDetail;
            this.getListingData();
            StoreEvent({ eventName: 'showMenuName', data: { menuName: this.state.menuDetail.pageName } });
            // }
        }
    }

    getListingData = () => {
        // this.setState({loading:})
        const { menuDetail, genericData, queryString, currentUser, isTab } = this.state;
        GetListingRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, queryString, currentUser, isTab });


    }

    dataFetched = ({ genericData, filterContent }) => {
        const { propageGenericDataToParent, index } = this.props;
        const { isTab } = this.state;
        this.setState({ genericData, filterContent, loading: false });
        if (genericData) {

            if (typeof propageGenericDataToParent == 'function') {
                genericData.filterContent = filterContent;
                propageGenericDataToParent(genericData, index);
            }
            if (!isTab) {
                StoreEvent({ eventName: 'rightClickData', data: { menuData: genericData } });
            }
        }
    }

    openAggregationResult = async (operator, caption, data) => {
        let options = GetDefaultOptions();
        options.aggregation_column = data.selectedColumn.path;
        options.aggregation_operator = operator;

        const url = BuildUrlForGetCall(data.menuDetail.url, options);

        const result = await Get({ url });

        if (result.success) {
            ToastNotifications.success({ description: result.response, title: caption });
        }
    }


    filterColumn = (column) => {
        let selected;
        if (column.path.split(".").length == 2) { // for columns which is child of table itself
            selected = column.path;
        }

        if (typeof this.toggleAdvancedFilter == 'function') {
            this.toggleAdvancedFilter({ single: selected });
        }
    };

    keyMap = {
        refresh: 'meta+r',          //Introducing Command + R buttons
    }

    handlers = {
        'refresh': (event) => this.refreshPage(event)   // RefreshPage function contains the function to be refreshed
    }

    toggleAdvancedFilter = (payload = {}) => {
        const { isCollapsed } = this.state;
        this.setState({ isCollapsed: !isCollapsed });
        StoreEvent({ eventName: 'ToggleAdvancedFilter', data: { isCollapsed: !isCollapsed, ...payload } });
    }

    predefinedFiltersUpdated = (latyouts) => {
        const { genericData } = this.state;
        genericData.layouts = latyouts;
        const layoutId = genericData.layout ? genericData.layout.id : null;
        genericData.layout = SelectFromOptions(genericData.layouts, layoutId, 'id') || [];
        // this.setState({ genericData });
        this.state.genericData = genericData;
    }

    layoutChanges = (layout) => {
        let { genericData, menuDetail } = this.state;
        genericData.layout = layout;
        menuDetail.layout = layout;
        if (layout && layout.column_definition) {
            genericData.finalColumns = CreateFinalColumns(genericData.columns, layout.column_definition, genericData.relationship);
            // this.setState({ genericData });
            this.state.genericData = genericData;
            this.state.menuDetail = menuDetail;
            this.getListingData();
        }
    }

    refreshPage(event) {
        event.preventDefault();
        this.getListingData();
    }

    /**
     * Maintain localSearch for locally searching on type 
     */
    filterLocally = (column, value) => {
        this.setState({ localSearch: { field: column ? column.name : '', value: value ? value : null } });
    }

    render() {
        const { source: propsSource } = this.props;
        const { localSearch, genericData = {}, pagesOnDisplay, menuDetail = {}, filterContent, currentUser, loading, isTab, source } = this.state;
        const { listing = [], finalColumns = [] } = genericData;
        const { starter } = genericData;

        let filteredResults = [];

        if (localSearch.value) {
            filteredResults = listing.filter(entry => entry[starter + '.' + localSearch.field] && (entry[starter + '.' + localSearch.field].toString().toLowerCase().indexOf(localSearch.value) != -1));
        }

        // const listingData = 
        const { history, match, parentData = {} } = this.props;
        return (
            <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
                <div className="generic-listing-container">
                    <div className="page-bar">
                        <div className="search-bar">
                            <div className="generic-listing-search">
                                {
                                    filterContent && filterContent.dictionary &&
                                    <ListingSearch localSearch={localSearch} onEdit={this.filterLocally} searchDetail={{ name: genericData.model.display_column }} dictionary={filterContent.dictionary} />
                                }
                            </div>
                            <div className="search-wrapper">
                                {
                                    filterContent && filterContent.dictionary &&
                                    <DynamicFilter
                                        toggleAdvancedFilter={this.toggleAdvancedFilter}
                                        menuUpdatedCallback={this.predefinedFiltersUpdated}
                                        selectedColumns={genericData.layout ? genericData.layout.column_definition : null}
                                        menuId={menuDetail.menuId}
                                        currentUser={currentUser}
                                        dictionary={filterContent.dictionary}
                                        layouts={menuDetail.layouts}
                                        restrictedQuery={menuDetail.restricted_query}
                                        restrictedColumn={menuDetail.restrictColumnFilter}
                                        history={history}
                                        match={match}
                                    />
                                }
                            </div>
                        </div>
                        <div className="header-actions">
                            <CustomAction position="header" source={isTab ? source : undefined} callback={this.getListingData} parentData={parentData} menuDetail={menuDetail} history={history} genericData={genericData} actions={genericData.nextActions} placement={'as_header'} />
                            <button className="refresh-button btn btn-sm" onClick={(e) => { this.refreshPage(e) }}>
                                <i className="fa fa-refresh"></i>
                            </button>

                            {
                                genericData.columns ?
                                    <TableSettings
                                        source={source}
                                        onSubmit={this.layoutChanges}
                                        listName={genericData.listName}
                                        layout={genericData.layout}
                                        columns={genericData.columns}
                                        menuId={menuDetail.menuId}
                                        userId={currentUser.id}
                                    />
                                    :
                                    null
                            }

                            {
                                menuDetail && menuDetail.layouts && menuDetail.layouts.length > 0 ?
                                    <PredefinedFilter onFilterUpdate={this.predefinedFiltersUpdated} layouts={menuDetail.layouts} history={history} match={match} />
                                    :
                                    null
                            }
                        </div>
                    </div>
                    <div className="configure-filter-wrapper">
                        {
                            filterContent &&
                            <ConfigureDynamicFilter
                                history={history}
                                match={match}
                                filters={genericData.userFilter}
                                content={filterContent}
                            />
                        }
                    </div>

                    {
                        loading ?
                            <div className="loading-text">
                                <h6>
                                    Loading content
                                </h6>
                            </div> :
                            <div>
                                {
                                    (finalColumns && finalColumns.length) ?
                                        <Card>
                                            <CardBody className="table-wrapper">

                                                {/* Portlet Table */}
                                                <PortletTable tableType="listing"
                                                    rowOptions={this.rowOptions}
                                                    parentData={parentData}
                                                    // toggleAdvancedFilter={this.toggleAdvancedFilter} 
                                                    history={history} match={match}
                                                    genericData={genericData}
                                                    finalColumns={finalColumns}
                                                    listing={localSearch.value ? filteredResults : listing}
                                                    callback={this.getListingData}
                                                    menuDetail={menuDetail}
                                                    source={propsSource || 'model'}
                                                    filterColumn={this.filterColumn}
                                                />
                                                {/* Portlet Table Ends */}

                                            </CardBody>
                                        </Card> : null
                                }

                                { (finalColumns[0] && finalColumns[0].defaultLayout) ? <div className="noColumnMessage">No columns were selected, displaying default columns</div> : null}

                                {
                                    (finalColumns && finalColumns.length) ?
                                        (genericData.stats.total ? <ListingPagination history={history} match={match} current_page={genericData.currentPage} limit={genericData.limit} statsData={genericData.stats} /> : null) : <div className="noListMessage">Looks like no columns are selected , Configure it by pressing the settings icon.</div>
                                }
                                {/* Listing Pagination Ends */}
                            </div>


                    }

                </div>
            </HotKeys>
        );
    }


    // Preparing option for right click
    rowOptions = [
        {
            id: 0,
            name: "Copy Row Id",
            icon: 'fa-copy',
            subMenu: false,
            onClick: (data) => {
                let id = data.listingRow[data.starter + '.id'];
                CopyToClipBoard(id);
                ToastNotifications.success({ description: "Id - " + id + " has been copied", title: 'Copy Id' });
            },
            disabled: false
        }, { subMenu: null }, {
            id: 1,
            name: "Show Matching",
            icon: 'fa-retweet',
            subMenu: false,
            onClick: (data) => {
                FilterTable(data, [" LIKE ", " = "]);
                return true;
                // return data.selectedColumn.path.split(".").length < 3;
            },
            disabled: false
        }, {
            id: 2,
            name: "Filter Out",
            icon: 'fa-columns',
            subMenu: false,
            onClick: (data) => {
                FilterTable(data, [" NOT LIKE ", " != "]);
                // return data.selectedColumn.path.split(".").length < 3;
                return true;
            },
            disabled: false
        }, {
            id: 3,
            name: "Filter More",
            icon: 'fa-filter',
            subMenu: false,
            onClick: (data) => {
                this.filterColumn(data.selectedColumn);
                // return data.selectedColumn.path.split(".").length < 3;
                return true;
            },
            disabled: false
        }, {
            id: 4,
            name: "Aggregation",
            icon: 'fa-chart-line',
            subMenu: true,
            onClick: (data, operator) => {
                GetAggregation(operator.name.toLowerCase(), operator.name + ' of ' + data.selectedColumn.display_name + ' equals : ', data)
            }, 
            disabled: (data) => (data.selectedColumn.path.split('.').length != 1)
        }, { subMenu: null },
        {
            id: 4,
            name: "Redirect Menu Detail",
            icon: 'fa-deaf',
            subMenu: false,
            onClick: (data) => {
                const { history, match } = this.props;

                let pageUrl = "/menu/" + data.menuDetail.menuId

                history.push(`${pageUrl}`);
            },
            disabled: false
        }, {
            id: 4,
            name: "Redirect Model Detail",
            icon: 'fa-info-circle',
            subMenu: false,
            onClick: (data) => {
                const { history, match } = this.props;

                let pageUrl = "/model/" + data.menuDetail.model.id

                history.push(`${pageUrl}`);
            },
            disabled: false
        }, {
            id: 0,
            name: "Preferences Settings",
            icon: 'fa-gift',
            subMenu: false,
            disabled: this.preferenceObj ? true : false,
            onClick: (data) => {
                const { genericData = {}, menuDetail } = this.state;
                const preferenceObj = { // used for editing preferences
                    name: menuDetail.pageName, // preference name to be shown on modal
                    role: true
                }
                if (genericData.preDefinedmethods && genericData.preDefinedmethods.preferenceSetting) {
                    genericData.preDefinedmethods.preferenceSetting(menuDetail.preference, preferenceObj);
                }
            }
        }
    ];
}

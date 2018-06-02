import React, { Component } from 'react';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, Button, DropdownMenu, DropdownItem
} from 'reactstrap';

import { GetUrlParams, Location } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage, CreateFinalColumns } from './../../Utils/generic.utils';
import { GetListingRecord } from './../../Utils/genericListing.utils';
import { SubscribeToEvent, UnsubscribeEvent, StoreEvent } from './../../Utils/stateManager.utils';

import DynamicFilter from './../../Components/Dynamic-Filter/dynamicFilter.component';
import ConfigureDynamicFilter from './../../Components/Dynamic-Filter/configureFilter.component';

import ListingPagination from './../../Components/Listing-Pagination/ListingPagination';
import TableSettings from './../../Components/Table-Settings/TableSettings.component';
import PortletTable from './../../Components/Portlet-Table/PortletTable.component';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';

import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import ModalWrap from './../../Wrappers/Modal-Wrapper/modalWrapper.component';

import PredefinedFilter from './../../Components/Dropdown-Filter/filter.component';
import ListingSearch from './../../Components/Listing-Search/listingSearch.component';
import { HotKeys } from 'react-hotkeys';
import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { Get } from './../../Utils/http.utils';
import { BuildUrlForGetCall } from './../../Utils/common.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';
import './genericListing.css';

export default class GenericListing extends Component {
    filterContent = {};
    urlParams = Location.search();

    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            localSearch: {},
            genericData: {},
            filterContent: null,
            isCollapsed: true
        };
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const newProps = GetUrlParams(nextProps);
        this.state.params = newProps.params;
        this.state.queryString = newProps.queryString;
        if (this.state.menuDetail.url) {
            this.getListingData();
        }
    }

    componentWillUnmount() {
        this.state.isCollapsed = false;
        UnsubscribeEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
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
            console.log(menuDetail);
            this.getListingData();
            StoreEvent({ eventName: 'showMenuName', data: { menuName: this.state.menuDetail.pageName } });
            // }
        }
    }

    getListingData = () => {
        const { menuDetail, genericData, queryString, currentUser } = this.state;
        GetListingRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, queryString, currentUser });
    }

    dataFetched = ({ genericData, filterContent }) => {
        // const totalPages = Math.ceil((genericData.stats.records / genericData.stats.count));

        // if (totalPages > 7) {
        //     // this.setState({ pagesOnDisplay: 7 });
        //     this.state.pagesOnDisplay = 7;
        // } else {
        //     // this.setState({ pagesOnDisplay: totalPages });
        //     this.state.pagesOnDisplay = Math.ceil(totalPages);
        // }qw
        this.setState({ genericData, filterContent });
    }


    openAggregationResult = async (operator, caption, data) => {

        let options = GetDefaultOptions();
        options.aggregation_column = data.selectedColumn.name;
        options.aggregation_operator = operator;

        const url = BuildUrlForGetCall(data.menuDetail.url, options);

        const result = await Get({ url });

        if (result.success) {
            ToastNotifications.success(caption + result.response);
        }
    }

    filterTable = (data, method) => {

        const paramProps = {
            history: data.history, match: data.match
        };

        console.log(data, method);
        let query = '';
        if (data.selectedColumn.path.split(".").length == 1) { // for columns which is child of table itself
            if (this.urlParams.query) { // if previous query present then it will executed
                let a = {};
                let f = 0;
                a = this.urlParams.query.split(" AND ");
                for (let i = 0; i < a.length; i++) { // for checking overlapping query
                    let b = {};
                    let newquery;
                    b = a[i].split(" LIKE ");
                    if (newquery == b[0]) {
                        f = 1;
                    }
                }
                if (f == 0) { // if not overlappin

                    query = this.urlParams.query + ' AND ' + data.selectedColumn.name + method[0] + "'" + data.listingRow[data.selectedColumn.name] + "'";

                    this.urlParams.query = query;
                    Location.search(this.urlParams, { props: paramProps });
                } else { // if overlappin

                    query = this.urlParams.query;

                    this.urlParams.query = query;
                    Location.search(this.urlParams, { props: paramProps });
                }
            } else { // if previous query not present then it will executed

                query = data.selectedColumn.name + method[0] + "'" + data.listingRow[data.selectedColumn.name] + "'";

                this.urlParams.query = query;
                Location.search(this.urlParams, { props: paramProps });
            }
        } else if (data.selectedColumn.path.split(".").length == 2) { // This will executed when showmatching clicked second time
            let regex = /.([^.]*)$/; // filters out anything before first '.'
            let path = data.selectedColumn.path.replace(regex, "");
            if (this.urlParams.query) { // if previous query present then it will executed
                let newquery = data.selectedColumn["parentColumn"];
                let a = {};
                let f = 0;
                a = this.urlParams.query.split(" AND ");
                for (let i = 0; i < a.length; i++) { // for checking overlapping query
                    let b = {};
                    b = a[i].split(" = ");
                    if (newquery == b[0]) {
                        f = 1;
                    }
                }
                if (f == 0) { // if not overlapping
                    query = this.urlParams.query + ' AND ' + data.selectedColumn["parentColumn"] + method[1] + "'" + data.listingRow[path]["id"] + "'";
                    Location.search({
                        query: query
                    });
                } else { // if overlapping
                    query = this.urlParams.query;
                    Location.search({
                        query: query
                    });
                }
            } else { // if previous query not present then it will executed

                query = data.selectedColumn["parentColumn"] + method[1] + "'" + data.listingRow[path]["id"] + "'";

                this.urlParams.query = query;

                Location.search(this.urlParams, { props: paramProps });
            }
        }
    }

    filterColumn = (column) => {
        let selected;
        if (column.path.split(".").length == 1) { // for columns which is child of table itself
            selected = column.name;
        } else if (column.path.split(".").length == 2) { // for reference columns (for e.g. Created by table in with any menu)
            selected = column.parentColumn;
        }

        if (typeof this.toggleAdvancedFilter == 'function') {
            this.toggleAdvancedFilter({ single: selected });
        }
    };


    keyMap = {
        moveUp: 'shift+r',
    }
    handlers = {
        'moveUp': (event) => this.getListingData()
    }

    toggleAdvancedFilter = (payload = {}) => {
        const { isCollapsed } = this.state;
        this.setState({ isCollapsed: !isCollapsed });
        StoreEvent({ eventName: 'ToggleAdvancedFilter', data: { isCollapsed: !isCollapsed, ...payload } });
    }

    userDataArrived = (user) => {
        this.state.currentUser = user;
        this.getMenuData();
        // this.setState({ currentUser: data });
    }

    predefinedFiltersUpdated = (filters) => {
        const { genericData } = this.state;
        genericData.userFilter = filters;
        this.setState({ genericData });
    }

    layoutChanges = (layout) => {
        let { genericData } = this.state;
        genericData.layout = layout;
        if (layout && layout.column_definition) {
            genericData.finalColumns = CreateFinalColumns(genericData.columns, layout.column_definition, genericData.relationship);
        }
        this.setState({ genericData });
    }

    refreshPage() {
        this.getListingData();
    }

    filterLocally = (column, value) => {
        this.setState({ localSearch: { field: column.name, value: value } });
        // let { genericData } = this.state;
        // let { listing = [] } = genericData;
        // listing = listing.filter((rowData) => {
        //     return rowData[column.name].toLowerCase().indexOf(value) != -1;
        // });
        // genericData.listing = listing;
        // this.setState({ genericData });
    }

    render() {
        const { localSearch, genericData = {}, pagesOnDisplay, menuDetail = {}, filterContent, currentUser } = this.state;
        const { listing = [], finalColumns = [] } = genericData;

        let filteredResults = [];

        if (localSearch.value) {
            filteredResults = listing.filter(entry => entry[localSearch.field] && (entry[localSearch.field].toString().toLowerCase().indexOf(localSearch.value) != -1));
        }

        // const listingData = 
        const { history, match } = this.props;
        return (
            <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
                <div className="generic-listing-container">
                    <div className="page-bar">
                        <div className="search-bar">
                            <div className="generic-listing-search">
                                {
                                    filterContent && filterContent.dictionary &&
                                    <ListingSearch onEdit={this.filterLocally} searchDetail={menuDetail.search} searchQuery={this.urlParams.search} dictionary={filterContent.dictionary} />
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
                                        history={history}
                                        match={match}
                                    />
                                }
                            </div>
                        </div>

                        <div className="header-actions">


                            <Button color="primary" size="sm" onClick={() => { this.refreshPage() }}>
                                <i className="fa fa-refresh"></i>
                            </Button>

                            <CustomAction history={history} genericData={genericData} actions={genericData.nextActions} placement={168} />

                            {
                                genericData.columns ?
                                    <TableSettings
                                        source='menu'
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
                                menuDetail && genericData.userFilter && genericData.userFilter.length > 0 ?
                                    <PredefinedFilter onFilterUpdate={this.predefinedFiltersUpdated} userFilter={genericData.userFilter} history={history} match={match} />
                                    :
                                    null
                            }
                        </div>
                    </div>

                    <div>
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
                        (finalColumns && finalColumns.length) ?


                            <Card>
                                <CardBody className="table-wrapper">

                                    {/* Portlet Table */}
                                    <PortletTable rowTemplate={this.rowTemplate} tableType="listing" rowOptions={this.rowOptions}
                                        toggleAdvancedFilter={this.toggleAdvancedFilter} history={history} match={match} genericData={genericData} finalColumns={finalColumns} listing={localSearch.value ? filteredResults : listing} callback={this.getListingData} menuDetail={menuDetail} />
                                    {/* Portlet Table Ends */}

                                </CardBody>
                            </Card> : null
                    }

                    {
                        (listing && listing.length) ?
                            <ListingPagination history={history} match={match} currentPage={genericData.currentPage} limit={genericData.limit} statsData={genericData.stats} /> : null
                    }
                    {/* Listing Pagination Ends */}

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
                let id = data.listingRow.id;
                CopyToClipBoard(id);
                ToastNotifications.success("Id - " + id + " has been copied");
            },
            disabled: false
        }, { subMenu: null }, {
            id: 1,
            name: "Show Matching",
            icon: 'fa-retweet',
            subMenu: false,
            onClick: (data) => {
                this.filterTable(data, [" LIKE ", " = "]);
                return data.selectedColumn.path.split(".").length < 3;
            },
            disabled: false
        }, {
            id: 2,
            name: "Filter Out",
            icon: 'fa-columns',
            subMenu: false,
            onClick: (data) => {
                this.filterTable(data, [" NOT LIKE ", " != "]);
                return data.selectedColumn.path.split(".").length < 3;
            },
            disabled: false
        }, {
            id: 3,
            name: "Filter More",
            icon: 'fa-filter',
            subMenu: false,
            onClick: (data) => {
                this.filterColumn(data.selectedColumn);
                return data.selectedColumn.path.split(".").length < 3;
            },
            disabled: false
        }, {
            id: 4,
            name: "Aggregation",
            icon: 'fa-chart-line',
            subMenu: true,
            onClick: (data, operator) => {
                console.log(data, operator);
                this.openAggregationResult(operator.name.toLowerCase(), operator.name + ' of ' + data.selectedColumn.display_name + ' equals : ', data)
            }, disabled: (data) => {
                return (data.selectedColumn.path.split('.').length != 1)
            }
        }, { subMenu: null },
        {
            id: 4,
            name: "Redirect Menu Detail",
            icon: 'fa-deaf',
            subMenu: false,
            onClick: (data) => {
                const { history, match } = this.props;

                let pageUrl = "/menuDef/" + data.menuDetail.menuId

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

                let pageUrl = "/modelDetails/" + data.menuDetail.model.id

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

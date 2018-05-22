import React, { Component } from 'react';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { GetUrlParams } from './../../Utils/location.utils';
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

import './genericListing.css';

export default class GenericListing extends Component {
    filterContent = {};
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            genericData: {},
            filterContent: null,
            isCollapsed: true
        };
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    componentWillReceiveProps(nextProps) {
        const newProps = GetUrlParams(nextProps);
        this.state.params = newProps.params;
        this.state.queryString = newProps.queryString;
        if (this.state.menuDetail.url) {
            this.getListingData();
        }
    }

    toggleAdvancedFilter = (payload = {}) => {
        const { isCollapsed } = this.state;
        this.setState({ isCollapsed: !isCollapsed });
        StoreEvent({ eventName: 'ToggleAdvancedFilter', data: { isCollapsed: !isCollapsed, ...payload } });
    }

    componentDidMount() {
        // this.getMenuData();
        // ModalManager.showModal({ onClose: this.closeModal, headerText: '1st using method', modalBody: () => (<h1> hi</h1>) });
    }

    componentWillUnmount() {
        // UnsubscribeEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    userDataArrived = (user) => {
        this.state.currentUser = user;
        this.getMenuData();
        // this.setState({ currentUser: data });
    }

    getMenuData = async () => {
        const { queryString } = this.state;
        const { menuId, limit, page } = this.props;
        const result = await GetMenuDetail(menuId);
        if (result.success) {

            const { response = {} } = result;
            const menuDetail = ConvertMenuDetailForGenericPage(response || {});
            if (typeof response.controller_path == 'string' && response.controller_path.includes('genericListingController.js') != -1) {
                // this.setState({ menuDetail });
                this.state.menuDetail = menuDetail
                this.getListingData();
                StoreEvent({ eventName: 'showMenuName', data: { menuName: this.state.menuDetail.pageName } });
            }
        }
    }

    getListingData = () => {
        const { menuDetail, genericData, queryString, currentUser } = this.state;
        GetListingRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, queryString, currentUser });
    }


    convertIt = (str) => {
        return str.replace(/.([^.]*)$/, "");
    }

    rowTemplate = ({ listingRow, selectedColumn }) => {
        let val;

        if (selectedColumn.route) {
            let id;
            if (selectedColumn.path.split('.')[1]) {
                id = this.convertIt(selectedColumn.path);
                id = eval('listingRow.' + id).id;
            } else {
                id = listingRow.id;
            }
            val = <a href={`${selectedColumn.reference_route}${id}`} >{eval('listingRow.' + selectedColumn.path)}</a>
        } else {
            try {
                val = eval('listingRow.' + selectedColumn.path);
            } catch (e) {
                val = null;
            }
        }
        return (<span>{val}</span>);
    }



    dataFetched = ({ genericData, filterContent }) => {
        // const totalPages = Math.ceil((genericData.stats.records / genericData.stats.count));

        // if (totalPages > 7) {
        //     // this.setState({ pagesOnDisplay: 7 });
        //     this.state.pagesOnDisplay = 7;
        // } else {
        //     // this.setState({ pagesOnDisplay: totalPages });
        //     this.state.pagesOnDisplay = Math.ceil(totalPages);
        // }
        this.setState({ genericData, filterContent });
    }

    predefinedFiltersUpdated = (filters) => {
        const { menuDetail } = this.state;
        menuDetail.userFilter = filters;
        this.setState({ menuDetail });
    }

    layoutChanges = (selectedColumns) => {
        let { genericData } = this.state;
        genericData.selectedColumns = selectedColumns;
        genericData.finalColumns = CreateFinalColumns(genericData.columns, selectedColumns, genericData.relationship);
        this.setState({ genericData });
    }

    render() {
        const { genericData = {}, pagesOnDisplay, menuDetail = {}, filterContent, currentUser } = this.state;
        const { listing = [], finalColumns = [] } = genericData;
        const { history, match } = this.props;
        return (
            <div className="generic-listing-container">
                {/* <ModalWrap
                    isVisible
                    headerText="tesfh"
                    modalBody={() => (<h1> h2</h1>)}
                    closeModal={() => this.setState({ isVisible: false })}
                /> */}
                <div className="page-bar">
                    <div className="search-wrapper">
                        {
                            filterContent && filterContent.dictionary &&
                            <DynamicFilter toggleAdvancedFilter={this.toggleAdvancedFilter} menuUpdatedCallback={this.predefinedFiltersUpdated} selectedColumns={genericData.selectedColumns} menuId={menuDetail.menuId} currentUser={currentUser} dictionary={filterContent.dictionary} userFilters={menuDetail.userFilter} history={history} match={match} />
                        }
                    </div>

                    <div className="header-actions">

                        <div className="btn-group" role="group" aria-label="Basic example">

                            <CustomAction history={history} genericData={genericData} actions={genericData.nextActions} placement={168} />

                            {
                                genericData.columns ?
                                    <TableSettings
                                        onSubmit={this.layoutChanges}
                                        listName={genericData.listName}
                                        selectedColumns={genericData.selectedColumns}
                                        columns={genericData.columns}
                                    />
                                    :
                                    null
                            }
                        </div>
                        {
                            menuDetail.userFilter ?
                                <PredefinedFilter onFilterUpdate={this.predefinedFiltersUpdated} userFilter={menuDetail.userFilter} history={history} match={match} />
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
                            filters={menuDetail.userFilter}
                            content={filterContent}
                        />
                    }
                </div>

                {
                    (finalColumns && finalColumns.length) &&
                    <Card>
                        <CardBody>

                            {/* Portlet Table */}
                            <PortletTable rowTemplate={this.rowTemplate}
                                toggleAdvancedFilter={this.toggleAdvancedFilter} history={history} match={match} genericData={genericData} finalColumns={finalColumns} listing={listing} callback={this.getListingData} menuDetail={menuDetail} />
                            {/* Portlet Table Ends */}

                            {/* Listing Pagination */}
                            {
                                Array.isArray(listing) && listing.length ?

                                    <ListingPagination history={history} match={match} currentPage={genericData.currentPage} statsData={genericData.stats} />
                                    : null}
                            {/* Listing Pagination Ends */}

                        </CardBody>
                    </Card>
                }


            </div>
        );
    }
}
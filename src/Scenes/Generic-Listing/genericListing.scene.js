import React, { Component } from 'react';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import './genericListing.css';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage, CreateFinalColumns } from './../../Utils/generic.utils';
import { GetListingRecord } from './../../Utils/genericListing.utils';

import DynamicFilter from './../../Components/Dynamic-Filter/dynamicFilter.component';
import ConfigureDynamicFilter from './../../Components/Dynamic-Filter/configureFilter.component';

import ListingPagination from './../../Components/Listing-Pagination/ListingPagination';
import TableSettings from './../../Components/Table-Settings/TableSettings.component';
import PortletTable from './../../Components/Portlet-Table/PortletTable.component';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';

import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import ModalWrap from './../../Wrappers/Modal-Wrapper/modalWrapper.component';

export default class GenericListing extends Component {
    filterContent = {};
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            genericData: {},
            filterContent: null
        };
    }

    componentWillReceiveProps(nextProps) {
        // console.log(this.state);
        // console.log(GetUrlParams(nextProps));
        const newProps = GetUrlParams(nextProps);
        this.state.params = newProps.params;
        this.state.queryString = newProps.queryString;
        this.getListingData();
    }

    componentDidMount() {
        this.getMenuData();
        // ModalManager.showModal({ onClose: this.closeModal, headerText: '1st using method', modalBody: () => (<h1> hi</h1>) });
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
            }
        }
    }

    getListingData = () => {
        const { menuDetail, genericData, queryString } = this.state;
        GetListingRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, queryString });
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
        // console.log(genericData);


        this.setState({ genericData, filterContent });
    }


    layoutChanges = (selectedColumns) => {
        let { genericData } = this.state;
        genericData.selectedColumns = selectedColumns;
        genericData.finalColumns = CreateFinalColumns(genericData.columns, selectedColumns, genericData.relationship);
        this.setState({ genericData });
    }

    render() {
        const { genericData = {}, pagesOnDisplay, menuDetail = {}, filterContent } = this.state;
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
                        <DynamicFilter />
                    </div>
                    <div className="header-actions">

                        <div className="btn-group" role="group" aria-label="Basic example">
                            {/* <button type="button" className="btn btn-sm btn-secondary">Left</button>
                            <button type="button" className="btn btn-sm btn-secondary">Middle</button>
                            <button type="button" className="btn btn-sm btn-secondary">Right</button> */}

                            <CustomAction history={history} genericData={genericData} actions={genericData.nextActions} placement={168} />

                            {
                                genericData.columns ?
                                    <TableSettings onSubmit={this.layoutChanges} listName={genericData.listName} selectedColumns={genericData.selectedColumns} columns={genericData.columns} />
                                    :
                                    null
                            }
                        </div>
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

                <Card>
                    <CardBody>
                        {
                            (finalColumns && finalColumns.length) ?
                                <PortletTable history={history} match={match} genericData={genericData} finalColumns={finalColumns} listing={listing} callback={this.getListingData} /> : null
                        }
                        <ListingPagination history={history} match={match} genericData={genericData} />
                    </CardBody>
                </Card>
            </div>
        );
    }
}
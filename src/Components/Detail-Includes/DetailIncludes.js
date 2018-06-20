import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col,
    TabContent, TabPane, Nav, NavItem, NavLink, Table
} from 'reactstrap';

import CustomAction from './../Custom-Action/CustomAction.component';
import PortletTable from './../../Components/Portlet-Table/PortletTable.component';
import TableSettings from './../../Components/Table-Settings/TableSettings.component';

import { Location } from './../../Utils/location.utils';
import { CreateInclusions, GetColumnsForListing, CreateFinalColumns, RegisterMethod } from './../../Utils/generic.utils';
import { GetColumnsForDetail } from './../../Utils/genericDetail.utils';
import { GetListingRecord } from './../../Utils/genericListing.utils';

import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';


import './DetailIncludes.css';

let shouldComponentWillReceivePropsRun = true;
export default class DetailIncludes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: this.props.tabs,
            tabContent: [],
            activeTab: 0
        }
    }

    componentDidMount() {
        this.buildTabData(this.props); // iterate through tabs and fetch data
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (shouldComponentWillReceivePropsRun) { // when setting hash to the url, prevents componentWillReceiveProps from executing again
            // this.setState({ tabs: nextProps.tabs });
            this.state.tabs = nextProps.tabs;
            this.buildTabData(nextProps);
        }
        shouldComponentWillReceivePropsRun = true;
    }

    /**
     * Iterate through each tab, 
     * Makes api call for individual tab and callback
     * @param {object} props
     * @memberof DetailIncludes
     */
    buildTabData = async (props) => {
        // @TODO get Active tab and load that first
        const hash = window.location.hash.replace('#', '');

        const { tabs = {}, currentUser } = props;
        const { tabContent } = this.state;

        const includesArr = Object.keys(tabs);
        const tabsArr = Object.values(tabs);

        let activeTab = includesArr.indexOf(hash); // match if default open tab is there on the url
        activeTab = activeTab == -1 ? 0 : activeTab;

        const tab = tabsArr[activeTab];
        await GetListingRecord({ configuration: tab, callback: this.updateTabContent, data: tabContent[activeTab] || {}, currentUser, index: activeTab })
        this.state.activeTab = activeTab;

        tabsArr.forEach((tab, key) => {
            if (activeTab != key) {
                GetListingRecord({ configuration: tab, callback: this.updateTabContent, data: tabContent[key] || {}, currentUser, index: key })
            }
        })
    }

    /**
     * callback on arrival of data for individual tab
     * also gets index to keeps track of tab
     * @param  {object} {genericData
     * @param  {int} index}
     */
    updateTabContent = ({ genericData: tabDetail, index }) => {
        const { tabContent, tabs } = this.state;
        const tabsIndices = Object.keys(tabs);
        tabDetail.modelId = tabDetail.menuId;
        tabContent[index] = tabDetail;
        tabContent[index].index = tabsIndices[index];
        this.setState({ tabContent });
    }

    /**
     * Change tab selection
     * @param  {int} tab - tab index
     */
    toggle = (key, tab) => {
        if (this.state.activeTab !== key) {
            this.setState({
                activeTab: key
            });
        }

        if (tab && tab.index) {
            shouldComponentWillReceivePropsRun = false;
            window.location.hash = tab.index;
        }
    }

    /**
     * Being triggered on layout change 
     * @param  {object} layout
     */
    layoutChanges = (layout) => {
        let { tabContent, activeTab } = this.state;
        tabContent[activeTab].layout = layout;
        tabContent[activeTab].finalColumns = CreateFinalColumns(tabContent[activeTab].columns, layout.column_definition, tabContent[activeTab].relationship);
        this.setState({ tabContent });
    }

    render() {
        const { tabs, tabContent, activeTab } = this.state;
        const { history = {}, callback, currentUser } = this.props;
        const arr = [];
        const tabsArr = Object.values(tabs);
        // Object.keys(tabs.data).map((tab)=>(

        // ))

        return (
            <Card className="detail-includes">
                <CardBody>
                    <div className='generic-tabs-container'>
                        <Nav tabs>
                            {
                                tabContent.length ?
                                    tabContent.map((tab, key) => (
                                        <NavItem key={key} >
                                            <NavLink
                                                className={`${activeTab === key ? 'active' : ''}`}
                                                onClick={() => { this.toggle(key, tab); }}>
                                                <i className="fa fa-bars"></i> {tab.pageName}
                                            </NavLink>
                                        </NavItem>
                                    ))
                                    : null
                            }
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            {
                                tabContent.length ?
                                    tabContent.map((tab, key) => {
                                        if (activeTab == key) {
                                            return (
                                                <TabPane className='relative' key={key} tabId={key}>
                                                    {/* Building the table iterating through the row to display tab content */}
                                                    <div className='table-header'>
                                                        <div className='btn-group header-actions'>
                                                            <CustomAction history={history} source='modelAlias' genericData={tab} actions={tab.nextActions} placement={168} callback={callback} source='modelAlias' />
                                                        </div>

                                                        <a className="btn btn-secondary btn-sm" onClick={() => Location.navigate({ url: `/modelAliasDetail/${tab.relationship[tab.starter].id}` })}>
                                                            <i className="fa fa-outdent" uib-tooltip="Redirect to Model Alias detail"></i>
                                                        </a>
                                                        {
                                                            tab.columns && tab.finalColumns ?
                                                                <TableSettings
                                                                    source='modelAlias'
                                                                    onSubmit={this.layoutChanges}
                                                                    listName={tab.listName}
                                                                    layout={tab.layout}
                                                                    columns={tab.columns}
                                                                    menuId={tabsArr[key].menuId}
                                                                    userId={currentUser.id}
                                                                    source='modelAlias'
                                                                />
                                                                :
                                                                null
                                                        }
                                                    </div>

                                                    <PortletTable
                                                        finalColumns={tab.finalColumns}
                                                        listing={tab.listing}
                                                        genericData={tab}
                                                        callback={tab.refreshContent}
                                                        rowOptions={this.rowOptions}
                                                        source='modelAlias'
                                                    />
                                                </TabPane>
                                            )
                                        }
                                    })
                                    : null}
                        </TabContent>
                    </div>
                </CardBody>
            </Card>

        )
    }

    rowOptions = [{
        id: 0,
        name: "Copy Row Id",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            // let id = data.listingRow.id;
            let id = data.listingRow[data.starter + '.id'];
            CopyToClipBoard(id);
            ToastNotifications.success("Id - " + id + " has been copied");
        }
    }];
}
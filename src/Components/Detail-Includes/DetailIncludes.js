import React, { Component } from 'react';
import {
    Card, CardBody,
    TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap';

import TableSettings from './../../Components/Table-Settings/TableSettings.component';
import GenericListing from './../../Scenes/Generic-Listing/genericListing.scene';

import { CreateFinalColumns } from './../../Utils/generic.utils';

import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';


import './DetailIncludes.css';

let shouldComponentWillReceivePropsRun = true;
export default class DetailIncludes extends Component {
    constructor(props) {
        super(props);
        const tabs = this.getProcessedTab(props.tabs);

        const hash = window.location.hash.replace('#', '');
        const includesArr = Object.keys(tabs);
        let activeTab = includesArr.indexOf(hash); // match if default open tab is there on the url
        activeTab = activeTab == -1 ? 0 : activeTab;
        if (!hash) {
            window.location.hash = includesArr[0]
        }

        this.state = {
            tabs,
            tabContent: [],
            activeTab: activeTab,
            tabsGenericData: {}
        }
    }

    componentDidMount() {
        this.buildTabData(this.props); // iterate through tabs and fetch data
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
        if (shouldComponentWillReceivePropsRun) { // when setting hash to the url, prevents componentWillReceiveProps from executing again
            // this.setState({ tabs: nextProps.tabs });
            this.state.tabs = this.getProcessedTab(nextProps.tabs);
            this.buildTabData(nextProps);
        }
        shouldComponentWillReceivePropsRun = true;
    }

    getProcessedTab(tabsArray) {
        const tabs = {};
        for (let i in tabsArray) {
            const tab = tabsArray[i];
            const { uiActions = [] } = tab;
            const modelAliasRedirect = {
                // @TODO add model alias rediect method
                as_header: true,
                image: 'fa-outdent',
                parameter: 'menuDef/:id',
                active: true,
                name: 'Redirect Model Alias'
            };

            tab.uiActions.push(modelAliasRedirect);

            tabs[i] = tab;
            tabs[i].index = i;
        }

        return tabs;
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
        // await GetListingRecord({ configuration: tab, callback: this.updateTabContent, data: tabContent[activeTab] || {}, currentUser, index: activeTab })
        this.state.activeTab = activeTab;

        // tabsArr.forEach((tab, key) => {
        //     if (activeTab != key) {
        //         GetListingRecord({ configuration: tab, callback: this.updateTabContent, data: tabContent[key] || {}, currentUser, index: key })
        //     }
        // })
    }

    /**
     * callback on arrival of data for individual tab
     * also gets index to keeps track of tab
     * @param  {object} {genericData
     * @param  {int} index}
     */
    // updateTabContent = ({ genericData: tabDetail, index }) => {
    //     const { tabContent, tabs } = this.state;
    //     const tabsIndices = Object.keys(tabs);
    //     tabDetail.modelId = tabDetail.menuId;
    //     tabContent[index] = tabDetail;
    //     tabContent[index].index = tabsIndices[index];
    //     this.setState({ tabContent });
    // }

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

    /**
     * Saves generic data of tab to avoid extra call
     * @param  {} genericData
     * @param  {} index
     */
    storeTabGenericData = (genericData, index) => {
        const { tabsGenericData } = this.state;
        tabsGenericData[index] = genericData;
        this.state.tabsGenericData = tabsGenericData;
    }

    render() {
        const { tabs, tabContent, activeTab, tabsGenericData } = this.state;
        const { history = {}, callback, currentUser, location, match, parentData } = this.props;
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
                                tabsArr.length ?
                                    tabsArr.map((tab, key) => (
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
                                tabsArr.length ?
                                    tabsArr.map((tab, key) => {
                                        if (activeTab == key) {
                                            return (
                                                <TabPane className='relative' key={key} tabId={key}>
                                                    {/* Building the table iterating through the row to display tab content */}
                                                    <div className='table-header'>
                                                        {/* <div className='btn-group header-actions'>
                                                            <CustomAction history={history} source='modelAlias' genericData={tab} actions={tab.nextActions} placement={'as_header'} parentData={parentData} callback={callback} source='modelAlias' />
                                                        </div>

                                                        <a className="btn btn-secondary btn-sm" onClick={() => Location.navigate({ url: `/modelAliasDetail/${tab.relationship[tab.starter].id}` })}>
                                                            <i className="fa fa-outdent" uib-tooltip="Redirect to Model Alias detail"></i>
                                                        </a> */}
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

                                                    {/* <PortletTable
                                                        finalColumns={tab.finalColumns}
                                                        listing={tab.listing}
                                                        genericData={tab}
                                                        callback={tab.refreshContent}
                                                        rowOptions={this.rowOptions}
                                                        source='modelAlias'
                                                    /> */}
                                                    <GenericListing
                                                        parentData={parentData}
                                                        menuDetail={tab}
                                                        source='modelAlias'
                                                        location={location}
                                                        match={match}
                                                        genericData={tabsGenericData[key]}
                                                        propageGenericDataToParent={this.storeTabGenericData}
                                                        index={key}
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
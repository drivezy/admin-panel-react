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
export default class DetailPortlet extends Component {
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
     * @memberof DetailPortlet
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
                                                            <CustomAction history={history} genericData={tab} actions={tab.nextActions} placement={168} callback={callback} />
                                                        </div>

                                                        <a className="btn btn-secondary btn-sm" onClick={() => Location.navigate({ url: `/modelAliasDetail/${tab.relationship.id}` })}>
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
                                                                />
                                                                :
                                                                null
                                                        }
                                                    </div>

                                                    <PortletTable
                                                        finalColumns={tab.finalColumns}
                                                        listing={tab.listing}
                                                        // genericData={tabContent[key]}
                                                        genericData={{}}
                                                        callback={tab.refreshContent}
                                                        rowOptions={this.rowOptions}
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



    // @TODO keeping old code temporarily... will remove later
    // /**
    //  * splits includes on comma and iterates through them to add extra properties to each tab
    //  * @param  {object} props 
    //  */
    // buildTabData = (props) => {
    //     // 
    //     const data = props.tabs;
    //     const hash = window.location.hash;

    //     // this.resolve = [];
    //     const includes = data.includes.split(",");

    //     this.preferences = {};
    //     this.state.tabContent = [];
    //     for (const i in includes) {
    //         const tab = {};
    //         const inclusions = includes[i].split(".");
    //         const index = data.starter + "." + inclusions[0];
    //         const relationship = data.relationship[index];
    //         const configure = data.dictionary[index];

    //         tab.listName = index + ".list";
    //         tab.modelName = index + ".form"; // earlier formName in old panel
    //         // tab.formName = index + ".form"; // earlier formName in old panel

    //         tab.relationship = relationship;
    //         tab.dataModel = relationship.related_model; // new entry
    //         if (relationship.related_model && relationship.related_model.route_name) {
    //             tab.module = relationship.related_model.route_name.replace('api/admin/', '');
    //         }

    //         tab.name = relationship.alias_name;
    //         tab.image = relationship.image;
    //         tab.path = relationship.route_name;

    //         tab.index = index; // earlier index in old panel
    //         if (hash.includes(index)) {
    //             this.state.activeTab = parseInt(i);
    //         }
    //         // index == 
    //         tab.identifier = inclusions[0];
    //         tab.preference = "";
    //         tab.fixedParams = data.fixedParams;
    //         tab.refreshContent = data.refreshContent; //  function to refresh whole detail content
    //         tab.scripts = [];

    //         // this.formPreferences = []; // @TODO seems useless, remove line after sometime, 

    //         // check if there are other includes of the same identifier
    //         let finalIncludes = includes[i];
    //         for (const j in includes) {
    //             if (includes[i] != includes[j]) {
    //                 if (includes[j].split(".")[0] == inclusions[0]) {
    //                     finalIncludes += "," + includes[j];
    //                     delete includes[j];
    //                 }
    //             }
    //         }

    //         const params = {
    //             includes: CreateInclusions(finalIncludes), starter: data.starter, dictionary: {}
    //         };

    //         const dictionary = params.includes.split(",");
    //         for (const k in dictionary) {
    //             const dicIndex = data.starter + "." + dictionary[k];
    //             params.dictionary[dicIndex] = data.dictionary[dicIndex];
    //         }
    //         params.relationship = data.relationship;

    //         // list of columns of all included models, used to configure view columns
    //         const par = JSON.parse(JSON.stringify(params));
    //         // const par = { ...{}, ...params };
    //         tab.columns = GetColumnsForDetail(par);
    //         // tab.columns = GetColumnsForListing(params);
    //         // tab.columns = MenuService.getColumns(params);

    //         params.includes = inclusions[0];
    //         params.dictionary = {};
    //         params.dictionary[index] = configure;
    //         params.excludeStarter = 1;

    //         // list of columns only related to particular model, used to configure generic forms
    //         tab.configure = GetColumnsForListing({ ...params });

    //         relationship.actions.map((action) => (
    //             action.callback = tab.refreshContent
    //         ));

    //         tab.nextActions = relationship.actions; // generic actions (can be predefined or custom ones)
    //         tab.preDefinedmethods = data.preDefinedmethods;
    //         tab.methods = RegisterMethod(tab.nextActions);

    //         // @TODO script incjection is disabled as of now
    //         // var scripts = InjectScriptFactory.returnMatchingScripts({
    //         //     preference: index, scripts: this.responseArray.scripts, searchConstraint: "startsWith"
    //         // });
    //         // Array.prototype.push.apply(tab.scripts, scripts);

    //         this.preferences[tab.identifier] = relationship.preferences[tab.listName] ? JSON.parse(relationship.preferences[tab.listName]) : null;

    //         // preference for form of particular tab
    //         tab.formPreference = relationship.preferences[tab.modelName] ? JSON.parse(relationship.preferences[tab.modelName]) : null;

    //         tab.selectedColumns = this.preferences[tab.identifier];
    //         // list of selected column preference
    //         tab.finalColumns = CreateFinalColumns(tab.columns, this.preferences[tab.identifier], params.relationship);
    //         this.state.tabContent.push(tab);
    //     }

    //     const tabContent = this.state.tabContent;
    //     this.setState({ tabContent });
    //     // this.setState({})
    // }


    rowOptions = [{
        id: 0,
        name: "Copy Row Id",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let id = data.listingRow.id;
            CopyToClipBoard(id);
            ToastNotifications.success("Id - " + id + " has been copied");
        }
    }];
}
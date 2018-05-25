import React, { Component } from 'react';
import './DetailIncludes.css';

import CustomAction from './../Custom-Action/CustomAction.component';
import { CreateInclusions, GetColumnsForListing, CreateFinalColumns, RegisterMethod } from './../../Utils/generic.utils';
import { GetColumnsForDetail } from './../../Utils/genericDetail.utils';
import TableSettings from './../../Components/Table-Settings/TableSettings.component';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';

import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';

import { TabContent, TabPane, Nav, NavItem, NavLink, Table } from 'reactstrap';

import PortletTable from './../../Components/Portlet-Table/PortletTable.component';

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

    componentDidMount() {
        this.buildTabData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (shouldComponentWillReceivePropsRun) { // when setting hash to the url, prevents componentWillReceiveProps from executing again
            // this.setState({ tabs: nextProps.tabs });
            this.state.tabs = nextProps.tabs;
            this.buildTabData(nextProps);
        }
        shouldComponentWillReceivePropsRun = true;
    }

    /**
     * splits includes on comma and iterates through them to add extra properties to each tab
     * @param  {object} props 
     */
    buildTabData = (props) => {
        // 
        const data = props.tabs;
        const hash = window.location.hash;

        // this.resolve = [];
        const includes = data.includes.split(",");

        this.preferences = {};
        // this.state.tabContent = [];
        for (const i in includes) {
            const tab = {};
            const inclusions = includes[i].split(".");
            const index = data.starter + "." + inclusions[0];
            const relationship = data.relationship[index];
            const configure = data.dictionary[index];

            tab.listName = index + ".list";
            tab.modelName = index + ".form"; // earlier formName in old panel
            // tab.formName = index + ".form"; // earlier formName in old panel

            tab.relationship = relationship;
            tab.dataModel = relationship.related_model; // new entry
            if (relationship.related_model && relationship.related_model.route_name) {
                tab.module = relationship.related_model.route_name.replace('api/admin/', '');
            }

            tab.name = relationship.alias_name;
            tab.image = relationship.image;
            tab.path = relationship.route_name;

            tab.index = index; // earlier index in old panel
            if (hash.includes(index)) {
                this.state.activeTab = parseInt(i);
            }
            // index == 
            tab.identifier = inclusions[0];
            tab.preference = "";
            tab.fixedParams = data.fixedParams;
            tab.refreshContent = data.refreshContent; //  function to refresh whole detail content
            tab.scripts = [];

            // this.formPreferences = []; // @TODO seems useless, remove line after sometime, 

            // check if there are other includes of the same identifier
            let finalIncludes = includes[i];
            for (const j in includes) {
                if (includes[i] != includes[j]) {
                    if (includes[j].split(".")[0] == inclusions[0]) {
                        finalIncludes += "," + includes[j];
                        delete includes[j];
                    }
                }
            }

            const params = {
                includes: CreateInclusions(finalIncludes), starter: data.starter, dictionary: {}
            };

            const dictionary = params.includes.split(",");
            for (const k in dictionary) {
                const dicIndex = data.starter + "." + dictionary[k];
                params.dictionary[dicIndex] = data.dictionary[dicIndex];
            }
            params.relationship = data.relationship;

            // list of columns of all included models, used to configure view columns
            const par = JSON.parse(JSON.stringify(params));
            // const par = { ...{}, ...params };
            tab.columns = GetColumnsForDetail(par);
            // tab.columns = GetColumnsForListing(params);
            // tab.columns = MenuService.getColumns(params);

            params.includes = inclusions[0];
            params.dictionary = {};
            params.dictionary[index] = configure;
            params.excludeStarter = 1;

            // list of columns only related to particular model, used to configure generic forms
            tab.configure = GetColumnsForListing({ ...params });

            relationship.actions.map((action) => (
                action.callback = tab.refreshContent
            ));

            tab.nextActions = relationship.actions; // generic actions (can be predefined or custom ones)
            tab.preDefinedmethods = data.preDefinedmethods;
            tab.methods = RegisterMethod(tab.nextActions);

            // @TODO script incjection is disabled as of now
            // var scripts = InjectScriptFactory.returnMatchingScripts({
            //     preference: index, scripts: this.responseArray.scripts, searchConstraint: "startsWith"
            // });
            // Array.prototype.push.apply(tab.scripts, scripts);

            this.preferences[tab.identifier] = relationship.preferences[tab.listName] ? JSON.parse(relationship.preferences[tab.listName]) : null;

            // preference for form of particular tab
            tab.formPreference = relationship.preferences[tab.modelName] ? JSON.parse(relationship.preferences[tab.modelName]) : null;

            tab.selectedColumns = this.preferences[tab.identifier];
            // list of selected column preference
            tab.finalColumns = CreateFinalColumns(tab.columns, this.preferences[tab.identifier], params.relationship);
            this.state.tabContent.push(tab);
        }

        const tabContent = this.state.tabContent;
        this.setState({ tabContent });
        // this.setState({})
    }

    /**
     * Change tab selection
     * @param  {int} tab - tab index
     */
    toggle = (key, tab) => {
        console.log(tab);
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

    layoutChanges = (selectedColumns) => {
        let { tabContent, activeTab } = this.state;
        tabContent[activeTab].selectedColumns = selectedColumns;
        tabContent[activeTab].finalColumns = CreateFinalColumns(tabContent[activeTab].columns, selectedColumns, tabContent[activeTab].relationship);
        this.setState({ tabContent });
    }

    rowTemplate({ listingRow, selectedColumn }) {
        let val;
        try {
            val = eval('listingRow.' + selectedColumn.path);
        } catch (e) {
            val = '';
        }
        return (<span>{val}</span>);
    }

    render() {
        const { tabs, tabContent, activeTab } = this.state;
        const { history, callback } = this.props;
        const arr = [];
        // Object.keys(tabs.data).map((tab)=>(

        // ))

        return (
            <Card>
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
                                                {tab.relationship.display_name}
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
                                                        <div className='btn-group'>
                                                            <CustomAction history={history} genericData={tab} actions={tab.nextActions} placement={168} callback={callback} />
                                                        </div>

                                                        <a className="btn btn-danger" href={`/modelAliasDetail/${tab.relationship.id}`}>
                                                            <i className="fa fa-outdent" uib-tooltip="Redirect to Model Alias detail"></i>
                                                        </a>
                                                        {
                                                            tab.columns && tab.finalColumns ?
                                                                <TableSettings
                                                                    onSubmit={this.layoutChanges}
                                                                    listName={tab.listName}
                                                                    selectedColumns={tab.selectedColumns}
                                                                    columns={tab.columns}
                                                                />
                                                                :
                                                                null
                                                        }
                                                    </div>

                                                    <PortletTable
                                                        finalColumns={tab.finalColumns}
                                                        listing={tabs.data[tab.index]}
                                                        rowTemplate={this.rowTemplate}
                                                        genericData={tabContent[key]}
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
}
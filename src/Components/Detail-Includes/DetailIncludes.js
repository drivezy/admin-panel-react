import React, { Component } from 'react';
import './DetailIncludes.css';


import { CreateInclusions, GetColumnsForListing, CreateFinalColumns } from './../../Utils/generic.utils';
import { GetColumnsForDetail } from './../../Utils/genericDetail.utils';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';

import { TabContent, TabPane, Nav, NavItem, NavLink, Table } from 'reactstrap';

import PortletTable from './../../Components/Portlet-Table/PortletTable';

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
        this.buildTabData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ tabs: nextProps.tabs });
        this.buildTabData(nextProps);
    }

    buildTabData = (props) => {
        // 
        const data = props.tabs;

        // this.resolve = [];
        const includes = data.includes.split(",");

        this.preferences = {};

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
            tab.columns = GetColumnsForDetail(params);
            // tab.columns = GetColumnsForListing(params);
            // tab.columns = MenuService.getColumns(params);

            params.includes = inclusions[0];
            params.dictionary = {};
            params.dictionary[index] = configure;
            params.excludeStarter = 1;

            // list of columns only related to particular model, used to configure generic forms
            tab.configure = GetColumnsForListing(params);

            relationship.actions.map((action) => (
                action.callback = tab.refreshContent
            ));

            tab.nextActions = relationship.actions; // generic actions (can be predefined or custom ones)


            // @TODO script incjection is disabled as of now
            // var scripts = InjectScriptFactory.returnMatchingScripts({
            //     preference: index, scripts: this.responseArray.scripts, searchConstraint: "startsWith"
            // });
            // Array.prototype.push.apply(tab.scripts, scripts);

            this.preferences[tab.identifier] = relationship.preferences[tab.listName] ? JSON.parse(relationship.preferences[tab.listName]) : null;

            // preference for form of particular tab
            tab.formPreference = relationship.preferences[tab.modelName] ? JSON.parse(relationship.preferences[tab.modelName]) : null;

            // list of selected column preference
            tab.finalColumns = CreateFinalColumns(tab.columns, this.preferences[tab.identifier], params.relationship);

            // var resolve = {
            //     resolve: {
            //         modelAliasId: relationship.id
            //     }
            // };

            // this.resolve.push(resolve);
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
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    rowTemplate({ listingRow, selectedColumn }) {
        return (<span>{eval('listingRow.' + selectedColumn.path)} </span>);
    }

    render() {
        const { tabs, tabContent } = this.state;
        const arr = [];
        // Object.keys(tabs.data).map((tab)=>(

        // ))

        return (
            <div className="tabs-container">
                <Nav tabs>
                    {
                        tabContent.length ?
                            tabContent.map((tab, key) => (
                                <NavItem key={key} >
                                    <NavLink
                                        className={`${this.state.activeTab === key ? 'active' : ''}`}
                                        onClick={() => { this.toggle(key); }}>
                                        {tab.relationship.display_name}
                                    </NavLink>
                                </NavItem>
                            ))
                            : null}
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    {
                        tabContent.length ?
                            tabContent.map((tab, key) => (
                                <TabPane key={key} tabId={key}>
                                    <PortletTable
                                        finalColumns={tab.finalColumns}
                                        listing={tabs.data[tab.index]}
                                        rowTemplate={this.rowTemplate}
                                        genericData={tabContent[key]}
                                        callback={tab.refreshContent}
                                    />

                                    {/* <Table striped>
                                        <thead>
                                            <tr>
                                                {
                                                    tabContent[key].finalColumns.map((column, key) => (
                                                        <th key={key}> {column.display_name}</th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                tabs.data[tab.index].map((listingRow, rowKey) => (
                                                    <tr key={rowKey}>
                                                        {tabContent[key].finalColumns.map((column, key) => (
                                                            <td key={key}>
                                                                {eval('listingRow.' + column.column_name)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table> */}
                                </TabPane>
                            ))
                            : null}
                </TabContent>
            </div>
        )
    }
}
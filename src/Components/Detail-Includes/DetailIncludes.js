import React, { Component } from 'react';
import './DetailIncludes.css';


import { CreateInclusions, GetColumnsForListing, CreateFinalColumns } from './../../Utils/generic.utils';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';

import { TabContent, TabPane, Nav, NavItem, NavLink, Table } from 'reactstrap';

export default class DetailPortlet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: this.props.tabs,
            tabContent: []
        }
    }

    componentDidMount() {

        this.buildTabData(this.props);
    }

    componentWillReceiveProps(nextProps) {

        // this.buildTabData(nextProps);
    }

    buildTabData = (props) => {
// 
        var self = this;

        var data = props.tabs;

        self.resolve = [];

        var includes = data.includes.split(",");

        self.preferences = {};

        for (var i in includes) {
            var tab = {};
            var inclusions = includes[i].split(".");
            var index = data.starter + "." + inclusions[0];
            var relationship = data.relationship[index];

            tab.name = relationship.alias_name;
            tab.image = relationship.image;
            var configure = data.dictionary[index];
            tab.relationship = relationship;

            tab.index = index;
            tab.path = relationship.route_name;
            tab.identifier = inclusions[0];
            tab.listName = data.starter + "." + inclusions[0] + ".list";
            tab.formName = data.starter + "." + inclusions[0] + ".form";
            tab.preference = "";
            tab.fixedParams = data.fixedParams;
            tab.callFunction = data.callFunction;
            tab.scripts = [];
            self.formPreferences = [];

            // check if there are other includes of the same identifier
            var finalIncludes = includes[i];
            for (var j in includes) {
                if (includes[i] != includes[j]) {
                    if (includes[j].split(".")[0] == inclusions[0]) {
                        finalIncludes += "," + includes[j];
                        delete includes[j];
                    }
                }
            }

            var params = {
                includes: CreateInclusions(finalIncludes), starter: data.starter, dictionary: {}
            };

            var dictionary = params.includes.split(",");
            for (var k in dictionary) {
                var dicIndex = data.starter + "." + dictionary[k];
                params.dictionary[dicIndex] = data.dictionary[dicIndex];
            }
            params.relationship = data.relationship;
            tab.columns = GetColumnsForListing(params);
            // tab.columns = MenuService.getColumns(params);

            params.includes = inclusions[0];
            params.dictionary = {};
            params.dictionary[index] = configure;
            params.excludeStarter = 1;

            tab.configure = GetColumnsForListing(params);

            tab.actions = relationship.actions;

            // var scripts = InjectScriptFactory.returnMatchingScripts({
            //     preference: index, scripts: self.responseArray.scripts, searchConstraint: "startsWith"
            // });
            // Array.prototype.push.apply(tab.scripts, scripts);

            self.preferences[tab.identifier] = relationship.preferences[tab.listName] ? JSON.parse(relationship.preferences[tab.listName]) : null;
            tab.formPreferences = relationship.preferences[tab.formName] ? JSON.parse(relationship.preferences[tab.formName]) : null;

            tab.finalColumns = CreateFinalColumns(tab.columns, self.preferences[tab.identifier], params.relationship);

            var resolve = {
                resolve: {
                    modelAliasId: relationship.id
                }
            };

            self.resolve.push(resolve);
            this.state.tabContent.push(tab);
        }

        const tabContent = this.state.tabContent;
        this.setState({tabContent});
        // this.setState({})

    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
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

                                    <Table striped>
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
                                                            <td key={key}>{listingRow[column.column_name]}</td>
                                                        ))}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </TabPane>
                            ))
                            : null}
                </TabContent>
            </div>
        )
    }
}
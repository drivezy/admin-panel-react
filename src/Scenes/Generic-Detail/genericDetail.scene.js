import React, { Component } from 'react';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Table
} from 'reactstrap';

import { StoreEvent, SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';

import DetailPortlet from './../../Components/Detail-Portlet/DetailPortlet.component';
import DetailIncludes from './../../Components/Detail-Includes/DetailIncludes';
import TableSettings from './../../Components/Table-Settings/TableSettings.component';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import RightClick from './../../Components/Right-Click/rightClick.component';

import { GetUrlParams, Location } from './../../Utils/location.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage, CreateFinalColumns } from './../../Utils/generic.utils';
import { GetDetailRecord } from './../../Utils/genericDetail.utils';
import { createFinalObject } from './../../Utils/table.utils';

import './genericDetail.css';

export default class GenericDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            portlet: {},
            tabs: {},
            tabsPreference: {}
        };

        this.currentUrl = this.getHref();
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    componentWillUnmount() {
        UnsubscribeEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    componentDidMount() {
        this.getMenuData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const newProps = GetUrlParams(nextProps);
        this.state.params = newProps.params;
        this.state.queryString = newProps.queryString;

        // if menuDetail object has fetched url and current url is different than previous one, fetch data
        if (this.state.menuDetail.url && this.currentUrl != this.getHref()) {
            this.currentUrl = this.getHref();
            this.getDetailRecord();
        }
    }

    userDataArrived = (user) => {
        this.state.currentUser = user;
        // this.getMenuData();
        // this.setState({ currentUser: data });
    }

    getHref() {
        return window.location.href.split('#')[0];
    }


    getMenuData = async () => {
        const { queryString } = this.state;
        // const { menuId } = queryString;
        const { menuId } = this.props;
        const result = await GetMenuDetail(menuId);
        if (result.success) {
            const { response = {} } = result;
            const menuDetail = ConvertMenuDetailForGenericPage(response || {});
            // if (typeof response.controller_path == 'string' && response.controller_path.includes('genericListingController.js') != -1) {
            // menuDetail.listName = menuDetail.stateName.toLowerCase();
            this.state.menuDetail = menuDetail;
            this.getDetailRecord();
            StoreEvent({ eventName: 'showMenuName', data: { menuName: this.state.menuDetail.pageName } });
            // }
        }
    }

    getDetailRecord = () => {
        const { menuDetail, genericData, urlParameter, params } = this.state;
        // const {menuId} = this.props
        GetDetailRecord({ configuration: menuDetail, callback: this.dataFetched, data: genericData, urlParameter: params });
    }

    dataFetched = ({ tabDetail, portlet }) => {
        tabDetail.refreshContent = this.getDetailRecord;
        this.setState({ portlet, tabDetail });
    }

    getColumn = (preference, dictionary) => {
        // return preference.column
    }

    layoutChanges = (layout) => {
        let { portlet, menuDetail } = this.state;
        // portlet.finalColumns = layout;
        // menuDetail.preference['menudef.detail.list'] = JSON.stringify(layout);
        menuDetail.layout = layout;

        if (layout && layout.column_definition) {
            portlet.finalColumns = CreateFinalColumns(portlet.portletColumns, layout.column_definition, portlet.relationship);
            this.setState({ portlet, menuDetail });
        }
    }

    render() {
        const { history } = this.props;
        const { menuDetail = {}, portlet = {}, tabDetail = {}, currentUser = {} } = this.state;
        const { finalColumns = [], data = {}, formPreference = {}, starter } = portlet;

        const genericDataForCustomColumn = {
            formPreference,
            starter,
            columns: portlet.portletColumns,
            modelName: menuDetail.formPreferenceName + '.form',
            // module: menuDetail.url ? menuDetail.url.split("/:")[0] : '',
            url: menuDetail.url ? menuDetail.url.split("/:")[0] : '',
            model: portlet.model,
            modelId: portlet.model && portlet.model.id,
            methods: portlet.methods,
            preDefinedmethods: portlet.preDefinedmethods
        };

        const html =
            <div className="header">
                <div className="left" />

                <div className="right">
                    <div className="btn-group header-actions" id="generic-detail-header-dynamic-icon-group">
                        <CustomAction history={history} genericData={genericDataForCustomColumn} actions={portlet.nextActions} listingRow={data} placement={167} callback={this.getDetailRecord} />
                    </div>

                    {
                        portlet.portletColumns ?
                            <TableSettings
                                source='menu'
                                onSubmit={this.layoutChanges}
                                listName={portlet.listName}
                                layout={menuDetail.layout}
                                columns={portlet.portletColumns}
                                menuId={menuDetail.menuId}
                                userId={currentUser.id}
                            // finalColumns={finalColumns}
                            />
                            : null
                    }
                </div>
            </div>;

        return (
            <div className="generic-detail-container">
                <RightClick renderTag="div" html={html} rowOptions={this.rowOptions} ></RightClick>

                <div className="detail-content">
                    {
                        finalColumns.length ?
                            <DetailPortlet listingRow={data} finalColumns={finalColumns} starter={starter} />
                            : null
                    }

                    {
                        tabDetail && tabDetail.tabs ?
                            <DetailIncludes tabs={tabDetail.tabs} callback={this.getDetailRecord} currentUser={currentUser} />
                            : null
                    }
                </div>
            </div>
        )
    }


    rowOptions = [
        {
            id: 0,
            name: "Redirect Menu Detail",
            icon: 'fa-deaf',
            subMenu: false,
            onClick: (data) => {
                const { history, match } = this.props;

                let pageUrl = "/menuDef/" + this.state.menuDetail.menuId
                Location.navigate({ url: pageUrl });
                // history.push(`${pageUrl}`);
            }
        }, {
            id: 1,
            name: "Redirect Model Detail",
            icon: 'fa-info-circle',
            subMenu: false,
            onClick: (data) => {
                const { history, match } = this.props;

                let url = "/modelDetails/" + this.state.menuDetail.model.id
                Location.navigate({ url });
                // history.push(`${url}`);
            }
        }, {
            id: 0,
            name: "Edit Menu",
            icon: 'fa-pencil',
            subMenu: false,
            onClick: (data) => {
                const { portlet = {}, menuDetail } = this.state;
                if (portlet.preDefinedmethods && portlet.preDefinedmethods.editMenu) {
                    portlet.preDefinedmethods.editMenu(menuDetail.menuId);
                }
            }
        }, {
            id: 0,
            name: "Preferences Settings",
            icon: 'fa-gift',
            subMenu: false,
            disabled: this.preferenceObj ? true : false,
            onClick: (data) => {
                const { portlet = {}, menuDetail } = this.state;
                const preferenceObj = { // used for editing preferences
                    name: menuDetail.pageName, // preference name to be shown on modal
                    role: true
                }
                if (portlet.preDefinedmethods && portlet.preDefinedmethods.preferenceSetting) {
                    portlet.preDefinedmethods.preferenceSetting(menuDetail.preference, preferenceObj);
                }
            }
        }
    ];
}
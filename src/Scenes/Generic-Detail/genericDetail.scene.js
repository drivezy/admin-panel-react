import React, { Component } from 'react';

import { GetUrlParams, Location } from 'drivezy-web-utils/build/Utils/location.utils';
import { StoreEvent, SubscribeToEvent, UnsubscribeEvent } from 'state-manager-utility';

import DetailPortlet from './../../Components/Detail-Portlet/DetailPortlet.component';
import DetailIncludes from './../../Components/Detail-Includes/DetailIncludes';
import TableSettings from './../../Components/Table-Settings/TableSettings.component';
import CustomAction from './../../Components/Custom-Action/CustomAction.component';
import RightClick from './../../Components/Right-Click/rightClick.component';

import { RemoveStarterFromThePath } from './../../Utils/generic.utils';
import { GetMenuDetail, ConvertMenuDetailForGenericPage, CreateFinalColumns } from './../../Utils/generic.utils';
import { GetDetailRecord } from './../../Utils/genericDetail.utils';

import './genericDetail.css';

export default class GenericDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            menuDetail: {},
            portlet: {},
            tabs: {},
            tabsPreference: {},
            parentData: {},
            loading: true
        };

        this.currentUrl = this.getHref();
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
    }

    componentWillUnmount() {
        UnsubscribeEvent({ eventName: 'loggedUser', callback: this.userDataArrived });
        StoreEvent({ eventName: 'rightClickData', data: {} });
    }

    componentDidMount() {
        this.getMenuData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const newProps = GetUrlParams(nextProps);
        this.state.params = newProps.params;
        this.state.queryString = newProps.queryString;

        // if menuDetail object has fetched url and current url is different than previous one, fetch data
        // As of now we dont need to watch url for portlet
        // if (this.state.menuDetail.url && this.currentUrl != this.getHref()) {
        //     this.currentUrl = this.getHref();
        //     this.getDetailRecord();
        // }
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

    getDetailRecord = ({ withoutIdentifier = false } = {}) => {
        const { menuDetail, portlet, urlParameter, params } = this.state;
        // const {menuId} = this.props
        GetDetailRecord({ configuration: menuDetail, callback: this.dataFetched, data: portlet, urlParameter: params, withoutIdentifier });
    }

    dataFetched = ({ tabDetail, portlet }) => {
        const { menuDetail } = this.state;
        tabDetail.refreshContent = this.getDetailRecord;
        const parentData = RemoveStarterFromThePath({ data: portlet.data, starter: portlet.starter });
        this.setState({ portlet, tabDetail, parentData, loading: false });
        const rightClickOptions = {
            modelId: portlet.model.id,
            menuId: menuDetail.menuId
        }
        StoreEvent({ eventName: 'rightClickData', data: { menuData: rightClickOptions } });
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
            // this.setState({ portlet, menuDetail });
            this.state.portlet = portlet;
            this.state.menuDetail = menuDetail;
            this.getDetailRecord({ withoutIdentifier: true });
        }
    }

    render() {
        const { history, location, match } = this.props;
        const { menuDetail = {}, portlet = {}, tabDetail = {}, currentUser = {}, parentData, loading } = this.state;
        const { finalColumns = [], data = {}, formPreference = {}, starter, formPreferences = [] } = portlet;

        const genericDataForCustomColumn = {
            formPreference,
            formPreferences,
            starter,
            columns: portlet.portletColumns,
            // modelName: menuDetail.formPreferenceName + '.form',
            // module: menuDetail.url ? menuDetail.url.split("/:")[0] : '',
            url: menuDetail.url ? menuDetail.url.split("/:")[0] : '',
            model: portlet.model,
            modelId: portlet.model && portlet.model.id,
            methods: portlet.methods,
            preDefinedmethods: portlet.preDefinedmethods,
            modelHash: portlet.modelHash
        };

        const html =
            <div className="header">
                <div className="left" />

                <div className="right"> 
                    <div className="btn-group header-actions" id="generic-detail-header-dynamic-icon-group">
                        <CustomAction menuDetail={menuDetail} history={history} genericData={genericDataForCustomColumn} actions={portlet.nextActions} listingRow={data} placement={'as_record'} callback={this.getDetailRecord} />
                        &nbsp;
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
                                showSplitFlag={true}
                            // finalColumns={finalColumns}
                            />
                            : null
                        }
                        &nbsp;
                        <CustomAction menuDetail={menuDetail} history={history} genericData={genericDataForCustomColumn} actions={portlet.nextActions} listingRow={data} placement={'as_dropdown'} callback={this.getDetailRecord} />
                    </div>

                    
                </div>
            </div>;

        return (
            <div className="generic-detail-container">
                <RightClick renderTag="div" html={html} rowOptions={this.rowOptions} ></RightClick>

                <div className="detail-content">
                    {
                        loading ?
                            <div className="loading-text">
                                <h6>
                                    Loading content
                                </h6>
                            </div> :
                            <div>
                    
                                {
                                    finalColumns.length ?
                                        <DetailPortlet listingRow={data} finalColumns={finalColumns} starter={starter} />
                                        : <div className="noListMessage">Looks like no columns are selected , Configure it by pressing the settings icon.</div>
                                }

                                {
                                    tabDetail && tabDetail.tabs ?
                                        <DetailIncludes tabs={tabDetail.tabs} parentData={parentData} callback={this.getDetailRecord} currentUser={currentUser} location={location} match={match} />
                                        : null
                                }
                            </div>
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
                const { menuDetail } = this.state;

                let pageUrl = "/menu/" + menuDetail.menuId
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
                const { portlet } = this.state;

                let url = "/model/" + portlet.model.id
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
import React, { Component } from 'react';
import './header.css';
import { SubscribeToEvent, UnsubscribeEvent } from 'state-manager-utility';

import ActiveModule from './../../Components/Active-Module/ActiveModule.component';
import PageNav from './../../Components/Page-Nav/PageNav';

import { Location } from 'drivezy-web-utils/build/Utils/location.utils';
import { IsObjectHaveKeys } from 'common-js-util';

import RightClick from './../../Components/Right-Click/rightClick.component';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false,
            menuDetail: {},
            history: props.history,
            enabled: false
        }
    }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'rightClickData', callback: this.getMenuData });
    }

    componentWillUnmount() {
        UnsubscribeEvent({ eventName: 'rightClickData', callback: this.getMenuData });
    }

    getMenuData = (data) => {
        this.setState({
            menuDetail: data,
            enabled: (IsObjectHaveKeys(data) ? true : false)
        })
    }

    render() {
        const { enabled } = this.state;
        return (

            <div className="landing-header">

                <div className="header-content">

                    <ActiveModule />
                    {enabled ? <RightClick rowOptions={this.rowOptions} renderTag="div" className='generic-table-td' /> : null}
                    <PageNav />

                </div>
            </div>
        )
    }

    rowOptions = [
        {
            id: 4,
            name: "Redirect Menu Detail",
            icon: 'fa-deaf',
            subMenu: false,
            onClick: (data, e) => {
                const { menuDetail } = this.state;
                let pageUrl = "/menu/" + menuDetail.menuData.menuId;
                // history.push(`${pageUrl}`);
                Location.navigate({ url: pageUrl }, e);
            },
            disabled: false,
            enabled: false
        }, {
            id: 4,
            name: "Redirect Model Detail",
            icon: 'fa-info-circle',
            subMenu: false,
            onClick: (data, e) => {
                const { menuDetail } = this.state;
                let pageUrl = "/model/" + (menuDetail.menuData.model ? menuDetail.menuData.model.id : menuDetail.menuData.modelId)
                Location.navigate({ url: pageUrl }, e);
            },
            disabled: false,
            enabled: false
        }
    ];
}
import React, { Component } from 'react';
import './header.css';
import { SubscribeToEvent, UnsubscribeEvent } from 'state-manager-utility';

import ActiveModule from './../../Components/Active-Module/ActiveModule.component';
import PageNav from './../../Components/Page-Nav/PageNav';

import RightClick from './../../Components/Right-Click/rightClick.component';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false,
            menuDetail: {},
            history: props.history,
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
            menuDetail: data
        })
    }

    render() {
        return (

            <div className="landing-header">

                <div className="header-content">

                    <ActiveModule />
                    <RightClick rowOptions={this.rowOptions} renderTag="div" className='generic-table-td' />
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
            onClick: (data) => {
                const { menuDetail, history } = this.state;

                let pageUrl = "/menu/" + menuDetail.menuData.menuId

                history.push(`${pageUrl}`);
            },
            disabled: false
        }, {
            id: 4,
            name: "Redirect Model Detail",
            icon: 'fa-info-circle',
            subMenu: false,
            onClick: (data) => {
                const { menuDetail, history } = this.state;

                let pageUrl = "/model/" + menuDetail.menuData.model.id

                history.push(`${pageUrl}`);
            },
            disabled: false
        }
    ];
}
import React, { Component } from 'react';
import './header.css';

import ActiveModule from './../../Components/Active-Module/ActiveModule.component';
import PageNav from './../../Components/Page-Nav/PageNav';

import RightClick from './../../Components/Right-Click/rightClick.component';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false
        }
    }

    render() {

        return (

            <div className="landing-header">
                <RightClick rowOptions={this.rowOptions} renderTag="span" className='generic-table-td'/>
                <div className="header-content">

                    <ActiveModule />
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
                const { history, match } = this.props;

                let pageUrl = "/menuDef/" + data.menuDetail.menuId

                history.push(`${pageUrl}`);
            },
            disabled: false
        }, {
            id: 4,
            name: "Redirect Model Detail",
            icon: 'fa-info-circle',
            subMenu: false,
            onClick: (data) => {
                const { history, match } = this.props;

                let pageUrl = "/modelDetails/" + data.menuDetail.model.id

                history.push(`${pageUrl}`);
            },
            disabled: false
        }
    ];
}
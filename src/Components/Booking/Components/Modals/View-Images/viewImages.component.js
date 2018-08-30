import React, { Component } from 'react';
import {
    Card, CardBody,
    TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap';

import classNames from 'classnames';

import ImageViewer from './../../../../../Components/Image-Viewer/imageViewer.component.js';

import { GroupBy } from 'common-js-util/build/common.utils'

export default class ViewImages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            tabsObj: {},
            tabsArr: [],
            activeTab: 0
        }
    }

    componentWillReceiveProps(props) {
        this.setData(props);
    }

    componentDidMount() {
        this.setData(this.props);
    }

    setData = (props) => {
        const { data } = props;
        const images = data.images
        let tabsObj = {};
        let tabsArr = [];
        

        if (Array.isArray(images)) {
            images.map((image, key) => {
                image.docType = image.type.value;
                image.image = image.document_link;
            })
            
            tabsObj = GroupBy(images, 'docType');
            tabsObj["All Images"] = images
        }

        tabsArr = Object.values(tabsObj);
        this.setState({ tabsObj, tabsArr });
    }

    toggle = (key, tab) => {
        if (this.state.activeTab !== key) {
            this.setState({
                activeTab: key
            });
        }

        if (tab && tab.index) {
            // shouldComponentWillReceivePropsRun = false;
            window.location.hash = tab.index;
        }
    }

    render() {
        const { data, tabsObj, activeTab, tabsArr } = this.state;
        let inlineContainerClass = classNames('inline-container', {
            show: this.state.visible,
        });
        return (
            <Card className="booking-images">
                <CardBody style={{ height: '500px' }}>
                    <div className='generic-tabs-container'>
                        <Nav tabs >
                            {
                                Object.keys(tabsObj).length ?
                                    Object.keys(tabsObj).map((tab, key) => (
                                        <NavItem key={key} >
                                            <NavLink
                                                className={`${activeTab === key ? 'active' : ''}`}
                                                onClick={() => { this.toggle(key, tab); }}>
                                                <i className="fa fa-image"></i> {tab}
                                            </NavLink>
                                        </NavItem>
                                    ))
                                    : null
                            }
                        </Nav>

                        <TabContent activeTab={activeTab}>
                            {
                                Object.keys(tabsObj).length ?
                                    Object.keys(tabsObj).map((tab, key) => {
                                        if (activeTab == key) {
                                            return (
                                                <TabPane className='relative' key={key} tabId={key}>
                                                    {/* Building the table iterating through the row to display tab content */
                                                    }

                                                    <div className={inlineContainerClass} ref={ref => { this.state.container = ref; }}>
                                                        {
                                                            tabsArr.length ?
                                                                <ImageViewer idVal='booking' images={tabsArr[activeTab]} />
                                                                :
                                                                null
                                                        }
                                                    </div>
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
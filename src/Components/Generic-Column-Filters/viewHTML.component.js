import React, { Component } from 'react';

import ReactHtmlParser from 'react-html-parser';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';

import './moreLess.component.css';

export default class MoreLess extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: true
        }
    }

    expand = () => {
        const { expanded } = this.state;
        this.setState({ expanded: !expanded })
    }

    render() {
        const { expanded } = this.state;
        const { data } = this.props;

        return (
            data.length > 50 ?
                <div className="data">
                    <div className={`${expanded ? `less` : `more`}`}>
                        <a onClick={() =>
                            ModalManager.openModal({
                                headerText: "Content",
                                modalBody: () => (
                                    <div className="parsedHTML">
                                        <div className="html">
                                            {ReactHtmlParser(data)}
                                        </div>
                                    </div>
                                )
                            })}>{data}</a>
                    </div>
                </div>
                :
                <div className="data">
                    <a onClick={() =>
                        ModalManager.openModal({
                            headerText: "Content",
                            modalBody: () => (
                                <div className="parsedHTML">
                                    <div className="html">
                                        {ReactHtmlParser(data)}
                                    </div>
                                </div>
                            )
                        })}>{data}</a>
                </div>
        )
    }
}
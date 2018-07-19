import React, { Component } from 'react';
import './DetailPortlet.css';

import {
    Card, CardBody, Row, Col
} from 'reactstrap';

import RightClick from './../../Components/Right-Click/rightClick.component';

import { CopyToClipBoard } from './../../Utils/common.utils';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { RowTemplate } from './../../Utils/generic.utils';

export default class DetailPortlet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listingRow: this.props.listingRow,
            finalColumns: this.props.finalColumns,
            starter: this.props.starter
        }
    }

    rowOptions = [{
        id: 0,
        name: "Copy Column Name",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let prop = data.selectedColumn.name;
            CopyToClipBoard(prop);
            ToastNotifications.success({ description: "Column name " + data.selectedColumn.name + " has been copied", title: 'Column Name' });
        }
    }, {
        id: 0,
        name: "Copy Property",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let prop = data.listingRow[data.selectedColumn.path];
            CopyToClipBoard(prop);
            ToastNotifications.success({ description: "Property of " + data.selectedColumn.path + " has been copied", title: "Copy " + data.selectedColumn.path });
        }
    }, {
        id: 1,
        name: "Copy Row Id",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let id = data.listingRow[data.starter + '.id'];
            CopyToClipBoard(id);
            ToastNotifications.success({ description: "Id - " + id + " has been copied", title: 'Copy Id' });
        }
    }];

    UNSAFE_componentWillReceiveProps(nextProps) {
    }

    render() {
        const { finalColumns, listingRow, starter } = this.props;
        return (
            <div className="detail-portlet">
                <Card>
                    <CardBody>
                        <Row>
                            {
                                finalColumns.filter((entry) => (!entry.isSplit) || (entry.separator)).map((selectedColumn, key) => {
                                    const html =
                                        <div className="detail-entry" >
                                            <Col>
                                                <strong>
                                                    {selectedColumn.display_name}
                                                </strong>

                                            </Col>
                                            <Col>
                                                <span className="pull-right"> {RowTemplate({ selectedColumn, listingRow })}</span>
                                            </Col>
                                        </div>

                                    const seperatorHtml =
                                        <div className="seperator">
                                            <strong> {selectedColumn.label} </strong>
                                        </div>

                                    return (
                                        selectedColumn &&
                                        <Col className="gray-border-bottom padding-bottom-4 padding-top-4" key={key} xs={((selectedColumn.split) && (!selectedColumn.separator)) ? '6' : '12'}>
                                            <RightClick key={key} renderTag="div" rowOptions={this.rowOptions} html={
                                                (!selectedColumn.separator) ? html : seperatorHtml
                                            } listingRow={listingRow} selectedColumn={selectedColumn} starter={starter}></RightClick>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
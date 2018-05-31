import React, { Component } from 'react';
import './DetailPortlet.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';

import RightClick from './../../Components/Right-Click/rightClick.component';

import { CopyToClipBoard } from './../../Utils/common.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { RowTemplate } from './../../Utils/generic.utils';

export default class DetailPortlet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listingRow: this.props.listingRow,
            finalColumns: this.props.finalColumns
        }
    }

    rowOptions = [{
        id: 0,
        name: "Copy Property",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let prop = eval("data.listingRow." + data.selectedColumn.absPath);
            CopyToClipBoard(prop);
            ToastNotifications.success("Property of " + data.selectedColumn.absPath + " has been copied");
        }
    }, {
        id: 1,
        name: "Copy Row Id",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let id = data.listingRow.id;
            CopyToClipBoard(id);
            ToastNotifications.success("Id - " + id + " has been copied");
        }
    }];

    UNSAFE_componentWillReceiveProps(nextProps) {
    }

    render() {
        const { finalColumns, listingRow } = this.props;
        return (
            <div className="detail-portlet">
                <Card>
                    <CardBody>

                        <Row>
                            {
                                finalColumns.map((selectedColumn, key) => {
                                    const html =
                                        selectedColumn.absPath ?
                                            <Row className="detail-entry" >
                                                <Col>
                                                    <strong>
                                                        {selectedColumn.display_name}
                                                    </strong>

                                                </Col>
                                                <Col>
                                                    <span className="pull-right"> {RowTemplate({ selectedColumn, listingRow, path: 'absPath' })}</span>
                                                    {/* <span className="pull-right">{listingRow[selectedColumn.name]}</span> */}
                                                </Col>
                                            </Row>
                                            : null

                                    return (
                                        selectedColumn && selectedColumn.column_type &&
                                        <Col className="gray-border-bottom padding-bottom-4 padding-top-4" key={key} xs={selectedColumn.split ? '6' : '12'}>
                                            <RightClick key={key} renderTag="div" rowOptions={this.rowOptions} html={html} listingRow={listingRow} selectedColumn={selectedColumn}></RightClick>
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
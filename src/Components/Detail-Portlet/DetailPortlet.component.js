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


export default class DetailPortlet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            finalColumns: this.props.finalColumns
        }
    }

    rowOptions = [{
        id: 0,
        name: "Copy Row Id",
        icon: 'fa-copy',
        subMenu: false,
        onClick: (data) => {
            let id = data.listingRow.id;
            CopyToClipBoard(id);
            ToastNotifications.success("Id - " + id + " has been copied");
        }
    }];

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {

        const { finalColumns, data } = this.props;

        

        return (
            <div className="detail-portlet">
                <Card>
                    <CardBody>
                    
                        <Row>
                            {finalColumns.map((selectedColumn, key) => (
                                
                                <Col key={key} xs={selectedColumn.split ? '6' : '12'}>
                                <RightClick key={key} renderTag="div" rowOptions={this.rowOptions} listingRow={data} selectedColumn={selectedColumn}></RightClick>
                                    {selectedColumn.absPath ?

                                        <Row className="detail-entry" >
                                            <Col>
                                                <strong>
                                                    {selectedColumn.display_name}
                                                </strong>

                                            </Col>
                                            <Col>
                                                {data[selectedColumn.column_name]}
                                            </Col>
                                        </Row>
                                        : null}
                                </Col>
                            ))}
                        </Row>


                    </CardBody>
                </Card>
            </div>
        )
    }
}
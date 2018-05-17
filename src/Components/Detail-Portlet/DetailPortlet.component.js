import React, { Component } from 'react';
import './DetailPortlet.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';


export default class DetailPortlet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            finalColumns: this.props.finalColumns
        }
    }

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
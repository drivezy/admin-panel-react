import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col
} from 'reactstrap';

import './userCard.component.css';

export default class UserCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: props.userData
        };
    }

    render() {
        const { userData = {} } = this.props;
        return (
            <div className="user-card">
                {/* <Row>
                    <Col sm="6" className="no-padding"> */}
                <Card>
                    <Row>
                        <Col sm="3">
                            <div className="user-info">
                                <div className="user-image">
                                    <CardImg className="user-object" src="{userData.photograph}" src={`${userData.photograph}`} alt="User image" />
                                </div>
                                <div className="user-body">
                                    <div className="user-list">
                                        <p><i className="fas fa-user" aria-hidden="true"></i> {userData.display_name}</p>
                                        <p>
                                            <i className="fas fa-phone" aria-hidden="true"></i> {userData.mobile} <i className="fas fa-check-circle text-green" aria-hidden="true"></i>
                                        </p>
                                        <p>
                                            <i className="fa fa-user" aria-hidden="true"></i> <span className="capitalize-text">{userData.gender}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col sm="3">
                            <div className="user-info">
                                <div className="user-body">
                                    <div className="user-list">
                                        <p><i className="fas fa-birthday-cake" aria-hidden="true"></i> {userData.dob}</p>
                                        <p><i className="fas fa-envelope" aria-hidden="true"></i> {userData.email}</p>
                                        <p><i className="fas fa-check-circle text-green" aria-hidden="true"></i> {userData.license_number}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

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
            userData: props.userData,
            getBooking: props.getBooking
        };
    }

    render() {
        const { userData = {}, getBooking = {} } = this.props;
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
                                        <p><h4 className="name-colour">{userData.display_name}</h4></p>
                                        <p>
                                            <small><i className="fa fa-phone" aria-hidden="true"></i> {userData.mobile} <i className="fa fa-check-circle text-green" aria-hidden="true"></i></small>
                                        </p>
                                        <p>
                                            <small><i className="fa fa-birthday-cake" aria-hidden="true"></i> {userData.dob}</small>
                                        </p>
                                        <p>
                                            <small><i className="fa fa-user" aria-hidden="true"></i> <span className="capitalize-text">{userData.gender}</span></small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col sm="3">
                            <div className="user-info">
                                <div className="user-body">
                                    <div className="user-list">
                                        <p><small><i className="fa fa-envelope" aria-hidden="true"></i> {userData.email}</small></p>
                                        <p><small><i className="fa fa-id-card text-green" aria-hidden="true"></i> {userData.license_number}</small></p>
                                        <p><small><i className="fa fa-money" aria-hidden="true"></i> {userData.license_number}</small></p>
                                        <p><small><i className="fa fa-money" aria-hidden="true"></i> {userData.license_number}</small></p>

                                    </div>
                                </div>
                            </div>
                        </Col>
                        {/* <Col sm="3">
                            {
                                getBooking && getBooking.feedback ?
                                    <div className="user-info">
                                        <div className="user-body">
                                            <div className="user-feedback">
                                                <p> User Feedback </p>
                                                <p><span className="ratings-colour"><i class="fa fa-star" aria-hidden="true"></i></span></p>
                                                <p>{getBooking.feedback[0].created_at}</p>
                                                <p>{getBooking.feedback[0].comments}</p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </Col>
                        <Col sm="3">
                            {
                                getBooking && getBooking.feedback ?
                                    <div className="user-info">
                                        <div className="user-body">
                                            <div className="user-feedback">
                                                <p> Fleet Feedback </p>
                                                <p><span className="ratings-colour"><i class="fa fa-star" aria-hidden="true"></i></span></p>
                                                <p>{getBooking.feedback[0].created_at}</p>
                                                <p>{getBooking.feedback[0].comments}</p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </Col> */}
                    </Row>
                </Card>
            </div>
        )
    }
}

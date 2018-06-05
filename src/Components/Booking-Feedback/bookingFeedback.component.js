import React, { Component } from 'react';
import {
    Card, CardImg, Row, Col
} from 'reactstrap';

import './bookingFeedback.component.css';

export default class BookingFeedbackCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingFeedback: props.bookingFeedback
        };
    }

    render() {
        const { bookingFeedback = {} } = this.state;
        console.log(bookingFeedback);


        let userFeedback = [];
        let fleetFeedback = [];

        bookingFeedback.feedback.forEach(function (getUserFeedback, index) {
            if ((getUserFeedback.user_id == getUserFeedback.updated_by) && (getUserFeedback.customer_happy == null)) {
                userFeedback.push(Object.assign(getUserFeedback, { userRatingStars: [] }));
                for (var i = 0; i < parseInt(getUserFeedback.rating); i++) {
                    userFeedback[userFeedback.length - 1].userRatingStars.push(<i class="fa fa-star" aria-hidden="true"></i>)
                }
            } else {
                fleetFeedback.push(Object.assign(getUserFeedback, { fleetRatingStars: [] }));
                for (var i = 0; i < parseInt(getUserFeedback.rating); i++) {
                    fleetFeedback[fleetFeedback.length - 1].fleetRatingStars.push(<i class="fa fa-star" aria-hidden="true"></i>)
                }
            }
        });

        return (

            <div className="booking-feedback-card">
                <Card>
                    <Row>
                        <Col sm="6">
                            <div className="user-feedback-info">
                                <p> User Feedback </p>
                                {
                                    userFeedback.length > 0 ?
                                        userFeedback.map((feedback) =>
                                            <div className="user-feedback">
                                                <div className="user-stars">
                                                    <h6>{feedback.userRatingStars}</h6>
                                                </div>
                                                <div>
                                                    <p>{feedback.created_at}</p>
                                                </div>
                                                <div>
                                                    <p>{feedback.comments}</p>
                                                </div>
                                            </div>
                                        ) : <img className="feedback-stars" src={require("./../../Assets/images/stars.png")} alt="" />
                                }
                            </div>
                        </Col>
                        <Col sm="6">
                            <div className="fleet-feedback-info">
                                <p> Fleet Feedback </p>

                                {
                                    fleetFeedback.length > 0 ?
                                        fleetFeedback.map((feedback) =>
                                            <div className="fleet-feedback">
                                                <div className="fleet-stars">
                                                    <h6>{feedback.fleetRatingStars}</h6>
                                                </div>
                                                <div>
                                                    <p>{feedback.created_at}</p>
                                                </div>
                                                <div>
                                                    <p>{feedback.comments}</p>
                                                </div>
                                            </div>
                                        ) : <img className="feedback-stars" src={require("./../../Assets/images/stars.png")} alt="" />
                                }
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>

        )
    }
}

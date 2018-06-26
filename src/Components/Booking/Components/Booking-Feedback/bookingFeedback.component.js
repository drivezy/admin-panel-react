import React, { Component } from 'react';
import {
    Card, Row, Col, Progress
} from 'reactstrap';

import './bookingFeedback.component.css';
// import ReadMore from './../../../Truncate/readMore.component';

export default class BookingFeedback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingFeedback: props.bookingFeedback
        };
    }

    render() {
        const { bookingFeedback = {} } = this.state;


        let userFeedback = [];
        let fleetFeedback = [];
        let feedbackGenerator = [];
        let userComment = [];
        let fleetComment = [];

        bookingFeedback.forEach((feedback, index) => {
            if ((feedback.user_id == feedback.updated_by)) {
                userFeedback.push(Object.assign(feedback, { userRatingStars: [] }));

                console.log(userFeedback);

                let i = 0;
                for (i = 0; i < feedback.rating; i++) {
                    userFeedback[userFeedback.length - 1].userRatingStars.push(<i key={i} className="fa fa-star" aria-hidden="true"></i>)
                }
                for (; i < 5; i++) {
                    userFeedback[userFeedback.length - 1].userRatingStars.push(<i key={i} className="fa fa-star-o" aria-hidden="true"></i>)
                }
            } else if ((feedback.user_id != feedback.updated_by)) {
                fleetFeedback.push(Object.assign(feedback, { fleetRatingStars: [] }));

                console.log(fleetFeedback);

                let i = 0;
                for (i = 0; i < feedback.rating; i++) {
                    fleetFeedback[fleetFeedback.length - 1].fleetRatingStars.push(<i key={i} className="fa fa-star" aria-hidden="true"></i>)
                }
                for (; i < 5; i++) {
                    fleetFeedback[fleetFeedback.length - 1].fleetRatingStars.push(<i key={i} className="fa fa-star-o" aria-hidden="true"></i>)
                }

            }

            feedbackGenerator.push(feedback);
        });


        return (

            <div className="booking-feedback-card">
                <Card>
                    <div
                        className="feedback-heading">Feedback
                    </div>

                    <div className="feedback-data">
                        <Row key={1}>
                            <Col className="user">
                                <div className="user-feedback-info">
                                    <span> User Feedback </span>
                                    {
                                        userFeedback.length > 0 ?
                                            userFeedback.map((feedback, key) =>
                                                <div key={key} className="user-feedback">
                                                    <div className="user-stars">
                                                        <h6>{feedback.userRatingStars}</h6>
                                                    </div>
                                                    <div className="user-feedback-time">
                                                        <span>{feedback.created_at}</span>
                                                    </div>
                                                    <div className="user-feedback-comment">
                                                        <span>{feedback.comments}</span>
                                                    </div>
                                                </div>
                                            ) : <p>Not Available</p>


                                    }
                                </div>
                            </Col>
                            <Col className="feedback">
                                {
                                    feedbackGenerator.map((feedback, key) => {
                                        return feedback.feedback_categories.map((category, categoryKey) => {

                                            return (
                                                <div className="feedback-rating">
                                                    <span className="feedback-rate-name">{category.category.name} </span>
                                                    <span className="feedback-rate-value">{Math.floor(category.rating)} / 5 </span>
                                                    <Progress className="feedback-rate-bar" itemRef={(Math.floor(category.rating)) * 20} barClassName="file-field-list-item__progress-bar" value={(Math.floor(category.rating)) * 20}></Progress>

                                                    <span className="feedback-rate-name">{category.category.name} </span>
                                                    <span className="feedback-rate-value">{Math.floor(category.rating)} / 5 </span>
                                                    <Progress className="feedback-rate-bar" itemRef={(Math.floor(category.rating)) * 20} barClassName="file-field-list-item__progress-bar" value={(Math.floor(category.rating)) * 20}></Progress>
                                                    <span className="feedback-rate-name">{category.category.name} </span>
                                                    <span className="feedback-rate-value">{Math.floor(category.rating)} / 5 </span>
                                                    <Progress className="feedback-rate-bar" itemRef={(Math.floor(category.rating)) * 20} barClassName="file-field-list-item__progress-bar" value={(Math.floor(category.rating)) * 20}></Progress>

                                                </div>
                                            )
                                        })

                                    })
                                }
                            </Col>

                        </Row>
                    </div>
                    <div className="feedback-data">
                        <Row>
                            <Col className="fleet" >
                                <div className="fleet-feedback-info">
                                    <span> Fleet Feedback </span>

                                    {
                                        fleetFeedback.length > 0 ?
                                            fleetFeedback.map((feedback, key) =>
                                                <div className="fleet-feedback" key={key}>
                                                    <div className="fleet-stars">
                                                        <h6>{feedback.fleetRatingStars}</h6>
                                                    </div>
                                                    <div className="fleet-feedback-time">
                                                        <span>{feedback.created_at}</span>
                                                    </div>
                                                    <div className="fleet-feedback-comment">
                                                        <span>{feedback.comments}</span>
                                                    </div>

                                                    {/* <div>{feedback.feedback_categories[0].category.name}</div>
                                                    <div>{feedback.feedback_categories[0].rating}</div> */}

                                                </div>

                                            )
                                            : <p>Not Available</p>

                                    }
                                </div>

                            </Col>
                        </Row>

                    </div>
                </Card>
            </div>

        )
    }
}

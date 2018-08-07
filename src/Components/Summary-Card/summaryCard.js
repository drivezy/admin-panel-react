import React, { Component } from 'react';
import { Card, Row, Col, Collapse, Button, CardBody } from 'reactstrap';
import './../../Components/Booking/Components/Booking-Ride-Return/bookingRideReturn.component';
import { TruncateDecimal } from './../../Utils/js.utils';
import './summaryCard.css';

let paidAmount = 0;
let fairAmount = 0;
let amountDue = 0;
let tentative_amount = 0;

export default class SummaryCard extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            bookingData: props.bookingData,
            collapse: false

        };
    }

    componentDidMount() {
        const { bookingData } = this.state;
        this.getBookingData(bookingData);
    }

    getBookingData = (bookingData) => {
        if (bookingData.payment && bookingData.payment.length) {
            bookingData.payment.forEach(function (data) {
                paidAmount += parseFloat(data.amount);
            });
        }
        if (bookingData.collection && bookingData.collection.length) {
            bookingData.collection.forEach(function (data) {
                fairAmount += parseFloat(data.amount);
            });
        }
        if (bookingData.extension && bookingData.extension.length) {
            let approvedExtensionCost = 0;
            bookingData.extension.forEach(function (data) {
                if (data.approved == 1 && !data.deleted_at) {
                    approvedExtensionCost += parseFloat(data.cost);
                }
            });
            if (approvedExtensionCost > 0) {
                tentative_amount += approvedExtensionCost;
            }
        }
        bookingData.refund.forEach(function (remaining_amount) {
            if (remaining_amount.processed == 0) {
                amountDue += parseFloat(remaining_amount.amount);
            }
        });
    }

    toggle = (e) => {
        e.preventDefault();
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        const { bookingData = {} } = this.state;
        const status = bookingData.status || {};

        return (
            <Card className="summary-card">
                <div className="summary-card-heading">
                    Summary
                </div>

                <div className="summary-card-body">
                    <div className="row-1">

                        <div className="class">

                            <div className="title">
                                Amount Paid
                            </div>

                            <div className="data">
                                ₹{paidAmount.toFixed(2)}
                            </div>
                        </div>

                        {
                            (status.id == 5 || status.id == 6) ?

                                <div className="class">

                                    <div className="title">
                                        Tentative Amount
                                    </div>

                                    <div className="data">
                                        ₹{tentative_amount.toFixed(2)}
                                    </div>
                                </div>

                                : null
                        }

                        {
                            (status.id == 7 || status.id == 8) ?

                                <div className="class">

                                    <div className="title">
                                        Total Fair
                                    </div>

                                    <div className="data">
                                        ₹{fairAmount.toFixed(2)}
                                    </div>
                                </div>

                                : null
                        }

                        {
                            (bookingData && bookingData.type.id != 580 && amountDue < 0 && status.id != 5 && status.id != 6) &&

                            <div className="class">

                                {
                                    amountDue < 0 && <div className="title">
                                        Amount Due
                                    </div>
                                }

                                {
                                    amountDue < 0 ? <div className="data">
                                        ₹{(0 - amountDue).toFixed(2)}
                                    </div>
                                        : null
                                }
                            </div>


                        }


                        {
                            (bookingData && amountDue > 0 && status.id != 5 && status.id != 6) &&

                            <div className="class">

                                <div className="title">
                                    Refund
                                    </div>

                                <div className="data">
                                    ₹{amountDue.toFixed(2)}
                                </div>
                            </div>


                        }

                    </div>
                </div>


                <div className="pricing-object">
                    <div>
                        <div className="pricing" onClick={(e) => this.toggle(e)}  >
                            Pricing Object<i className={"fa " + (this.state.collapse ? 'fa-caret-up' : 'fa-caret-down')}></i>
                        </div>
                        <Collapse isOpen={this.state.collapse}>
                            <Card className="card-body">
                                <CardBody>
                                    {
                                        Object.keys(bookingData.pricing_object).map(key => {
                                            const pricing = bookingData.pricing_object[key];
                                            key = key.replace(/_/g, " ");
                                            if (key == 'city') {
                                                return;
                                            }
                                            else if (key == 'peak') {
                                                return (
                                                    <Row className="card-object" key={key}>
                                                        <Col className="item">{key}</Col>
                                                        <Col className="value">{pricing ? 'True' : 'False'}</Col>
                                                    </Row>
                                                )
                                            }
                                            else {
                                                return (
                                                    <Row className="card-object" key={key}>
                                                        <Col className="item">{key}</Col>
                                                        <Col className="value">{pricing}</Col>
                                                    </Row>
                                                )
                                            }
                                        })
                                    }
                                </CardBody>
                            </Card>
                        </Collapse>
                    </div>
                </div>
            </Card>
        )
    }

}
import React, { Component } from 'react';
import {
    Card, CardImg, Row, Col
} from 'reactstrap';


import { Get } from './../../Utils/http.utils';
import './userCard.component.css';

export default class UserCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: props.userData,
            wallet: 0,
            promoWallet: 0,
            cashWallet: 0
        };
    }

    componentDidMount() {
        this.walletAmount();
    }

    walletAmount = async () => {
        const { userData } = this.state;
        const url = 'wallet?user=' + userData.id
        const result = await Get({ url });
        if (result.success) {
            const promoWallet = result.response.nonRewardAmount;
            const cashWallet = result.response.rewardAmount;
            this.setState({ promoWallet, cashWallet })
        }
    }




    render() {
        const { userData = {}, promoWallet, cashWallet } = this.state;
        return (
            <Row>
                <Col sm="6">
                    <div className="user-card">
                        <Card>
                            <Row>
                                <Col sm="6">
                                    <div className="user-info">
                                        <div className="user-image">
                                            <CardImg className="user-object" src="{userData.photograph}" src={`${userData.photograph}`} alt="User image" />
                                        </div>
                                        <div className="user-body">
                                            <div className="user-list">
                                                <p><h6 className="name-colour">{userData.display_name}</h6></p>
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
                                <Col sm="6">
                                    <div className="user-info">
                                        <div className="user-body">
                                            <div className="user-list">
                                                <p><small><i className="fa fa-envelope" aria-hidden="true"></i> {userData.email}</small></p>
                                                <p><small><i className="fa fa-id-card text-green" aria-hidden="true"></i> {userData.license_number}</small></p>
                                                <p><small><i className="fa fa-paypal" aria-hidden="true"></i>Rs {promoWallet} </small></p>
                                                <p><small><i className="fa fa-inr" aria-hidden="true"></i>Rs {cashWallet} </small></p>

                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>
        )
    }
}

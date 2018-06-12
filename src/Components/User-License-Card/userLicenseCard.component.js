import React, { Component } from 'react';
import {
    Card, CardImg, Row, Col
} from 'reactstrap';

import { Get } from './../../Utils/http.utils';

import './userLicenseCard.component.css';

export default class UserLicenseCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: props.userData,
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
            <div className="user-license-card">
                <Card>
                    <div className="user-license-info">
                        <div className="user-detail-info-card">
                            <div className="user-email">
                                <span className="detail-content">User Email</span>
                                <span className="detail-content">{userData.email}</span>
                            </div>
                            <div className="user-license-validate">
                                <span className="detail-content">License Validated</span>
                                {
                                    (userData.is_license_validated === 1) ?
                                        <span className="detail-content">Yes</span>
                                        :
                                        <span className="detail-content">No</span>
                                }
                            </div>
                            <div className="user-promo">
                                <span className="detail-content">Promo Wallet</span>
                                <span className="detail-content">{promoWallet} ₹</span>
                            </div>
                            <div className="user-cash">
                                <span className="detail-content">Cash Wallet</span>
                                <span className="detail-content">{cashWallet} ₹</span>
                            </div>
                        </div>
                        <div className="user-photograph">

                            {
                                userData.photograph ?
                                    <img src={`${userData.photograph}`} alt="" />
                                    : <img  className="dummy-image" src={require('./../../Assets/images/photograph.png')} alt="" />
                            }

                        </div>
                    </div>
                </Card>
            </div >
        )
    }
}

import React, { Component } from 'react';
import {
    Card, 
} from 'reactstrap';

import { Get } from 'common-js-util';

import UserLicenseCard from '../User-License-Card/userLicenseCard.component';
import './userCard.component.css';

export default class UserCard extends Component {

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
            <div className="user-card card">

                <UserLicenseCard userData={userData} flag={0}/>
                
                <div className="user-detail-card">
                    <Card>

                        <div className="user-photo-and-user-name">

                            <div className="user-name">
                                {userData.display_name}
                            </div>

                            <div className="user-photo">
                                {
                                    userData.photograph ?
                                        <img src={`${userData.photograph}`} alt="" />
                                        : <img className="dummy-image" src={require('./../../Assets/images/photograph.png')} alt="" />
                                }
                            </div>
                        </div>

                        <div className="details list-group-item">

                            <div className="text-field"><i className="fa fa-phone" aria-hidden="true"></i>
                                Contact
                            </div>

                            <div className="data-field">
                                {userData.mobile}
                            </div>

                        </div>


                        <div className="details list-group-item">

                            <div className="text-field"><i className="fa fa-envelope" aria-hidden="true"></i>
                                Email
                            </div>

                            <div className="data-field">
                                {userData.email}
                            </div>
                        </div>



                        {/* (userData.gender) ?
                            <div className="data-field"><i className="fa fa-hands-helping" aria-hidden="true"></i>
                            </div>
                            :
                            null
                    */}

                        <div className="details list-group-item" >
                            <div className="text-field"><i className="fa fa-birthday-cake" aria-hidden="true"></i>
                                DOB
                            </div>
                            <div className="data-field">
                                {userData.dob}
                            </div>
                        </div >


                        <div className="details list-group-item">
                            <div className="text-field"><i className="fa fa-certificate" aria-hidden="true"></i>
                                Promo
                            </div>
                            <div className="data-field">
                                ₹ {promoWallet}
                            </div>
                        </div>


                        <div className="details list-group-item">
                            <div className="text-field"><i className="fa fa-money" aria-hidden="true"></i>
                                Cash
                            </div>
                            <div className="data-field">
                                ₹ {cashWallet}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

        )
    }
}

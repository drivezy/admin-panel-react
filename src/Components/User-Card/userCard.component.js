import React, { Component } from 'react';
import {
    Card
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
        const { userData = {} } = this.state;
        const userLicenseImage = [];

        userData.licenses.forEach(function (checkApprovedLicense) {
            if (checkApprovedLicense.approved == 1) {
                return userLicenseImage.push(checkApprovedLicense.license);
            }
        });

        return (
            <div className="user-card">
                <Card>
                    <div className="user-info">
                        <div className="user-info-detail">
                            <p className="name-colour">{userData.display_name}</p>
                            <p><i className="fa fa-phone" aria-hidden="true"></i> {userData.mobile} <i className="fa fa-check-circle text-green" aria-hidden="true"></i></p>
                            <p><i className="fa fa-birthday-cake" aria-hidden="true"></i> {userData.dob}</p>
                            {
                                (userData.gender) ?
                                    <p><i className="fa fa-user" aria-hidden="true"></i> <span className="capitalize-text">{userData.gender}</span></p>
                                    :
                                    null
                            }
                        </div>
                        <div className="user-content">
                            <p className="user-info-dob"><i className="fa fa-birthday-cake" aria-hidden="true"></i> {userData.dob}</p>
                            <p className="user-info-license"><i className="fa fa-id-card text-green" aria-hidden="true"></i> {userData.license_number}</p>
                        </div>
                        <div className="user-license">
                            {
                                userLicenseImage.length > 0 ?
                                    <img src={userLicenseImage[0]} alt="" />
                                    : <img className='dummy-license' src={require('./../../Assets/images/Dummy-License.jpg')} alt="" />
                            }
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}

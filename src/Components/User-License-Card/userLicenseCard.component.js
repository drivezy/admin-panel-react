import React, { Component } from 'react';
import {
    Card, CardImg, Row, Col
} from 'reactstrap';

import { Get } from './../../Utils/http.utils';
import { Link } from 'react-router-dom';

import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';


import './userLicenseCard.component.css';
import classNames from 'classnames';

export default class UserLicenseCard extends Component {
    container: HTMLDivElement;
    constructor(props) {
        super(props);
        this.state = {
            userData: props.userData,
            promoWallet: 0,
            cashWallet: 0,
            visible: true,
            activeIndex: 0,
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

        let userLicenseImage = [];

        userLicenseImage = userData.licenses.map((image) => {
            if (image.approved == 1) {
                image.src = image.license;
                return image;
            }
        })

        // userData.licenses.forEach(function (checkApprovedLicense) {
        //     if (checkApprovedLicense.approved == 1) {
        //         return userLicenseImage.push(checkApprovedLicense);
        //     }
        // });

        let inline = this.state.mode === 'inline';

        let inlineContainerClass = classNames('inline-container', {
            show: this.state.visible && inline,
        });

        return (
            <Card className="user-license-card">
                <div className="user-license-photo">
                    {
                        userLicenseImage.length > 0 ?
                            <div>
                                <div className={inlineContainerClass} ref={ref => { this.state.container = ref; }}></div>
                                <Viewer
                                    container={this.state.container}
                                    visible={this.state.visible}
                                    images={userLicenseImage}
                                    activeIndex={this.state.activeIndex}
                                    noClose={true}
                                />
                            </div>
                            : <img className='dummy-license' src={require('./../../Assets/images/Dummy-License.jpg')} alt="" />
                    }
                </div>
                <div className="user-license-data">
                    <div className="text-field">
                        Licence No.
                    </div>

                    <div className="data-field">
                        {
                            (userData.license_number) ?
                                <div className="licence-number-verified"><i className="fa fa-check-circle"></i>{userData.license_number}</div>
                                : <div className="licence-number-not-verified"><i className="fa fa-times"></i>Not verified </div>
                        }

                    </div>
                </div>
            </Card >
        )
    }
}

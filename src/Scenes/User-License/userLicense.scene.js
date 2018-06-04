import React, { Component } from 'react';
import './userLicense.scene.css';

import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';

import {
    Row, Col, Card, CardHeader, CardBody
} from 'reactstrap';

import classNames from 'classnames';

import { Get, Put } from './../../Utils/http.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { ConfirmUtils } from './../../Utils/confirm-utils/confirm.utils';

import UserLicenseForm from './../../Components/User-License-Form/userLicenseForm.component';



export default class UserLicense extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userObj: {},
            images: [],
            visible: false,
            activeIndex: 0,
            currentIndex: 0
        };
    }

    componentDidMount() {
        this.getUserDetail();
        this.getLicense();
    }

    getUserDetail = async () => {
        const { userId } = this.props.match.params;
        const url = 'user/' + userId;
        const result = await Get({ url });

        if (result.success) {
            const userObj = result.response;
            this.setState({ userObj });
        }
    }

    getLicense = async () => {
        let options = GetDefaultOptions();
        const { userId } = this.props.match.params;
        options.query += " and user_id=" + userId;
        options.query += " and approved is null and rejection_reason is null";
        var url = "userLicense";
        const result = await Get({ url, options });
        if (result.success) {
            const images = result.response;
            this.setState({ images });
        }
    }

    acceptL = () => {
        const { images = [], currentIndex } = this.state;
        const method = async () => {
            const result = await Put({ url: "userLicense/" + images[currentIndex].id, body: { approved: 1 } });
            if (result.success) {
                ToastNotifications.success('License is Accepted');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to accept license?", callback: method });
    }

    render() {
        const { images = [], userObj = {}, currentIndex } = this.state;

        const licenses = images.map((image) => {
            image.src = image.license;
            return image;
        })

        let imgListClass = classNames('img-list', {
            hide: this.state.visible,
        });
        return (
            <div className="user-license">
                <div className="user-license-form">
                    <Card>
                        <CardHeader>User Details</CardHeader>
                        <CardBody>
                            {
                                userObj.id &&
                                <UserLicenseForm userObj={userObj} />
                            }
                        </CardBody>
                    </Card>
                </div>
                <div className="container">
                    <Card>
                        <CardHeader>
                            User Licenses <small>{currentIndex + 1} of {images.length}</small>
                        </CardHeader>
                        <CardBody>
                            <div className={imgListClass}>
                                {
                                    images.map((item, key) => {
                                        return (
                                            <div key={key} className="img-item">
                                                <img src={item.license} onClick={() => {
                                                    this.setState({
                                                        visible: true,
                                                        activeIndex: key,
                                                    });
                                                }} alt="" />
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </CardBody>
                        <Row>
                            <Col sm="6">
                                <button className="btn btn-primary pull-right width-100 button-red" onClick={() => { this.acceptL() }}>
                                    Accept License
                            </button>
                            </Col>
                            <Col sm="6">
                                <button className="btn btn-primary pull-right width-100 button-green" onClick={() => { this.rejectL() }}>
                                    Reject License
                            </button>
                            </Col>
                        </Row>
                    </Card>
                    <Viewer
                        visible={this.state.visible}
                        onClose={() => { this.setState({ visible: false }); }}
                        images={licenses}
                        activeIndex={this.state.activeIndex}
                    />
                </div>
            </div>
        )
    }
}
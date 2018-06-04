import React, { Component } from 'react';
import './userLicense.scene.css';

import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';

import {
    Row, Col, Card, CardHeader, CardBody, Button
} from 'reactstrap';

import classNames from 'classnames';

import { Get } from './../../Utils/http.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';

import UserLicenseForm from './../../Components/User-License-Form/userLicenseForm.component';


export default class UserLicense extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userObj: {},
            images: [],
            visible: false,
            activeIndex: 0,
            mode: 'modal',
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
            console.log(userObj);
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

    render() {
        const { images = [], userObj = {} } = this.state;

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
                            {/* <form name="userLicenceForm">
                                <div className="form-group">
                                    <label className="">First Name<span className="text-red">*</span></label>
                                    <input type="text" placeholder="First Name" className="form-control" value={userObj.first_name} />
                                </div>
                                <div className="form-group">
                                    <label className="">Last Name</label>
                                    <input type="text" placeholder="Last Name" className="form-control" value={userObj.last_name} />
                                </div>
                                <div className="form-group">
                                    <label className="control-label">Gender</label><span className="text-red">*</span>
                                    <select required ng-model="userLicense.formContent.gender" className="form-control form-box">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="">Email</label>
                                    <input type="text" placeholder="Email" className="form-control" value={userObj.email} />
                                </div>
                                <div className="form-group">
                                    <label className="">Mobile</label>
                                    <input type="text" placeholder="Mobile" name="Mobile" className="form-control" value={userObj.mobile} />
                                </div>
                                <div className="form-group">
                                    <div className="margin-top-5" id="buttonWidth">
                                        <button ng-click="userLicense.saveDetails()" className="btn btn-primary pull-right button-blue">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form> */}
                        </CardBody>
                    </Card>
                </div>
                <div className="container">
                    <Card>
                        <CardHeader>User Details</CardHeader>
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
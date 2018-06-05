import React, { Component } from 'react';
import './userLicense.scene.css';

import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';

import {
    Card, CardHeader, CardBody
} from 'reactstrap';

import classNames from 'classnames';

import { Get, Put, Delete } from './../../Utils/http.utils';
import { GetDefaultOptions } from './../../Utils/genericListing.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { ConfirmUtils } from './../../Utils/confirm-utils/confirm.utils';

import UserLicenseForm from './../../Components/User-License-Form/userLicenseForm.component';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import RejectLicenseForm from './../../Components/Reject-License-Form/rejectLiceneseForm.component';




export default class UserLicense extends Component {
    container: HTMLDivElement;
    constructor(props) {
        super(props);
        this.state = {
            userObj: {},
            images: [],
            visible: true,
            activeIndex: 0,
            currentIndex: 0,
            detectedDob: [],
            detectedLicense: [],
            detectedText: [],
            detectedExpiryDate: []
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

    updateCurrentIndex = () => {
        const { images = [], currentIndex } = this.state;
        var newIndex = currentIndex;
        for (var i in images) {
            images[i].visible = false;
        }
        if (newIndex < images.length) {
            images[newIndex].visible = true; // make the current image visible
        } else {
            // goToNextRecord();
        }
    }

    change() {
        const { images = [] } = this.state;
        if (images.length) {
            for (var i in images) {
                images[i].reviewed = false;
            }
        }
    }

    getLicense = async () => {
        let options = GetDefaultOptions();
        const { userId, detectedDob, detectedLicense, detectedText, detectedExpiryDate } = this.props.match.params;
        options.query += " and user_id=" + userId;
        options.query += " and approved is null and rejection_reason is null";
        var url = "userLicense";
        const result = await Get({ url, options });
        if (result.success) {
            const images = result.response;
            this.setState({ images });

            for (var i in images) {
                if (images[i].dob != null) {
                    detectedDob.push(images[i].dob);
                }
                if (images[i].license_number != null) {
                    detectedLicense.push(images[i].license_number);
                }

                if (images[i].text != null) {
                    detectedText.push(images[i].text);
                    if (images[i].text.search("validity") != -1) {
                        var regex = /v\w{7} \d{2,4}(\/|-)\d{2,4}(\/|-)\d{2,4}/i;
                        detectedExpiryDate.push(regex[0]);
                    }
                }
            }
            this.change();

            this.updateCurrentIndex();
        }
    }

    acceptL = () => {
        const { images = [], currentIndex } = this.state;
        const method = async () => {
            const result = await Put({ url: "userLicense/" + images[currentIndex].id, body: { approved: 1 } });
            if (result.success) {
                images[currentIndex].reviewed = true;

                ToastNotifications.success('License is Accepted');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to accept license?", callback: method });
    }

    rejectL = () => {
        const { images, currentIndex } = this.state;

        const rejectdData = {
            approved: 0,
            licenseIndex: images[currentIndex].id
        }

        ModalManager.openModal({
            headerText: "Reject License",
            modalBody: () => (<RejectLicenseForm rejectdData={rejectdData} ></RejectLicenseForm>),
            onClose: (...args) => console.log(args)
        })
        images[currentIndex].reviewed = true;
    };

    deleteL = () => {
        const { images = [], currentIndex } = this.state;
        const method = async () => {
            const result = await Delete({ url: "userLicense/" + images[currentIndex].id });
            if (result.success) {
                ToastNotifications.success('License is Deleted!');
                this.getLicense();
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to delete license?", callback: method });
    }

    render() {
        const { images = [], userObj = {}, currentIndex, detectedDob, detectedLicense, detectedText, detectedExpiryDate } = this.state;

        const licenses = images.map((image) => {
            image.src = image.license;
            return image;
        })

        let inline = this.state.mode === 'inline';

        let inlineContainerClass = classNames('inline-container', {
            show: this.state.visible && inline,
        });

        return (
            <div className="user-license">
                <div className="user-license-form">
                    <Card>
                        <CardHeader>User Details</CardHeader>
                        <CardBody>
                            {
                                userObj.id &&
                                <UserLicenseForm userObj={userObj} detectedDob={detectedDob} detectedLicense={detectedLicense} detectedText={detectedText} detectedExpiryDate={detectedExpiryDate} />
                            }
                        </CardBody>
                    </Card>
                </div>
                <div className="container licence-viewer">
                    <Card>
                        <CardHeader>
                            User Licenses {currentIndex + 1} of {images.length}
                        </CardHeader>
                        <CardBody>
                            <div className={inlineContainerClass} ref={ref => { this.container = ref; }}></div>
                            <Viewer
                                container={this.container}
                                visible={this.state.visible}
                                onClose={() => { this.setState({ visible: false }); }}
                                images={licenses}
                                activeIndex={this.state.activeIndex}
                                customToolbar={(toolbars) => {
                                    const customToolbar = [{
                                        key: 'test',
                                        render: <span className="custom-action" onClick={() => { this.acceptL() }}>Accept License</span>,
                                        onClick: (activeImage) => {
                                            console.log(activeImage);
                                        },
                                    }]

                                    const tools = customToolbar.concat(toolbars);
                                    return tools.concat([
                                        {
                                            key: 'test1',
                                            render: <span onClick={(e) => this.rejectL()} className="custom-action">Reject License</span>,

                                            onClick: (activeImage) => {
                                                console.log(activeImage);
                                            },
                                        },
                                        {
                                            key: 'test2',
                                            render: <span onClick={(e) => this.deleteL()} className="custom-action">Delete License</span>,

                                            onClick: (activeImage) => {
                                                console.log(activeImage);
                                            },
                                        }
                                    ]);
                                }}
                            />
                        </CardBody>
                    </Card>

                </div>
            </div>
        )
    }
}
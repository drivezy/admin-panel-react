import React, { Component } from 'react';
import './rtoTicket.component.css';

import { Get, Post } from 'common-js-util';
import { API_HOST } from './../../../../Constants/global.constants';
import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ImageUpload from './../../../Forms/Components/Image-Upload/imageUpload.component';

export default class RTOTicket extends Component {

    constructor(props) {
        super(props);

        this.state = {
            files: this.props,
            email: "",
            data: this.props.data,
            callback: this.props.callback,
            parent: this.props.parent
        }
    }

    // sendNotification = async () => {
    //     const { parent } = this.state;
    //     const result = await Get({
    //         url: `getDealDetails/${parent.id}`,
    //         urlPrefix: API_HOST
    //     });
    //     if (result.success) {
    //         this.setState({ dealDetail_id: result.response.financing_type_id, dealDetailsCosts: result.response.cost_object});
    //     }
    //     this.matchId();
    // }

    render() {
        const { files } = this.state;
        return (
            <div className="partner-deal">
                <div className="partner-deal-body">
                    <div className="options">
                        <div className="email">
                            <div className="helptext">
                                RTO Dealer Email
                            </div>
                            <div className="div-group row">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <input className="input-value" onChange={(e) => { this.setState({ email: e.target.value }) }} type="email" placeholder="Enter Email" />
                                </div>
                            </div>
                        </div>
                        <div className="email">
                            <div className="helptext">
                                RTO Dealer Email
                            </div>
                            <div className="div-group row">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><i className="fa fa-strikethrough"></i></span>
                                    </div>
                                    <ImageUpload onRemove={files.onFileRemove}
                                        onSelect={() => {
                                            alert('File Selected')
                                        }}
                                        />
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="partner-deal-add-footer">
                        {/* <div className="bank-detail-button">
                        <button className="btn btn-success">Send Bank Detail</button>
                    </div> */}
                        <div className="action-buttons">
                            <button className="btn btn-default">Cancel</button>
                            &nbsp;
                        <button onClick={(e) => { e.preventDefault(); console.log(this.state) }} className="btn btn-success">Submit</button>
                        </div>
                    </div>
                </div>

                );
            }
}
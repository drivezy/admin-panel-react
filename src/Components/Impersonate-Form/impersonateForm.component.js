// Higher Order Component
import React, { Component } from 'react';
import { Get, Post } from './../../Utils/http.utils';
import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';
import { BuildUrlForGetCall, IsUndefined } from './../../Utils/common.utils';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';


export default class ImpersonateFrom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userObject: []
        };
    }

    getInputRecord = async ({ input: val } = {}) => {
        if (val) {
            const options = {
                query: 'email like %22%25' + val + '%25%22 and admin=1'
            };
            let url = 'user';

            url = BuildUrlForGetCall(url, options);

            const result = await Get({ url });
            const userContent = result.response;
            return { options: userContent };
        }
    }

    convertToInputField = function ({ data, attr = 'inputField' }) {
        if (!IsUndefined(data)) {
            const { userObject } = this.state;
            userObject[attr] = data;
            this.setState({ userObject });
        }
    };

    submit = async () => {
        const { userObject = [] } = this.state;
        const result = await Post({ url: 'impersonateUser/' + userObject.selectValue.id });
        if (result.success) {
            ModalManager.closeModal({ impersonatedUser: result.response });
            window.location.reload(true);
        }
    }


    render() {
        const { userObject = [] } = this.state;
        return (
            <div>
                <SelectBox
                    onChange={(data) => this.convertToInputField({ data, attr: 'selectValue' })}
                    value={userObject.selectValue}
                    field='email'
                    placeholder="Search Admin Email"
                    getOptions={(input) => this.getInputRecord({ input })}
                />
                <button className="btn btn-info" onClick={this.submit} style={{ margin: '8px' }}>
                    Submit
                </button>
            </div>
        )
    }
}
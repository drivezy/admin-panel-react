import React, { Component } from 'react';
import {
    Table
} from 'reactstrap';
import SelectBox from './../../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';

import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Get, Delete, Post } from 'common-js-util';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';

import './addRoles.component.css'

export default class AddRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            role: {}
        };
    }

    componentDidMount() {
    }

    transfer = async (name) => {

        const result = await Get({ url: 'role?query=name' + ' like ' + '"' + '%' + name + '%' + '"' });

        if (result.success) {
            return result.response;
        }
        return [];

    }

    confirmChange = async () => {
        const { data, role } = this.state

        const result = await Post({
            body: {
                role_id: role.id,
                source_id: data.id,
                source: "User"
            },
            url: 'roleAssignment'
        });
        if (result.success) {
            window.location.reload(true);
        }
        ModalManager.closeModal();
    }




    render() {
        const { data } = this.state
        return (
            <div className="assign-user-role">
                <span>Assign Role</span>
                {/* <input type="text" className="form-control" onChange={(e) => { e.preventDefault(); this.transfer(e.target.value); }} placeholder="Enter Permission Name" aria-label="Permission" options={matches}></input> */}
                <SelectBox onChange={(value) => this.setState({ role: value })} getOptions={(input) => this.transfer(input)} isClearable={false} className="form-control" placeholder="Enter Role Name" field="name" />

                {/* <SelectBox
                        onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })}
                        value={child.selectValue} options={child.referenceObj}
                        field={child.column.reference_model.display_column}
                        placeholder="Select Value"
                        getOptions={(input) => this.getInputRecord({ input, parentIndex, childIndex })}
                    /> */}

                <div className="col-sm-12 btns">
                    <button className="btn btn-default" onClick={(e) => { e.preventDefault(); ModalManager.closeModal(); }
                    }> Cancel </button>
                    &nbsp;
                            <button type="submit" className="btn btn-success" onClick={(e) => { e.preventDefault(); this.confirmChange(); }
                    }> Submit </button>
                </div>

            </div>
        )
    }
}





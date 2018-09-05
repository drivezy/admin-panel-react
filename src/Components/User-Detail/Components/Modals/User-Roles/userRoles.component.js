import React, { Component } from 'react';
import {
    Table
} from 'reactstrap';

// import { AddPermission } from './../Add-User-Permission/addUserPermission.component';
import AddRole from './../Add-Roles/addRoles.component'

import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Get, Delete } from 'common-js-util';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';

import './userRoles.component.css'

export default class UserPermission extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    componentDidMount() {
    }

    transfer(id) {
        const method = async () => {
            const result = await Delete({ url: "roleAssignment/" + id });
            if (result.success) {
                ToastNotifications.success({ title: 'Success' });
            }

        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to proceed?", callback: method });
    }

    render() {
        const { data } = this.state
        return (
            <div className="user-role">
                <div className="add-role" onClick={() => {
                    ModalManager.openModal({
                        headerText: "Add Role",
                        modalBody: () => (<AddRole data={data} />)
                    })
                }}>
                    + Add
                </div>

                <div className="show-Role">
                    {data.roles.length ?
                        <Table>
                            <thead>
                                <tr className="list-heading table-row">
                                    <th>
                                        <label>Role Name</label>
                                    </th>
                                    <th>
                                        <label>Assigned By</label>
                                    </th>
                                    <th>
                                        <label>Assigned At</label>
                                    </th>
                                    <th className="text-center">
                                        <label><i className="fa fa-cog" aria-hidden="true"></i></label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.roles.map((value, key) => (

                                        <tr key={key}>
                                            <td>
                                                <label>{value.role.name}</label>
                                            </td>
                                            <td>
                                                <label>{value.created_user.display_name}</label>
                                            </td>
                                            <td>
                                                <label>{value.created_user.created_at}</label>
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-default" onClick={() => this.transfer(value.role.id)}><i className="fa fa-trash"></i> </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                        : <div className="data-not-present" >No data to show </div>
                    }
                </div>


            </div>
        )
    }
}





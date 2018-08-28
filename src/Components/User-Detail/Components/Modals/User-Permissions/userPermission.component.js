import React, { Component } from 'react';
import {
    Table
} from 'reactstrap';

// import { AddPermission } from './../Add-User-Permission/addUserPermission.component';
import AddPermission from './../Add-Permission/addPermission.component'

import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Get, Delete } from 'common-js-util';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';

import './userPermission.component.css'

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
            const result = await Delete({ url: "permissionAssignment/" + id });
            if (result.success) {
                ToastNotifications.success({ title: 'Success' });
            }

        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to proceed?", callback: method });
    }

    render() {
        const { data } = this.state
        return (
            <div className="user-permission">
                <div className="add-permission" onClick={() => {
                    ModalManager.openModal({
                        headerText: "Add Permission",
                        modalBody: () => (<AddPermission data={data} />)
                    })
                }}>
                    + Add
                </div>

                <div className="show-permission">
                    {data.permissions.length ?
                        <Table>
                            <thead>
                                <tr className="list-heading table-row">
                                    <th>
                                        <label>Permission Name</label>
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
                                    data.permissions.map((value, key) => (

                                        <tr key={key}>
                                            <td>
                                                <label>{value.permission.name}</label>
                                            </td>
                                            <td>
                                                <label>{value.created_user.display_name}</label>
                                            </td>
                                            <td>
                                                <label>{value.created_user.created_at}</label>
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-default" onClick={() => this.transfer(value.permission.id)}><i className="fa fa-trash"></i> </button>
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





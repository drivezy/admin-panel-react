import React, { Component } from 'react';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Post } from 'common-js-util';
import { RECORD_URL } from './../../Constants/global.constants'
import {
    Table
} from 'reactstrap';

import './userSearchList.component.css'

export default class UserSearchList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageSearchText: Location.search().searchText,
            users: []
        }
        this.redirect();
    }

    componentWillReceiveProps() {
        const newSearchText = Location.search().searchText;
        
        const { pageSearchText } = this.state;
        if (!newSearchText || (pageSearchText == newSearchText)) {
            return false;
        }
        this.state.pageSearchText = newSearchText;
        this.redirect();
    }

    redirect = async () => {
        const { pageSearchText } = this.state;
        const result = await Post({ url: "searchUser", body: { search_string: pageSearchText } });
        if (result.success) {
            this.setState({ users: result.response });
        }
    }

    transfer = (user) => {
        const url = '/user/' + user.id;
        Location.navigate({ url: url });
    }


    render() {
        // const result = this.redirect();
        const { users } = this.state;
        return (
            <div>
                {
                    users.length ?
                        (users.length == 1) ?
                            this.transfer(users[0])
                            :
                            <div className="multiple-results">
                                {users.length > 1 ?
                                    <Table>
                                        <thead>
                                            <tr className="list-heading table-row">
                                                <th>
                                                    <label>Username</label>
                                                </th>
                                                <th>
                                                    <label>Mobile</label>
                                                </th>
                                                <th>
                                                    <label>Email</label>
                                                </th>
                                                <th>
                                                    <label>Admin</label>
                                                </th>
                                                <th>
                                                    <label>License Number</label>
                                                </th>
                                                <th className="text-center">
                                                    <label><i className="fa fa-cog" aria-hidden="true"></i></label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                users.map((value, key) => (
                                                    <tr key={key}>
                                                        <td>
                                                            <label>{value.display_name}</label>
                                                        </td>
                                                        <td>
                                                            <label>{value.mobile}</label>
                                                        </td>
                                                        <td>
                                                            <label>{value.email}</label>
                                                        </td>
                                                        <td>
                                                            <label>{value.admin ? 'YES' : 'NO'}</label>
                                                        </td>
                                                        <td>
                                                            <label>{value.license_number}</label>
                                                        </td>
                                                        <td className="text-center">
                                                            <button className="btn btn-sm btn-default" onClick={() => this.transfer(value)}><i className="fa fa-info-circle"></i> </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                    : null
                                }
                            </div>
                        :
                        null
                }
            </div>
        )

    }
}
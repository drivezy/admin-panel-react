import React, { Component } from 'react';

import { Get } from 'common-js-util';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';
import { GetRelativeTime } from './../../../../Utils/time.utils';
import {
    Table
} from 'reactstrap';

import './repositoryInfo.component.css'
export default class RepositoryInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            deploymentHistory: {}
        }
    }

    componentDidMount() {
        const { data } = this.state
        this.getMatches()
    }

    getMatches = async () => {
        const { data } = this.state
        const result = await Get({
            url: "repositoryMergeDetails/" + data.id
        });

        this.setState({ deploymentHistory: result.response })

    }


    shutdown = async () => {

        let url = "deployCodeToServer/" + this.state.id;
        const result = await Get({
            url: url
        });
        if (result.success) {
            ModalManager.closeModal();
            ToastNotifications.success("Deployment Successful");
        }
        this.componentDidMount ();
    }

    reload = () => {
        this.componentDidMount()
    }

    render() {
        const { data, deploymentHistory } = this.state
        return (
            <div className="repository-info">
                <div>
                    <button className="reload" onClick={() => { this.reload() }}><i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
                <div className="rows">
                    <div className="column-heading">
                        Repository Details
                    </div>

                    <div className="columns">
                        <div className="fields-left">
                            <span className="text">Repository:</span>
                            <span className="data">{data.repository}</span>
                        </div>

                        <div className="fields-right">
                            <span className="text">Branch:</span >
                            <span className="data">{data.branch}</span>
                        </div>
                    </div>

                    <div className="columns">

                        <div className="fields-left">
                            <span className="text">Requested By:</span>
                            <span className="data">{data.requested_by}</span>
                        </div>
                        <div className="fields-right">
                            <span className="text">Merged By:</span>
                            <span className="data">{data.merged_by}</span>
                        </div>

                    </div>

                    <div className="columns">
                        <div className="fields-left">
                            <span className="text">Commit:</span>
                            <span className="data">{data.commit}</span>
                        </div>
                        <div className="fields-right">
                            <span className="text">Creation Time:</span>
                            <span className="data">{data.created_at}</span>
                        </div>
                    </div>
                </div>



                <div className="rows">
                    <div className="column-heading">
                        Deployment Details
                    </div>
                    <Table>
                        <thead>
                            <tr className="list-heading table-row">
                                <th>
                                    <label>Server Name</label>
                                </th>
                                <th>
                                    <label>Server IP</label>
                                </th>
                                <th>
                                    <label>Deployment Details</label>
                                </th>
                                <th>
                                    <label>Creation Time</label>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(deploymentHistory).length && deploymentHistory.deployments.length ?
                                    deploymentHistory.deployments.map((value, key) => (
                                        <tr key={key}>
                                            <td>
                                                <label>{value.hostname}</label>
                                            </td>
                                            <td>
                                                <label>{value.ip}</label>
                                            </td>
                                            <td>
                                                <label>{value.deployment_details}</label>
                                            </td>
                                            <td>
                                                <label>{GetRelativeTime(value.created_at)}</label>
                                            </td>
                                            <td>
                                            </td>
                                        </tr>
                                    ))

                                    : null
                            }
                        </tbody>
                    </Table>
                </div>

                <div className="rows">
                    <div className="column-heading">
                        Active Servers
                    </div>
                    <Table>
                        <thead>
                            <tr className="list-heading table-row">
                                <th>
                                    <label>Server Name</label>
                                </th>
                                <th>
                                    <label>Server IP</label>
                                </th>
                                <th>
                                    <label>Repository Name</label>
                                </th>
                                <th>
                                    <label>Server</label>
                                </th>
                                <th>
                                    <label><i className="fa fa-cog" aria-hidden="true"></i></label>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(deploymentHistory).length && deploymentHistory.servers.length ?
                                    deploymentHistory.servers.map((value, key) => (
                                        <tr key={key}>
                                            <td>
                                                <label>{value.hostname}</label>
                                            </td>
                                            <td>
                                                <label>{value.ip}</label>
                                            </td>
                                            <td>
                                                <label>{value.repository_name}</label>
                                            </td>
                                            <td>
                                                <label></label>
                                            </td>
                                            <td>
                                            </td>
                                            <td className="save-btn">
                                                <label><button className="btn btn-sm btn-default" onClick={() => { this.shutdown() }}><i class="fa fa-times-circle" style="color:red"></i></button></label>
                                            </td>
                                        </tr>
                                    ))

                                    : null
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}
import React, { Component } from 'react';

import { Get } from 'common-js-util';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';
import { GetRelativeTime } from './../../../../Utils/time.utils';
import {
    Table
} from 'reactstrap';

import './repositoryEventInfo.component.css'

export default class RepositoryInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            eventHistory: {},
            triggerHistory: {}
        }
    }

    componentDidMount() {
        const { data } = this.state
        this.getMatches()
    }

    getMatches = async () => {
        const { data } = this.state
        const result = await Get({
            url: 'eventQueue?query=source="REPO-MERGE-' + data.id + '"&includes=triggers'
        });

        this.setState({ eventHistory: result.response })
        this.setState({ triggerHistory: result.response[0] })

    }


    transmit = async (key) => {
        const { eventHistory } = this.state
        this.setState({ triggerHistory: eventHistory[key] })
    }

    reload = () => {
        this.componentDidMount()
    }

    render() {
        const { data, eventHistory, triggerHistory } = this.state
        return (
            <div className="repository-info">
                <div>
                    <button className="reload" onClick={() => { this.reload() }}><i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>

                <div className="rows">
                    <div className="column-heading">
                        Event Details
                    </div>
                    <Table>
                        <thead>
                            <tr className="list-heading table-row">
                                <th>
                                    <label>Event Name</label>
                                </th>
                                <th>
                                    <label>Object value</label>
                                </th>
                                <th>
                                    <label>Scheduled Start Time</label>
                                </th>
                                <th>
                                    <label>Start Time</label>
                                </th>
                                <th>
                                    <label>End Time</label>
                                </th>
                                <th>
                                    <label><i className="fa fa-cog" aria-hidden="true"></i></label>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (eventHistory && Object.keys(eventHistory).length) ?
                                    eventHistory.deployments.map((value, key) => (
                                        <tr key={key}>
                                            <td>
                                                <label>{value.event_name}</label>
                                            </td>
                                            <td>
                                                <label>{value.object_value}</label>
                                            </td>
                                            <td>
                                                <label>{value.scheduled_start_time}</label>
                                            </td>
                                            <td>
                                                <label>{value.start_time}</label>
                                            </td>
                                            <td>
                                                <label>{value.end_time}</label>
                                            </td>
                                            <td className="save-btn">
                                                <label><button className="btn btn-sm btn-default" onClick={() => { this.transmit(key) }}><i class="fa fa-info" ></i></button></label>
                                            </td>

                                        </tr>
                                    ))

                                    : <span className="data-absent">No Data to Show</span>
                            }
                        </tbody>
                    </Table>
                </div>

                <div className="rows">
                    <div className="column-heading">
                        Triggers
                    </div>
                    <Table>
                        <thead>
                            <tr className="list-heading table-row">
                                <th>
                                    <label>Identifier</label>
                                </th>
                                <th>
                                    <label>Start Time</label>
                                </th>
                                <th>
                                    <label>End Time</label>
                                </th>
                                <th>
                                    <label>Log File</label>
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                (triggerHistory && Object.keys(triggerHistory).length && triggerHistory.triggers.length) ?
                                    triggerHistory.servers.map((value, key) => (
                                        <tr key={key}>
                                            <td>
                                                <label>{value.identifier}</label>
                                            </td>
                                            <td>
                                                <label>{value.start_time}</label>
                                            </td>
                                            {/* <Link to={to}>{label}</Link> */}
                                            <td>
                                                <label>{value.end_time}</label>
                                            </td>
                                            <td>
                                                <label><a href={value.log_file}>{value.log_file}</a></label>
                                            </td>

                                        </tr>
                                    ))

                                    : <span className="data-absent">No Data to Show</span>
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}
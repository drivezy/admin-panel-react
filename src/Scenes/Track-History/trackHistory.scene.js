import React, { Component } from 'react';

import {
    Card, CardBody, CardHeader
} from 'reactstrap';

import { Get, Post } from 'common-js-util';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';

import TrackHistoryComponent from './../../Components/Track-History/trackHistory.component';
// /Users/kamleshnehra/admin-panel-react/src/Components/Track-History/trackHistory.component.js

export default class TrackHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.getTrackHistory();
    }

    getTrackHistory = async () => {
        const params = Location.search();
        const result = await Post({ url: 'vehicleLocation', body: params, urlPrefix: 'https://secure.justride.in/api/admin/'});
        // const result = await Post({ url });

        if (result.success) {
            const data = result.response;
            console.log(data);
            this.setState({ data });
        }
    }

    render() {
        const { data = {} } = this.state;

        return (
            <div className="ticket-detail">
                TrackHistory
                <TrackHistoryComponent data={data} />
            </div>
        )
    }
}
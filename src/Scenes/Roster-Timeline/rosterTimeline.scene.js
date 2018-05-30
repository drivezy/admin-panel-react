import React, { Component } from 'react';
import './rosterTimeline.scene.css';


import { Post } from './../../Utils/http.utils';
import RosterContent from './../../Components/Roster-Content/rosterContent.component';

export default class RosterTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rosterData: {}
        };
    }

    rosterData = Post({ url: 'getRosterData', body: { venue: 1, start_date: '2018-05-14', end_date: '2018-05-20' } });

    render() {
        const { rosterData = {} } = this.state;
        return (
            <div>
                <RosterContent rosterData={rosterData}/>
            </div>
        )
    }
}
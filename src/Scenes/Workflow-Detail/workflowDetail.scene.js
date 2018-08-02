import React, { Component } from 'react';


import { Get } from 'common-js-util';

import './workflowDetail.scene.css';

export default class WorkflowDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketDetail: {}
        };
    }

    componentDidMount() {
        
    }

    

    render() {
        // const { ticketDetail = {} } = this.state;

        return (
            <div className="ticket-detail">
            </div>
        )
    }
}
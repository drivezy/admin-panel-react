import React, { Component } from 'react';

export default class RosterContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rosterData: props.rosterData
        }
    }

    render() {
        const { rosterData } = this.state
        return (
            <h1></h1>
        )
    }
}
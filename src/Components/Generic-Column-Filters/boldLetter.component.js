import React, { Component } from 'react';

export default class Test extends Component {

    render() {
        const { data } = this.props;
        return (
            <h5> {data} </h5>
        )
    }
}
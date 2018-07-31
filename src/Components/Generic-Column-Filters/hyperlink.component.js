import React, { Component } from 'react';

export default class Hyperlink extends Component {

    render() {
        const { data } = this.props;
        return (
            <a href={`${data}`} target="_blank"> {data} </a>
        )
    }
}
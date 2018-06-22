/**
 * Component for Showing time in timeAgo format
 */
/**
 * import library:
 * moment:for showing time in timeago format
 */


import React, { Component } from 'react';
import moment from 'moment';
export default class Timeago extends React.Component {
    constructor(props) {
        super(props);
        
    }
    /* showing time in timeago format*/ 
    render() {

        const {time} = this.props;

        return (
            <div>
                {moment(time).fromNow()}
            </div>
        )
    }
}


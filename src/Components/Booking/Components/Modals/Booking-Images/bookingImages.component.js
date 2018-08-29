import React, { Component } from 'react';

import ViewImages from './../View-Images/viewImages.component'

export default class BookingImages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        }
    }

    render() {
        const { data } = this.state
        return (
            <div >
                <ViewImages data={data} />
            </div>
        )
    }
}
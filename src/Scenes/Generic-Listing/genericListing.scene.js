import React, { Component } from 'react';
import './genericListing.css';
import { GetUrlParams } from './../../Utils/location.utils';
import { GetMenuDetail } from './../../Utils/generic.utils';
import { ConvertMenuDetailForGenericListing } from './../../Utils/genericListing.utils';

export default class GenericListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props)
        }
        console.log(this.state);
    }

    componentDidMount() {

    }

    render() {
        return (
            <h1 className="generic-listing-container">
                Generic listing
            </h1>
        );
    }
}
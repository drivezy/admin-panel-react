import React, { Component } from 'react';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Post } from 'common-js-util';
import { RECORD_URL } from './../../Constants/global.constants'
import {
    Table
} from 'reactstrap';

import './vehicleSearchList.component.css'

export default class VehicleSearchList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageSearchText: Location.search().searchText,
            vehicles: []
        }
        this.redirect();
    }

    componentWillReceiveProps() {
        const newSearchText = Location.search().searchText;
        console.log(Location.search())
        const { pageSearchText } = this.state;
        if (!newSearchText || (pageSearchText == newSearchText)) {
            return false;
        }
        this.state.pageSearchText = newSearchText;
        this.redirect();
    }

    redirect = async () => {
        const { pageSearchText } = this.state;
        const result = await Post({ url: "searchVehicle", body: { search_string: pageSearchText } });
        if (result.success) {
            this.setState({ vehicles: result.response });
        }
    }

    transfer = (vehicle) => {
        if (vehicle) {
            const url = '/vehicle/' + vehicle.id;
            Location.navigate({ url: url });
        }
    }


    render() {
        // const result = this.redirect();
        const { vehicles } = this.state;

        return (
            <div>
                {
                    vehicles.length ?
                        this.transfer(vehicles[0])
                        : null
                }
            </div>
        )
    }
}
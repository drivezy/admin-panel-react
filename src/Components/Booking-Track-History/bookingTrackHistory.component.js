import React, { Component } from 'react';

import {
    Card, CardBody, CardHeader
} from 'reactstrap';

import moment from 'moment';

import { ToastNotifications } from 'drivezy-web-utils/build/Utils';

import { Get, Post } from 'common-js-util';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';

import TrackHistoryComponent from './../../Components/Track-History/trackHistory.component';
import DatePicker from './../../Components/Forms/Components/Date-Picker/datePicker';
import { GetLookupValues } from './../../Utils/lookup.utils';

/** 
 * Modal for showing vehicle track history at booking detail page
 */
export default class BookingTrackHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            alerts: [],
            mapFlag: true,
            alertPreference: false,
        };
    }

    componentDidMount() {
        this.getLookups();
    }

    getLookups = async () => {
        const result = await GetLookupValues(42);
        if (result.success) {
            const alarms = result.response;
            let preDeactivatedAlarms = [22, 23]; // 22 & 23 is for ignition on & ignition off which is to be
            alarms.map((val) => {
                if (preDeactivatedAlarms.indexOf(parseInt(val.value)) == -1) {
                    val.active = true;
                } else {
                    val.active = false;
                }
            });
            this.setState({ alarms })
        }
    }

    UNSAFE_componentWillReceiveProps (nextProps){
        let params = {};
        params.start_time =  nextProps.data.pickup_time;
        params.end_time = nextProps.data.drop_time;
        params.alerts = true;
        params.vehicle = nextProps.data.vehicle_id;
        // params.start_time = "2018-08-28 14:29:42";
        // params.end_time = "2018-08-28 20:00:00";
        // params.alerts = true;
        // params.vehicle = "1654";
     
        this.getTrackHistory(params);
    }

    getTrackHistory = async (params) => { 

        const result = await Post({ url: 'vehicleLocation', body: params});

        if (result.success && typeof result.response == "object" && result.response.hasOwnProperty("location") && result.response.location.length) {
            const data = result.response.location;
            const alerts = result.response.alerts;
            this.setState({ data, alerts });
        }else{
            this.setState({mapFlag: false});
        }
    }

    render() {
        const { data, mapFlag, alarms, alertPreference, alerts } = this.state;
        console.log(alarms);
        return (
            <div className="track-history">
            {
                mapFlag ?
                (<TrackHistoryComponent data={data} alarms={alarms} alerts={alerts} alertPreference={alertPreference} />):
                (<div style={{padding: '30px', textAlign: 'center'}}>No data to show for this vehicle</div>)
            }
            </div>
        )
    }
}
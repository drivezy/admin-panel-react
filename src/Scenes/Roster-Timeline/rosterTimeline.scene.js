import React, { Component } from 'react';
import './rosterTimeline.scene.css';

import { ToastNotifications } from 'drivezy-web-utils/build/Utils';

import { Get, Post } from './../../Utils/http.utils';

import RosterContent from './../../Components/Roster-Content/rosterContent.component';
import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';
import WeekSelector from './../../Components/Week-Selector/weekSelector.component'

import { FetchCities } from './../../Constants/api.constants';

export default class RosterTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            rosterData: {},
            cities: [],
            city: {},
            venues: [],
            venue: {},
            weeks: [],
            minLimit: 5,
            maxLimit: 5,
            week: {},
            origin: 'weeklyView'
        };
    }

    componentDidMount() {
        this.getCities();
    }

    onCityChange = (newValue) => {
        this.setState({ city: newValue });
        this.getVenues(newValue.id);
    }

    onWeekChange = (newValue) => {
        this.setState({ week: newValue });
    }

    getCities = async () => {
        const citiesResult = await Get({ url: FetchCities });
        if (citiesResult.success) {
            const cities = citiesResult.response;
            this.setState({ cities });
        }
    }

    getVenues = async (cityId) => {
        const venuesResult = await Get({ url: 'venue?query=city_id=' + cityId });
        if (venuesResult.success) {
            const venues = venuesResult.response;
            this.setState({ venues });
        }
    }

    getRosterDetail = async () => {
        const { venue, week } = this.state
        const result = await Post({ url: 'getRosterData', body: { venue: venue.id, start_date: week.shiftStartDate, end_date: week.shiftEndDate } });
        if (result.original.success) {
            const rosterData = result.original.response;
            this.setState({ ready: true, rosterData: rosterData })
        }
    }

    createAssignments = async () => {
        const { venue, week } = this.state
        console.log(venue, week);
        const result = await Post({ url: 'createFleetAssignmentRecords', body: { venue_id: venue.id, shift_date: week.shiftDate } });
        if (result.success) {
            ToastNotifications.success({ title: 'Loaded Weekly roster!' });
            this.getRosterDetail();
        }
    }

    render() {
        const { ready, rosterData, cities = [], city, venues = [], venue, weeks = [], minLimit, maxLimit, week, origin } = this.state;
        return (
            <div className="roster-timeline">
                <div className="roster-header">
                    <div className="header-content">
                        <h6>Roster Timeline</h6>
                        <div className="roster-form">
                            <div className="box-width">

                                {
                                    cities.length ?
                                        <SelectBox
                                            onChange={this.onCityChange}
                                            options={cities}
                                            placeholder="City"
                                            field='name'
                                            value={city}
                                        />
                                        : null
                                }
                            </div>
                            <div className="box-width">
                                {
                                    venues.length ?
                                        <SelectBox
                                            onChange={(data) => this.setState({ venue: data })}
                                            options={venues}
                                            placeholder="Venue"
                                            field='name'
                                            value={venue}
                                        />
                                        : null
                                }
                            </div>
                            <div className="week-selector">
                                <WeekSelector weeks={weeks} week={week} onChange={this.onWeekChange} minLimit={minLimit} maxLimit={maxLimit} />
                            </div>
                            <div className="create-roster">
                                <button className="btn btn-primary" onClick={() => this.createAssignments()}>Get Roster</button>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    ready ?
                        <RosterContent rosterData={rosterData} origin={origin} />
                        : null
                }

            </div>
        )
    }
}
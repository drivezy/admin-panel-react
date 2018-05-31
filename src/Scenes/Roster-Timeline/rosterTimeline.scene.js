import React, { Component } from 'react';
import './rosterTimeline.scene.css';

import { Get, Post } from './../../Utils/http.utils';

import RosterContent from './../../Components/Roster-Content/rosterContent.component';
import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';
import WeekSelector from './../../Components/Week-Selector/weekSelector.component'

import { FetchCities } from './../../Constants/api.constants';

export default class RosterTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rosterData: {},
            cities: [],
            city: {},
            venues: [],
            venue: {},
            weeks: [],
            week: {},
            minLimit: 5,
            maxLimit: 5
        };
    }

    componentDidMount() {
        this.getRosterDetail();
        this.getCities();
    }

    onCityChange = (newValue) => {
        this.setState({ city: newValue });
        this.getVenues(newValue.id);
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
        const result = await Post({ url: 'getRosterData', body: { venue: 1, start_date: '2018-05-14', end_date: '2018-05-20' } });
        if (result.original.success) {
            const rosterData = result.original.response;
            this.setState({ rosterData })
        }
    }

    render() {
        const { rosterData = {}, cities = [], city, venues = [], venue, weeks = [], week, minLimit, maxLimit } = this.state;
        return (
            <div className="roster-timeline">
                <div className="roster-header">
                    <div className="header-content">
                        <h6>Roster Timeline</h6>
                        <div className="roster-form">
                            <div className="box-width">

                                {
                                    cities.length &&
                                    <SelectBox
                                        onChange={this.onCityChange}
                                        options={cities}
                                        placeholder="City"
                                        field='name'
                                        value={city}
                                    />
                                }
                            </div>
                            <div className="box-width">
                                {
                                    venues.length &&
                                    <SelectBox
                                        onChange={(data) => this.setState({ venue: data })}
                                        options={venues}
                                        placeholder="Venue"
                                        field='name'
                                        value={venue}
                                    />
                                }
                            </div>
                            <div className="week-selector">
                                <WeekSelector weeks={weeks} week={week} minLimit={minLimit} maxLimit={maxLimit} />
                            </div>
                            <div className="create-roster">
                                <button className="btn btn-primary" >Get Roster</button>
                            </div>
                        </div>
                    </div>
                </div>
                <RosterContent rosterData={rosterData} />
            </div>
        )
    }
}
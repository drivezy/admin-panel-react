import React, { Component } from 'react';

import SelectBox from "./../../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component";
import DatePicker from './../../../Forms/Components/Date-Picker/datePicker';

import { MultiUploadModal } from './../../../../Utils/upload.utils';
import { Get, Post } from 'common-js-util';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';
import {
    Table
} from 'reactstrap';

import { GroupBy } from 'common-js-util/build/common.utils';

import './addExpense.component.css'


export default class RepositoryInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            cities: [],
            venues: [],
            venueid: 0,
            expenses: [],
            expense: '',
            vendor: '',
            amount: 0,
            cityid: 0,
            comment: '',
            time: 0,
            expenseHeadId: 0,
            vendorId: 0
        }
    }

    componentDidMount() {
        const { data } = this.state
        this.getCity()
    }

    getCity = async () => {
        const result = await Get({ url: 'city' });
        let cities = []
        if (result.success) {
            let cityData = result.response;
            cityData.map((value, key) => {
                let city = {}
                city.name = value.name
                city.id = value.id
                cities.push(city)
            })

            this.setState({ cities })
        }
    }

    setCity = (city) => {

        // const { cities } = this.state
        // let cityid;
        // Object.keys(cities).map((value, keys) => {
        //     if (cities[value].name == cityName) {
        //         cityid = cities[value].id

        //     }
        // }
        // )
        this.setState({ cityid: city.id });
        this.getVenue(city.id);
    }

    getVenue = async (cityid) => {

        const result = await Get({ url: 'venue?query=city_id=' + cityid + ' and ' + 'active=1&limit=200' });
        let venues = []
        if (result.success) {
            let venueData = result.response;
            venueData.map((value, key) => {
                let venue = {}
                venue.name = value.name
                venue.id = value.id
                venues.push(venue)
            })
            this.setState({ venues })

        }
    }

    setVenue = (venueName) => {
        const { venues } = this.state
        let venueid;
        Object.keys(venues).map((value, keys) => {
            if (venues[value].name == venueName) {
                venueid = venues[value].id
            }
        }
        )
        this.setState({ venueid })
    }

    getExpenseHead = async (name) => {
        const result = await Get({ url: 'expenseHead?query=head_name like ' + '%22%25' + name + '%25%22' });
        let expenses = []
        if (result.success) {
            let expenseData = result.response;
            expenseData.map((value, key) => {
                let expense = {}
                expense.name = value.name
                expense.id = value.id
                expenses.push(expense)
            })
            this.setState({ expenses })
        }
    }

    transfer = async () => {
        const { cityid, amount, comment, time, expenseHeadId, vendorId, venueid } = this.state

        const result = await Post({
            body: {
                amount: amount,
                city_id: cityid,
                comment: comment,
                expense_date: time,
                expense_head_id: expenseHeadId,
                vendor_id: vendorId,
                venue_id: venueid,
            },
            url: 'expenseVoucher'
        });
        if (result.success) {
            ModalManager.closeModal();
            MultiUploadModal({ title: 'Add Expense', onSubmit: this.attachImage })
        }

    }

    attachImage = (data) => {
        this.props.callback();
        ToastNotifications.success({ title: "Image uplaoded successfully!" });
        ModalManager.closeModal();
    }

    render() {
        const { cities, venues, expenses, expense, vendor, time } = this.state
        let cityList = []
        let venueList = []
        let expenseList = []


        // Object.keys(venues).map((value, key) => {
        //     venueList.push(venues[value].name)
        // })

        // Object.keys(expenses).map((value, key) => {
        //     expenseList.push(expenses[value].name)
        // })

        return (
            <div className="expense-info">
                <div className="rows">

                    <div className="columns">
                        <div className="fields-left">
                            <span className="text-field">City</span>
                            <SelectBox onChange={(e) => this.setCity(e)} className="data-field" placeholder='Select City' field='name' options={cities} ></SelectBox>
                        </div>

                        <div className="fields-right">
                            <span className="text-field">Venue</span>
                            <SelectBox onChange={(e) => { this.setVenue(e); this.setState({ venueid: e.id }) }} className="data-field" placeholder='Select Venue' field='name' options={venues} ></SelectBox>
                        </div>

                    </div>

                    <div className="columns">
                        <div className="fields-left">
                            <span className="text-field">Amount</span>
                            <input type="number" className="data-field textbox" onChange={(e) => { e.preventDefault(); this.setState({ amount: e.target.value }); }} placeholder="Amount" ></input>
                        </div>

                        <div className="fields-right">
                            <span className="text-field">Expense Date</span>
                            <DatePicker single={true} value={time} placeholder={`Select Date`} timePicker={true} name="Pickup time"
                                onChange={(name, value) => { this.setState({ time: value }) }}
                            />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="fields-left">
                            <span className="text-field">Expense Head</span>
                            <SelectBox
                                onChange={(value) => { this.setState({ expenseHeadId: value.id, expense: value }) }}
                                field='head_name'
                                queryField='head_name'
                                async='api/admin/expenseHead'
                                value={expense}
                            />
                        </div>

                        <div className="fields-left">
                            <span className="text-field">Vendor Detail</span>
                            <SelectBox
                                onChange={(value) => { this.setState({ vendorId: value.id, vendor: value }) }}
                                field='email_id'
                                queryField='email_id'
                                async='api/admin/vendor'
                                value={vendor}
                            />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="fields-center">
                            <span className="text-field">Comment</span>
                            <textarea type="text" className="data-field textbox" onChange={(e) => { e.preventDefault(); this.setState({ comment: e.target.value }); }} placeholder="Comment" ></textarea>
                        </div>

                    </div>

                </div>

                <div className="col-sm-12 btns">
                    <button className="btn btn-default" onClick={(e) => { e.preventDefault(); ModalManager.closeModal(); }
                    }> Cancel </button>
                    &nbsp;
                            <button type="submit" className="btn btn-success" onClick={(e) => { e.preventDefault(); this.transfer(); }
                    }> Submit </button>
                </div>
            </div>

        )
    }
}
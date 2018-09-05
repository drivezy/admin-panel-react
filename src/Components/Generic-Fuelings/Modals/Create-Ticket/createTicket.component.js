import React, { Component } from 'react';
import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { SubscribeToEvent, UnsubscribeEvent } from 'state-manager-utility';
import { Post } from 'common-js-util';
import './createTicket.component.css';

export default class CreateTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            comment: {},
            userData: {}
        };
    }

    componentDidMount() {
        this.setComment()
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }


    userDataFetched = (data) => {
        // this.state.currentUser = data;
        this.setState({ userData: data });
    }


    transfer = async () => {
        const { data } = this.state
        const result = await Post({
            url: "task",
            body: {
                category: 232,
                assignee: data["city.city_head_id"],
                priority: 2,
                comment: this.state.comment,
                subject: "Fueling Approval-" + data.id,
                from_email: this.state.userData.email,
                from_name: this.state.userData.display_name
            }
        });
        ModalManager.closeModal();
        if (result.success) {
            ToastNotifications.success({ title: 'Ticket has been assigned to the City Head' });
        }
    }


    setComment = () => {
        let comment;
        const { data } = this.state

        // comment = {
        //     "Venue": data["vehicle.venue.name"],
        //     "Car": data["vehicle_id"],
        //     "Reg. No.": data["vehicle.registration_number"],
        //     "Litres": data["litres"],
        //     "Amount": data["amount"],
        //     // "Source": BPCL,
        //     "Rate": data["amount"] / data["litre"],
        //     // "Fueling Date": 2018-08 - 21 10: 59: 11,
        //     "Created By": data["created_by"],
        //     "Created At": data["created_at"]
        // }

        comment = " Venue:- " + data["vehicle.venue.name"] + "\n Car:-" + data["vehicle_id"] + "\n Reg. No.:- " + data["vehicle.registration_number"] + "\n Litres:- " + data["litres"] + "\n Amount:- " + data["amount"] + "\n Source:- " + data["source.name"] + "\n Rate:- " + data["amount"] / data["litres"] + "\n Fueling Time:- " + data["fueling_time"] + "\n Created By:- " + data["created_by"] + "\n Created At:- " + data["created_at"];

        this.setState({ comment })
    }


    render() {
        const { data } = this.state
        const { comment } = this.state;
        // const commentString = JSON.stringify(comment)
        return (
            <div className="create-ticket">
                <div>
                    <span className="text-field">Comment</span>
                    <textarea onChange={(e) => { this.setState({ comment: e.target.value }) }} value={comment} className="data-field"></textarea>
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

import React, { Component } from 'react';

import { ToastNotifications } from 'drivezy-web-utils/build/Utils';

import './preferenceSetting.css';
import ViewJson from './../../Components/View-Json/viewJson.component';
import CustomTooltip from './../../Components/Custom-Tooltip/customTooltip.component';
import { SetPreference, DeletePreference } from './../../Utils/preference.utils';

export default class PreferenceSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listing: props.listing
        }
    }

    override = async ({ parameter, data }) => {
        if (window.confirm('Are you sure you want to override ' + parameter + ' for all?')) {
            const result = await SetPreference(parameter, data);
            if (result.success) {
                ToastNotifications.success({ title: parameter + " has been overriden." });
                let listing = this.state.listing;
                listing[parameter] = result.response.value
                this.setState({ listing });
            }
        }
    }

    delete = async ({ parameter, data, forAll }) => {
        if (forAll && !this.props.preferenceObj.role) {
            return false;
        }

        let message = "Do you really want to delete " + parameter;
        message += forAll ? " for all?" : "?";

        if (window.confirm(message)) {
            const result = await DeletePreference(parameter, forAll);
            if (result.success) {
                ToastNotifications.success({ title: parameter + " has been deleted." });
                let listing = this.state.listing;

                delete listing[parameter];
                this.setState({ listing });
            }
        }

    }

    actions = [{
        name: "Over Ride Preference",
        icon: "fa-superpowers",
        callFunction: this.override
    }, {
        name: "Delete Preference For All",
        icon: "fa-eraser",
        callFunction: this.delete
    }, {
        name: "Delete Preference For Me",
        icon: "fa-trash",
        callFunction: ({ ...arg }) => this.delete({ ...arg, ...{ forAll: true } })
    }]

    render() {
        const { listing } = this.state;
        const listingData = Object.keys(listing);
        return (
            <div>
                <table className="table table-hover flip-content exportable table-bordered">
                    <thead className="flip-content white-background">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Preferences</th>
                            <th className="responsive-height pull-center">
                                <i className="fa fa-cog fa-lg"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listingData.map((data, key) => {
                                return (
                                    <tr key={key} className="table-row">
                                        <td>
                                            {key + 1}
                                        </td>
                                        <td>
                                            {data}
                                        </td>
                                        <td>
                                            <ViewJson textToView={listing[data]}></ViewJson>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                {
                                                    this.actions.map((action, key) => {

                                                        const html =
                                                            <i className={`fa ${action.icon}`} onClick={() => { action.callFunction({ parameter: data, data: listing[data] }) }} ></i>
                                                        return (
                                                            <CustomTooltip placement="top" key={key} html={html} title={action.name}></CustomTooltip>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

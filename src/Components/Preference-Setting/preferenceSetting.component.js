import React, { Component } from 'react';
import ViewJson from './../../Components/View-Json/viewJson.component';

export default class PreferenceSetting extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { listing } = this.props;
        const listingData = Object.keys(listing);
        return (
            <div>
                <table className="table table-hover flip-content exportable table-bordered">
                    <thead className="flip-content white-background">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Preferences</th>
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

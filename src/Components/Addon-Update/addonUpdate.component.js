import React from 'react';
import './addonUpdate.component.css';
import { Get } from 'common-js-util';

export default class AddonUpdate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rideData: this.props.rideData,
            rideStatus: this.props.rideStatus,
            addOns: [],
            startAddons: [],
            endAddons: []
        }
    }

    componentDidMount() {
        const { rideData } = this.state;
        this.getAddons(rideData);
    }

    getAddons = async (rideData) => {
        if (rideData.is_bike == 1) {
<<<<<<< Updated upstream
            var url = 'accessoryAddon?query=active=1 and bike_only=0';
        } else {
            url = 'accessoryAddon?query=active=1 and bike_only=1';
=======
            var url = 'accessoryAddon?query=active=1 and bike_only=1';
        } else {
            url = 'accessoryAddon?query=active=1 and bike_only=0';
>>>>>>> Stashed changes
        }
        const result = await Get({ url: url, urlPrefix: 'https://api.justride.in/api/admin/' });
        if (result.success) {
            this.setState({ addOns: result.response });
        }
    }

<<<<<<< Updated upstream
    updateStartAddons = (quantity, addOn) => {
        const { startAddons } = this.state;
        quantity ? startAddons.push(addOn) : startAddons.splice(0,1);
        this.setState({ startAddons });
        console.log(startAddons);
    }

    updateEndAddons = (quantity, addOn) => {
        const { endAddons } = this.state;
        quantity ? endAddons.push(addOn) : endAddons.splice(0,1);
        this.setState({ endAddons });
    }

    render() {
        const { addon = {}, rideStatus, addOns = [], startAddons, endAddons} = this.state;
=======
    updateValue = (quantity, addon) => {
        const { addOns } = this.state;
        console.log(addon)
    }

    render() {
        const { addon = {}, rideStatus, addOns = [], startAddons} = this.state;
>>>>>>> Stashed changes

        return (
            <div className="addons-wrapper">
                {
                rideStatus ?
                <div className="addons">
                    <div className="row">
                        <div className="col-sm-12">
                            <label>Start Ride Addons</label>
                        </div>
                    </div>
                    <div className="addon-update">
                        {
                            addOns.map((addon, key) => (
                                (addon.name != 'Complimentary Helmet') ?
<<<<<<< Updated upstream
                                <div className="row" key={key}>
=======
                                <div className="row">
>>>>>>> Stashed changes
                                    <div className="col-sm-6 no-padding-right">
                                        {addon.name}
                                    </div>
                                    <div className="col-sm-3 no-padding-right no-padding-left">
<<<<<<< Updated upstream
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm btn-danger"  onClick={(e) => this.updateStartAddons(0, addon)}>-</button>
                                            <button type="button" className="btn btn-default"><div>{}</div></button>
                                            <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateStartAddons(1, addon)}>+</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        Rs. {addon.fixed_cost*startAddons.length}
=======
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-sm btn-primary" onClick={(e) => this.updateValue(-1, addon)}>-</button>
                                            <button type="button" class="btn btn-default"><div>{startAddons.length}</div></button>
                                            <button type="button" class="btn btn-sm btn-primary" onClick={(e) => this.updateValue(1, addon)}>+</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        Rs. 0
>>>>>>> Stashed changes
                                    </div>
                                </div>
                                :
                                null
                            ))
                        }
                    </div>
                </div>
                :
                <div>
                <div className="addons">
                    <div className="row">
                        <div className="col-sm-12">
                            <label>Start Ride Addons</label>
                        </div>
                    </div>
                    <div className="addon-update">
                        {
                            addOns.map((addon, key) => (
                                (addon.name != 'Complimentary Helmet') ?
<<<<<<< Updated upstream
                                <div className="row" key={key}>
=======
                                <div className="row">
>>>>>>> Stashed changes
                                    <div className="col-sm-6 no-padding-right">
                                        {addon.name}
                                    </div>
                                    <div className="col-sm-3 no-padding-right no-padding-left">
<<<<<<< Updated upstream
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this.updateStartAddons(0, addon)}>-</button>
                                            <button type="button" className="btn btn-default">{startAddons.length}</button>
                                            <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateStartAddons(1, addon)}>+</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        Rs. {addon.fixed_cost*startAddons.length}
=======
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-sm btn-primary">-</button>
                                            <button type="button" class="btn btn-default">0</button>
                                            <button type="button" class="btn btn-sm btn-primary">+</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        Rs. 0
>>>>>>> Stashed changes
                                    </div>
                                </div>
                                :
                                null
                            ))
                        }
                    </div>
                </div>
                <br />
                    <div className="addons">
                        <div className="row">
                            <div className="col-sm-12">
                                <label>End Ride Addons</label>
                            </div>
                        </div>
                        <div className="addon-update">
                            {
                                addOns.map((addon, key) => (
                                    (addon.name != 'Complimentary Helmet') ?
<<<<<<< Updated upstream
                                    <div className="row" key={key}>
=======
                                    <div className="row">
>>>>>>> Stashed changes
                                        <div className="col-sm-6 no-padding-right">
                                            {addon.name}
                                        </div>
                                        <div className="col-sm-3 no-padding-right no-padding-left">
<<<<<<< Updated upstream
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this.updateEndAddons(0, addon)}>-</button>
                                                <button type="button" className="btn btn-default">{endAddons.length}</button>
                                                <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateEndAddons(1, addon)}>+</button>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            Rs. {addon.fixed_cost*endAddons.length}
=======
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-sm btn-primary">-</button>
                                                <button type="button" class="btn btn-default">0</button>
                                                <button type="button" class="btn btn-sm btn-primary">+</button>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            Rs. 0
>>>>>>> Stashed changes
                                        </div>
                                    </div>
                                    :
                                    null
                                ))
                            }
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}
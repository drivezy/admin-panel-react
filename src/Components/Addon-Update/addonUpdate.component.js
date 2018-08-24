import React from 'react';
import './addonUpdate.component.css';
import { Get } from 'common-js-util';
import { IsObjectHaveKeys } from 'common-js-util/build/common.utils';
import { API_HOST } from './../../Constants/global.constants';

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

    /**
     * fetch Addons according to vehicle booked
     * @param  {object} rideData
     */
    getAddons = async (rideData) => {
        if (rideData.is_bike == 0) {
            var url = 'accessoryAddon?query=active=1 and bike_only=0';
        } else {
            url = 'accessoryAddon?query=active=1 and bike_only=1';
        }
        const result = await Get({ url: url, urlPrefix: API_HOST });
        if (result.success) {
            this.setState({ addOns: result.response });
        }

    }

    /**
     * 1 for adding addon 0 for removing addon
     * @param  {int} quantity
     * addon details when add or subtract is clicked
     * @param  {object} addOn
     */
    updateStartAddons = (quantity, addOn) => {
        const { startAddons = [], rideData } = this.state;
        const addons = {
            id: addOn.id,
            quantity
        };
        if (!IsObjectHaveKeys(startAddons)) {
            startAddons.push(addons)
        }
        else {
            let flag = 0;
            startAddons.map((addon) => (
                (
                    quantity ?
                        (addon.id == addOn.id) ? (addon.quantity++ , flag++) : null
                        :
                        (addon.id == addOn.id) ? ((addon.quantity > 0) ? addon.quantity-- : addon.quantity = 0, flag++) : null
                )
            ))
            if (!flag && quantity) {
                startAddons.push(addons);
            }
            else if (!flag && !quantity) {
                startAddons.splice(0, 1);
            }
        }
        this.setState({ startAddons });
        rideData.start_addons = startAddons;
        this.setState({ rideData });
    }

    /**
     * 1 for adding addon 0 for removing addon
     * @param  {int} quantity
     * addon details when add or subtract is clicked
     * @param  {object} addOn
     */
    updateEndAddons = (quantity, addOn) => {
        const { endAddons, rideData } = this.state;
        const addons = {
            id: addOn.id,
            quantity
        };
        if (!IsObjectHaveKeys(endAddons)) {
            endAddons.push(addons)
        }
        else {
            let flag = 0;
            endAddons.map((addon) => (
                (
                    quantity ?
                        (addon.id == addOn.id) ? (addon.quantity++ , flag++) : null
                        :
                        (addon.id == addOn.id) ? ((addon.quantity > 0) ? addon.quantity-- : addon.quantity = 0, flag++) : null
                )
            ))
            if (!flag && quantity) {
                endAddons.push(addons);
            }
            else if (!flag && !quantity) {
                endAddons.splice(0, 1);
            }
        }
        this.setState({ endAddons });
        rideData.addons = endAddons;
        this.setState({ rideData });
    }

    render() {
        const { rideStatus, addOns = [], startAddons, endAddons } = this.state;

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
                                            <div className="row" key={key}>
                                                <div className="col-sm-6 no-padding-right">
                                                    {addon.name}
                                                </div>
                                                <div className="col-sm-3 no-padding-right no-padding-left">
                                                    <div className="btn-group">
                                                        {/* updateStartAddons to update start ride addons
                                                            Pass 0 for subtracting one add-on and 
                                                            Pass 1 for adding one add-on
                                                        */}
                                                        <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this.updateStartAddons(0, addon)}>-</button>
                                                        {/* 
                                                            Display Addon Quantity
                                                        */}
                                                        <button type="button" className="btn btn-default">
                                                            {
                                                                Array.isArray(startAddons) && startAddons.length ?
                                                                    (startAddons.map((addOn, key) => (
                                                                        (addOn.id == addon.id) ? (addOn.quantity || 0) : null)))
                                                                    :
                                                                    0
                                                            }
                                                        </button>
                                                        {/* updateStartAddons to update start ride addons
                                                            Pass 0 for subtracting one add-on and 
                                                            Pass 1 for adding one add-on
                                                        */}
                                                        <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateStartAddons(1, addon)}>+</button>
                                                    </div>
                                                </div>
                                                {/* 
                                                    Display Addon Total Price
                                                */}
                                                <div className="col-sm-3">
                                                    Rs. {
                                                        // Array.isArray(startAddons) & startAddons.length ?
                                                        (startAddons.map((addOn, key) => (
                                                            (addOn.id == addon.id) ? (addOn.quantity * addon.fixed_cost || 0) : null)))
                                                        // :
                                                        // 0
                                                    }
                                                </div>
                                                <br />
                                                <br />
                                            </div>
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
                                                <div className="row" key={key}>
                                                    <div className="col-sm-6 no-padding-right">
                                                        {addon.name}
                                                    </div>
                                                    <div className="col-sm-3 no-padding-right no-padding-left">
                                                        <div className="btn-group">
                                                            {/* updateStartAddons to update start ride addons
                                                            Pass 0 for subtracting one add-on and 
                                                            Pass 1 for adding one add-on
                                                        */}
                                                            <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this.updateStartAddons(0, addon)}>-</button>
                                                            {/* 
                                                            Display Addon Quantity
                                                        */}
                                                            <button type="button" className="btn btn-default">
                                                                {
                                                                    Array.isArray(startAddons) && startAddons.length ?
                                                                        (startAddons.map((addOn, key) => (
                                                                            (addOn.id == addon.id) ? (addOn.quantity || 0) : null)))
                                                                        :
                                                                        0
                                                                }
                                                            </button>
                                                            {/* updateStartAddons to update start ride addons
                                                            Pass 0 for subtracting one add-on and 
                                                            Pass 1 for adding one add-on
                                                        */}
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateStartAddons(1, addon)}>+</button>
                                                        </div>
                                                    </div>
                                                    {/* 
                                                            Display Addon Total Price
                                                        */}
                                                    <div className="col-sm-3">
                                                        Rs. {
                                                            // Array.isArray(startAddons) & startAddons.length ?
                                                            (startAddons.map((addOn, key) => (
                                                                (addOn.id == addon.id) ? (addOn.quantity * addon.fixed_cost || 0) : null)))
                                                            // :
                                                            // 0
                                                        }
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
                                                <div className="row" key={key}>
                                                    <div className="col-sm-6 no-padding-right">
                                                        {addon.name}
                                                    </div>
                                                    <div className="col-sm-3 no-padding-right no-padding-left">
                                                        <div className="btn-group">
                                                            {/* updateStartAddons to update start ride addons
                                                            Pass 0 for subtracting one add-on and 
                                                            Pass 1 for adding one add-on
                                                        */}
                                                            <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this.updateEndAddons(0, addon)}>-</button>
                                                            {/* 
                                                            Display Addon Quantity
                                                        */}
                                                            <button type="button" className="btn btn-default">
                                                                {
                                                                    Array.isArray(startAddons) && startAddons.length ?
                                                                        (endAddons.map((addOn, key) => (
                                                                            (addOn.id == addon.id) ? (addOn.quantity || 0) : null)))
                                                                        :
                                                                        0
                                                                }
                                                            </button>
                                                            {/* updateStartAddons to update start ride addons
                                                            Pass 0 for subtracting one add-on and 
                                                            Pass 1 for adding one add-on
                                                        */}
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateEndAddons(1, addon)}>+</button>
                                                        </div>
                                                    </div>
                                                    {/* 
                                                            Display Addon Total Price
                                                        */}
                                                    <div className="col-sm-3">
                                                        Rs. {
                                                            Array.isArray(endAddons) && endAddons.length ?
                                                                (endAddons.map((addOn, key) => (
                                                                    (addOn.id == addon.id) ? (addOn.quantity * addon.fixed_cost || 0) : null)))
                                                                :
                                                                0
                                                        }
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
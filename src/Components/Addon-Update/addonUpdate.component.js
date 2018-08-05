import React from 'react';
import './addonUpdate.component.css';
import { Get } from 'common-js-util';

let helmet=0;
let endhelmet=0;
let aux=0;
let endaux=0;
let seater=0;
let endseater=0;

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
            var url = 'accessoryAddon?query=active=1 and bike_only=1';
        } else {
            url = 'accessoryAddon?query=active=1 and bike_only=0';
        }
        const result = await Get({ url: url, urlPrefix: 'https://api.justride.in/api/admin/' });
        if (result.success) {
            this.setState({ addOns: result.response });
        }
        
    }

    updateStartAddons = (quantity, addOn) => {
        const { startAddons, rideData } = this.state;
        quantity ? startAddons.push(addOn) : startAddons.splice(0,1);
        if(quantity){
            if(addOn.id == 20){
                if(aux < 5){
                    aux++;
                    startAddons.aux = aux;
                }
            }
            else if(addOn.id == 23){
                if(seater < 5){
                    seater++;
                    startAddons.seater = seater;
                }
            }
            else if(addOn.id == 21){
                if(helmet < 5){
                    helmet++;
                    startAddons.helmet = helmet;
                }
            }
        }
        else{
            if(addOn.id == 20){
                if(aux > 0){
                    aux--;
                    startAddons.aux = aux;}
            }
            else if(addOn.id == 23){
                if(seater > 0){
                    seater--;
                    startAddons.seater = seater;
                }
            }
            else if(addOn.id == 21){
                if(helmet > 0){
                    helmet--;
                    startAddons.helmet = helmet;
                }
            }
        }
        this.setState({ startAddons });
        rideData.startAddons = startAddons;
        this.setState({ rideData });
    }

    updateEndAddons = (quantity, addOn) => {
        const { endAddons, startAddons, rideData } = this.state;
        quantity ? (endAddons.push(addOn)) : endAddons.splice(0,1);
        if(quantity)
            {
            if(addOn.id == 20){
                if(endAddons.aux >= startAddons.aux){
                    if(startAddons.aux < 5){
                        startAddons.aux = ++aux;
                        startAddons.push(addOn)
                    }
                }
            }
            else if(addOn.id == 23){
            if(endAddons.seater >= startAddons.seater){
                if(startAddons.seater < 5){
                    startAddons.seater = ++seater;
                    startAddons.push(addOn)
                    }
                }
            }
            else if(addOn.id == 21){
                if(endAddons.helmet >= startAddons.helmet){
                    if(startAddons.helmet < 5){
                        startAddons.helmet = ++helmet;
                        startAddons.push(addOn)
                        }
                    }
                }
        }
        if(quantity){
            if(addOn.id == 20){
                if(endaux < 5){
                    endaux++;
                    endAddons.aux = endaux;
                }
            }
            else if(addOn.id == 23){
                if(endseater < 5){
                    endseater++;
                    endAddons.seater = endseater;
                }
            }
            else if(addOn.id == 21){
                if(endhelmet < 5){
                    endhelmet++;
                    endAddons.helmet = endhelmet;
                }
            }
        }
        else{
            if(addOn.id == 20){
                if(endaux > 0){
                    endaux--;
                    endAddons.aux = endaux;
                }
            }
            else if(addOn.id == 23){
                if(endseater > 0){
                    endseater--;
                    endAddons.seater = endseater;
                }
            }
            else if(addOn.id == 21){
                if(endhelmet > 0){
                    endhelmet--;
                    endAddons.helmet = endhelmet;
                }
            }
        }
        this.setState({ endAddons });
        this.setState({ startAddons });
        rideData.endAddons = endAddons;
        this.setState({ rideData });
    }

    render() {
        const { rideStatus, addOns = [], startAddons, endAddons} = this.state;

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
                                <div className="row" key={key}>
                                    <div className="col-sm-6 no-padding-right">
                                        {addon.name}
                                    </div>
                                    <div className="col-sm-3 no-padding-right no-padding-left">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm btn-danger"  onClick={(e) => this.updateStartAddons(0, addon)}>-</button>
                                            <button type="button" className="btn btn-default">{(addon.id == 20 ? (startAddons.aux ? startAddons.aux : 0) : (addon.id == 23 ? (startAddons.seater ? startAddons.seater : 0) : (addon.id == 21 ? (startAddons.helmet ? startAddons.helmet : 0): 0)))}</button>
                                            <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateStartAddons(1, addon)}>+</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        Rs. {(addon.id == 20)? (addon.fixed_cost*startAddons.aux ? addon.fixed_cost*startAddons.aux : 0) : ((addon.id == 23) ? (addon.fixed_cost*startAddons.seater ? addon.fixed_cost*startAddons.seater : 0) : 0)}
                                    </div>
                                    <br />
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
                                <div className="row" key={key}>
                                    <div className="col-sm-6 no-padding-right">
                                        {addon.name}
                                    </div>
                                    <div className="col-sm-3 no-padding-right no-padding-left">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this.updateStartAddons(0, addon)}>-</button>
                                            <button type="button" className="btn btn-default">{(addon.id == 20 ? (startAddons.aux ? startAddons.aux : 0) : (addon.id == 23 ? (startAddons.seater ? startAddons.seater : 0) : (addon.id == 21 ? (startAddons.helmet ? startAddons.helmet : 0): 0)))}</button>
                                            <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateStartAddons(1, addon)}>+</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        Rs. {(addon.id == 20)? (addon.fixed_cost*startAddons.aux ? addon.fixed_cost*startAddons.aux : 0) : ((addon.id == 23) ? (addon.fixed_cost*startAddons.seater ? addon.fixed_cost*startAddons.seater : 0) : 0)}                                        
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
                                                <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this.updateEndAddons(0, addon)}>-</button>
                                                <button type="button" className="btn btn-default">{(addon.id == 20 ? (endAddons.aux ? endAddons.aux : 0) : (addon.id == 23 ? (endAddons.seater ? endAddons.seater : 0) : (addon.id == 21 ? (endAddons.helmet ? endAddons.helmet : 0): 0)))}</button>
                                                <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.updateEndAddons(1, addon)}>+</button>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            Rs. {(addon.id == 20)? (addon.fixed_cost*endAddons.aux ? addon.fixed_cost*endAddons.aux : 0) : ((addon.id == 23) ? (addon.fixed_cost*endAddons.seater ? addon.fixed_cost*endAddons.seater : 0) : 0)}
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
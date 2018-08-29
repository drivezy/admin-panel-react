import React, { Component } from 'react';

import {
    Card, CardBody, CardHeader
} from 'reactstrap';

import moment from 'moment';
import { debounce as Debounce } from 'lodash';

import './trackHistory.scene.css';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils';
import ReferenceInput from './../../Components/Forms/Components/Reference-Input/referenceInput';

import { Get, Post } from 'common-js-util';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';

import TrackHistoryComponent from './../../Components/Track-History/trackHistory.component';
import DatePicker from './../../Components/Forms/Components/Date-Picker/datePicker';
import { GetLookupValues } from './../../Utils/lookup.utils';

import SelectBox from  './../../Components/Forms/Components/Select-Box/selectBox';

export default class TrackHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            alerts: [],
            mapFlag: false,
            alarmNavOpened: false,
            alertPreference: false,
            filterForm: {
                 duration: 1, 
                 start_time: moment().subtract(3, "hours").format("YYYY-MM-DD HH:00:00") 
            },
            vehicles: []
        };
        this.debouncedAdvanceSearch = Debounce(this.advancedSearch, 300);
        
    }

    advancedSearch = async (val) => {
        let url = 'searchVehicle';
        let options = {
            search_string: val
        };

        const result = await Post({ url: 'vehicleLocation', body: options});
        if(result.success){
            this.setState({vehicles: result.response});
        }

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
        let urlParam =  Location.search();
        if(urlParam && urlParam.pnr){
            this.getTrackHistory();
            this.setState({mapFlag: true})
        }
    }

    getTrackHistory = async () => {
        let params = Location.search();
        let postDict = {};
        let isAllParam = false;
        if(params.pnr && params.pnr != 'undefined'){
            postDict.pnr = params.pnr;
            isAllParam = true;
        }else if(params.start_time && params.vehicle && params.duration){
            postDict.start_time = params.start_time;
            postDict.vehicle = params.vehicle;
            postDict.alerts = true;
            postDict.end_time = moment(new Date(moment(params.start_time,  "YYYY-MM-DD HH:mm:ss").add(60*params.duration, 'minutes'))).format("YYYY-MM-DD HH:mm:ss");
            isAllParam = true;
        }

        if(isAllParam){
            const result = await Post({ url: 'vehicleLocation', body: postDict, urlPrefix: 'https://uatapi.justride.in/api/admin/'});

            if (result.success && typeof result.response == "object" && result.response.hasOwnProperty("location") && result.response.location.length) {
                const data = result.response.location;
                const alerts = result.response.alerts;
                this.setState({ data, alerts });
            }else if (result.success) {
                const data = result.response;
                if(data.length){
                    console.log(data);
                    this.setState({ data });
                }else{
                    this.setState({mapFlag: false});
                    ToastNotifications.error({ title: 'No data returned from server.' });
                }
            }
        }else{
            ToastNotifications.error({ title: 'Required parameter missing.' })
        }
    }

   openAlarmNav = () => {
    //    this.setState({alarmNavOpened = true});
        document.getElementById("myAlarmSidenav").style.width = "350px";
    };

   closeAlarmNav = () => {
        // this.setState({alarmNavOpened = true});
        document.getElementById("myAlarmSidenav").style.width = "0px";
    };

   toggleAlarmNav = () => {
        if (this.state.alarmNavOpened) {
            this.closeAlarmNav();
        } else {
            this.openAlarmNav();
        }
    };

    openFilterNav = () => {
        //    this.setState({FilterNavOpened = true});
        document.getElementById("myFilterSidenav").style.width = "300px";
        document.getElementById("myFilterSidenav").style.display = "block";
    };
    
    closeFilterNav = () => {
        // this.setState({FilterNavOpened = true});
        document.getElementById("myFilterSidenav").style.width = "0px";
        document.getElementById("myFilterSidenav").style.display = "none";
    };

    toggleFilterNav = () => {
        if (this.state.FilterNavOpened) {
            this.closeFilterNav();
        } else {
            this.openFilterNav();
        }
    };

    goGetIt = () => {
        let {filterForm} = this.state;
        if (filterForm.pnr) {
            Location.search({pnr: filterForm.pnr})
        } else {
            Location.search({
                vehicle: filterForm.vehicle, start_time: filterForm.start_time, duration: filterForm.duration, pnr: filterForm.pnr
            });
        }
    }

    filterInputChange = (name, value) =>{
        console.log(value);
        let { filterForm } = this.state;
        filterForm[name] = value;
        this.setState({filterForm});
    }

    render() {
        const { data, mapFlag, alarms, filterForm, alertPreference, alerts, vehicles } = this.state;
        return (
            <div className="track-history">
                <div style={{padding: '10px', display: 'flex', justifyContent: 'space-between', fontSize:'18px', background: '#dcdcdc7a'}} className="static-header">
                    <div className="">
                        <i style={{marginRight: '5px'}} className="fa fa-map-marker"></i>Track History
                    </div>
                    <div className="" onClick={() => this.toggleAlarmNav()}>
                    <i style={{marginRight: '5px'}} className="fa fa-bars" aria-hidden="true"></i>Select alarms
                    </div>
                    <div className="">
                        <i className="fa fa-cog fa-lg" onClick={() => this.toggleFilterNav()}></i>
                    </div>
                </div>
                {
                    mapFlag ?
                    (<TrackHistoryComponent data={data} alarms={alarms} alerts={alerts} alertPreference={alertPreference} />):
                    (
                        <div style={{padding: '50px 20px 20px', textAlign: 'center', background: 'white'}}>
                            <p>This Report shows the Tracking History of the vehicle</p>
                            <p>In order to see the Tracking History, either enter PNR of the booking or input duration and vehicle.</p>
                        </div>
                    )
                }

                { alarms && alarms.length &&
                    <div id="myAlarmSidenav" className="myAlarmSidenav">
                        <div className="alarm-heading">
                            <span className="" onClick={() =>this.closeAlarmNav()}>&#9776; Select Alarms</span>
                        </div>
                        <div className="alarm-data">
                                Alarms to show
                                {
                                    alarms.map((item,key) => 
                                        
                                            (<div key={key} className="individual-alarm">
                                                <input className="styled-checkbox" id={"styled-checkbox-"+key} type="checkbox" onClick={() => {item.active = !item.active; this.setState({item})}} checked={item.active}/>
                                                <label className="name" htmlFor={"styled-checkbox-"+key}>{item.name}</label>
                                            </div>)
                                    )
                                }
                        </div>
                    </div>
                }

                {
                    <div id="myFilterSidenav" className="myFilterSidenav" >
                        <div className="filter-header" >
                            <span>Filter</span>
                            <i className="fa fa-close" onClick={()=>{this.closeFilterNav()}}></i>
                        </div>

                        <div className="form-group">
                            <label >
                                PNR
                            </label>
                            <input type="text" placeholder="Enter PNR" value={filterForm.pnr} onChange={(e)=>this.filterInputChange('pnr', e.target.value)}  className="form-control" />
                        </div>
                        <div className="mid-line">
                            <span></span>
                            OR
                            <span></span>
                        </div>
                        <div className="form-group">
                            <label >
                                Vehicle
                            </label>
                            {/* <SelectBox
                                name={this.props.name}
                                onChange={(value, event) => {console.log(value); console.log(event)}}
                                field="registration_number"
                                queryField={vehicles}
                                value={filterForm.vehicle}
                            /> */}
                            <input type="text" placeholder="Enter vehicle " value={filterForm.vehicle} onChange={(e)=>this.filterInputChange('vehicle', e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label >
                                From
                            </label>
                            <DatePicker single={true} placeholder="From" format="YYYY-MM-DD HH:mm:ss" timePicker={true} value={filterForm.start_time} onChange={(name, value)=> this.filterInputChange('start_time', value)} />
                        </div>
                        <div className="form-group">
                            <label >
                                Duration
                            </label>
                            <input type="text" placeholder="Enter Duration" value={filterForm.duration} onChange={(e)=>this.filterInputChange('duration', e.target.value)} className="form-control" />
                        </div>
                        
                            <button type="submit" className="btn btn btn-success track-btn" onClick={() => this.goGetIt()}>
                                Track History
                            </button>
        
                    </div>
                }

            </div>
        )
    }
}
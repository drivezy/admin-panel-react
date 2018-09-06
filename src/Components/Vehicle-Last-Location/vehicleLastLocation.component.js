import React, { Component } from 'react';
import moment from "moment";

var google = window.google;
export default class VehicleLastLocation extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps && nextProps.data && nextProps.data.tracker_time){
            this.setState({tracker_time: moment(nextProps.data.tracker_time).format("DD MMM YYYY hh:mm:ss")});
        }

        this.createMap(parseFloat(nextProps.data.latitude), parseFloat(nextProps.data.longitude))
    }


    createMap = (lat, long) => {
        var elem = document.getElementById("map-dir");
        var mapOptions = {
            center: new google.maps.LatLng(lat, long),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false
        };
        var map = new google.maps.Map(elem, mapOptions);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long), map: map
        });
    }

    render() {
        const {tracker_time} = this.state;
        return (
            <div style={{padding: '5px'}} className="vehicle-last-location"> 
                {
                    tracker_time && tracker_time != 'Invalid date' ?
                    (<div style={{position: 'absolute',background: 'rgba(0,0,0,.6)',color: 'white',zIndex: '10',padding: '15px 5px', borderRadius:'4px', fontSize: '18px'}} className="tracker-time">
                        <i style={{color: 'red', paddingRight: '5px'}} className="fa fa-car"></i> {tracker_time}
                    </div>) : null
                }
                <div id="map-dir" style={{width: '100%', height:'500px'}} className="map-dir" ></div>
            </div>
        )
    }
}

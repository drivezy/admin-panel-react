import React, { Component } from "react";

import moment from 'moment';

import { StoreEvent, SubscribeToEvent } from 'state-manager-utility';

import { SelectFromOptions, BuildUrlForGetCall, IsUndefinedOrNull, IsUndefined } from './../../Utils/common.utils';

var trackMarker, trackPos, markerArr, obj, prev_infowindow, trackWindow, flightPath, vehicleList, flightPath1, lineCoordinatesArray, infoWindow, map, google;
var polylineArr = [];
var google = window.google;

/** 
 * Component for map
 * map used in tracking history page and vehicle track modal at booking detail page
 * 
 */
class TrackMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    SubscribeToEvent({ eventName: 'trackHistoryObj', callback: this.trackHistory });
    SubscribeToEvent({ eventName: 'alertPreferenceChanged', callback: this.alertPreferenceChanged });
  }

  componentDidMount(){
    lineCoordinatesArray = [];
    markerArr = [];
    infoWindow = [];
    // flightPath = [];
    vehicleList = [];
    polylineArr = [];
    // flightPath1 = [];
    obj = {};
    setTimeout(() => {
        this.initialize(this.props.data.length ? this.props.data[0] : {});
        this.redMarker(this.props.data[0].latitude, this.props.data[0].longitude, 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png');
    }, 1000);
  }

  initialize = (item) => {

        trackMarker = null;
        polylineArr = [];
        trackPos = null;
        flightPath1 = null;
        var elem = document.getElementById("map-dir");
        var origin = {
            lat: Math.abs(item.latitude), long: Math.abs(item.longitude)
        };
        var zoom = item.zoom ? item.zoom : 15;

        var mapOptions = {
            center: new google.maps.LatLng(origin.lat, origin.long),
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false
        };
        map = new google.maps.Map(elem, mapOptions);
  }

redMarker = (lat, long, img) => {
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(Math.abs(lat), Math.abs(long)),
        animation: google.maps.Animation.DROP,
        map: map
    });
    img ? marker.setIcon(img) : "";
    return marker;
}

trackHistory = (item) => {
    this.clearPolyline();
    trackWindow = null;
    var trackWindowFlag = item.history.length-1;
    let temp = item.history[item.history.length-1];
    if(temp){
        var origin = {
            lat: Math.abs(temp.latitude), long: Math.abs(temp.longitude)
        };
        trackPos = new google.maps.LatLng(origin.lat, origin.long);
        var setDetails = function () {
            var contentForToolTip = "<b><em>" + temp.time + " <br>" + temp.speed + " Kmph </em></b>";
            trackWindow.setContent(contentForToolTip);
        };

        item.history.length == 0 ? this.redMarker(origin.lat, origin.long) : "";

        this.infoWindowInitialization(trackMarker);
        setTimeout(() => {
            this.drawPolyline(item.history);
            if (!IsUndefinedOrNull(trackMarker)) {
                trackMarker.setPosition(null);
                trackMarker.setPosition(trackPos);
                map.panTo(trackPos);
            } else {
                trackMarker = new google.maps.Marker({
                    position: trackPos, map: map
                });
                trackMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
                trackMarker.setPosition(trackPos);

            }
            try {
                IsUndefinedOrNull(trackWindow);
            } catch (err) {
                this.infoWindowInitialization(trackMarker);
            }
            setDetails();
        }, 1000);
    }
};


/**
 * draws polyline for the given coordinates
 * @param  {array} polyline
 */
drawPolyline = (polyline) => {
    polyline.map((item) => {
        polylineArr.push({lat: parseFloat(item.latitude), lng: parseFloat(item.longitude)});
    })
    if (polylineArr.length) {
        flightPath = new google.maps.Polyline({
            path: polylineArr,
            strokeColor: "#315c6b",
            strokeOpacity: 0.7,
            strokeWeight: 4,
            fillColor: "#315c6b",
            fillOpacity: 0.5
        });
        flightPath.setMap(map);
    }
};

clearPolyline = () => {
    if (!IsUndefinedOrNull(flightPath)) {
        flightPath.setMap(null);
        flightPath = null;
    }
};

infoWindowInitialization = (trackMarker) => {
    trackWindow = new google.maps.InfoWindow({});
    trackWindow.open(map, trackMarker);
}


/**
 * Removes the markers from the map, but keeps them in the array.
 * @param {object} map - map object
 * @param {array} markers - list of markers to be removed
 */
setMapOnAll = (map, markers) => {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
};


clearMarkers = () => {
    this.setMapOnAll(null, markerArr);
}

/**
 * Deletes all markers in the array by removing references to them.
 */
deleteMarkers = () => {
    this.clearMarkers();
    markerArr = [];
};

alertPreferenceChanged = (values) => {
    setTimeout(() => {
        if(values.alertPreference){
            this.showTrackerAlerts(values.alerts, values.alarms);
        }else{
            this.deleteMarkers();
        }
    }, 1000);
}

/**
 * Deletes all markers in the array by removing references to them.
 */
deleteMarkers = () => {
    this.clearMarkers();
    markerArr = [];
};

/**
 * takes array of alerts, iterates over it and shows all the tracker marker
 * @param {array} alert - array of alerts object
 */
showTrackerAlerts = (alerts, lookups) => {
    if (!Array.isArray(alerts))
        return false;

    if (lookups) {
        for (var i in alerts) {
            var alert = alerts[i];
            this.trackerAlert(alert, lookups, i);
        }
        return true;
    }
};

/**
 * takes individual lat, long and shows individual tracker marker
 * @param {object} alert - individual alert object from the alerts array
 * @param {array} lookups - lookup value of lookupType 42
 * @param {int} i - current index of alerts array
 */
trackerAlert = (alert, lookups, i) => {
    var alertInfoWindow, marker;

    var alertDetail = SelectFromOptions(lookups, alert.alarm, "value");

    if (alertDetail.hasOwnProperty("active") && !alertDetail.active && parseInt(alertDetail.value) == parseInt(alert.alarm))
        return false;

    var content = "<b><em>" + alertDetail.name + " <br>" + alert.time + "</em></b> <br>";

    content += parseInt(alert.threshold_value) ? "<b><em>" + alert.current_value + " out of " + alert.threshold_value + " </em></b>" : "";

    content += parseInt(alert.type) ? " <br><b><em>  Activated  </em></b>" : " <br> <b><em>  Deactivated  </em></b>";

    alertInfoWindow = new google.maps.InfoWindow({
        content: content
    });
    marker = this.redMarker(alert.geocode.latitude, alert.geocode.longitude, 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png');

    google.maps.event.addListener(marker, "click", function () {
        return function () {
            if (prev_infowindow) {
                prev_infowindow.close();
            }

            prev_infowindow = alertInfoWindow;
            alertInfoWindow.open(map, marker);
        };
    }());

    markerArr.push(marker);
}


  render() {
    return (
        <div id="map-dir" style={{width: '100%', height:'270px'}} className="map-dir" ></div>
    );
  }
}

export default TrackMap;

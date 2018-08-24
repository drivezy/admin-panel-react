import React, { Component } from "react";

import moment from 'moment';

import { StoreEvent, SubscribeToEvent } from 'state-manager-utility';

import { SelectFromOptions, BuildUrlForGetCall, IsUndefinedOrNull, IsUndefined } from './../../Utils/common.utils';

var trackMarker, trackPos, markerArr, obj, trackWindow, flightPath, vehicleList, flightPath1, lineCoordinatesArray, infoWindow, map, google;
var polylineArr = [];
var google = window.google;
class TrackMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    SubscribeToEvent({ eventName: 'trackHistoryObj', callback: this.trackHistory });
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
    //  map = new google.maps.Map(document.getElementById('map-dir'), {
    //     zoom: 3,
    //     center: {lat: 0, lng: -180},
    //     mapTypeId: 'terrain'
    //   });

    //   var flightPlanCoordinates = [
    //     {lat: 37.772, lng: -122.214},
    //     {lat: 21.291, lng: -157.821},
    //     {lat: -18.142, lng: 178.431},
    //     {lat: -27.467, lng: 153.027}
    //   ];
    //   var flightPath = new google.maps.Polyline({
    //     path: flightPlanCoordinates,
    //     geodesic: true,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    //   });

    //   flightPath.setMap(map);
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

//To bind pusher method to get tracker data
pusherSettings = (channelObj, totalChannel, callback) => {
    // socketObj.channel = channelObj.channel_name;
    // socket.emit("channel_connect", socketObj);
    // socket.on("geo", handleGeoData);


    // channelObj.identifier = channelObj.registration_number;
    // var chanelName = channelObj.channel_name;
    // channelObj.speed = 0;

    // setDetails(channelObj, totalChannel);
   
    // var i = 1;
    // var previous = 0;
    // var total = 1;

    // function handleGeoData(data) {
    //     var d = new Date();
    //     var n = d.getTime();
    //     data.identifier = data.vehicle;
    //     obj.track(data, i, totalChannel);
    //     ++i;
    //     return data;
    // }

    // function handleAlarmTrigger(data) {
    //     console.log(data);
    //     var iconUrl = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
    //     redMarker(data.latitude, data.longitude, iconUrl);
    //     trackPos = new google.maps.LatLng(origin.lat, origin.long);
    //     var alarmMarker = new google.maps.Marker({
    //         position: trackPos, map: self.map
    //     });
    //     trackMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
    //     trackMarker.setPosition(trackPos);
    // }
};


//For setting green marker in the map that continues to change its position 
setMarker = (obj1, totalChannel) => {
    let lat = Math.abs(obj1.latitude);
    let long = Math.abs(obj1.longitude);
    let identifier = obj1.identifier;
    let obj = obj1;
    let pos = new google.maps.LatLng(lat, long);
    if (!IsUndefinedOrNull(markerArr[identifier])) {
        markerArr[identifier].setPosition(null);
        markerArr[identifier].setPosition(pos);
        markerArr[identifier].setIcon("//maps.google.com/mapfiles/ms/icons/green-dot.png");
        // self.map.panTo(pos);
    } else {
        markerArr[identifier] = new google.maps.Marker({
            position: pos, map: map
        });
        markerArr[identifier].setPosition(pos);
        //self.map.panTo(pos);

        // on hover shows info
        google.maps.event.addListener(markerArr[identifier], "mouseover", function (event) {
            infoWindow[identifier] = new google.maps.InfoWindow({});
            infoWindow[identifier].open(map, markerArr[identifier]);
            this.setContent(obj, infoWindow[identifier], totalChannel);
        });

        google.maps.event.addListener(markerArr[identifier], "mouseout", function (event) {
            infoWindow[identifier].close();
        });
    }
    if (infoWindow[identifier]) {
        this.setContent(obj, infoWindow[identifier], totalChannel);
    }
};

//Info window initialization for track vehicle mehtod
setContent = (obj, infoWindow1, totalChannel)=>{

    if (obj.hasOwnProperty("tracker_time")) {
        var reg = /\d{4}-\d{2}-\d{2}/g; // Checks for date
        var date = obj.tracker_time.match(reg);
        date = date ? obj.tracker_time : moment(parseInt(obj.tracker_time)).format("YYYY-MM-DD HH:mm:ss");
    }

    var contentForToolTip = totalChannel == 1 ? "<b><em>" + obj.registration_number + " <br />" + date + " <br/ >" + parseFloat(obj.speed).toFixed(2) + " Kmph </em></b>" : "<b>" + obj.registration_number + " <br />" + (parseFloat(obj.speed) || 0).toFixed(2) + " Kmph";
    infoWindow1.setContent(contentForToolTip);
}

//get timeout to unsubscribe channel
getTimeout = (channelName) => {
    // var url = "openProperty/32";
    // return ListingFactory.getListing(url);
}

unsubscribeChannel = (channelName) => {
    // pusher.unsubscribe(channelName);
    // this.initialization();
    this.clearMarkers();
    map = null;
};


trackHistory = (item) => {
    if(item.history.length>1){
        this.clearPolyline();
        this.drawPolyline(item.history);
        this.redMarker(item.history[item.history.length-1].latitude, item.history[item.history.length-1].longitude, "http://maps.google.com/mapfiles/ms/icons/green-dot.png");
    }
}


// trackHistory = (item,) => {
//     var trackWindowFlag = counter + 1;
//     var origin = {
//         lat: Math.abs(item.latitude), long: Math.abs(item.longitude)
//     };
//     trackPos = new google.maps.LatLng(origin.lat, origin.long);
//     var setDetails = function () {
//         var contentForToolTip = "<b><em>" + item.time + " <br>" + item.speed + " Kmph </em></b>";
//         trackWindow.setContent(contentForToolTip);
//     };

//     counter == 0 ? this.redMarker(origin.lat, origin.long) : "";
//     polylineArr.push(new google.maps.LatLng(origin.lat, origin.long));

//     this.drawPolyline(polylineArr);

//     if (IsUndefinedOrNull(trackMarker)) {
//         trackMarker.setPosition(null);
//         trackMarker.setPosition(trackPos);
//         map.panTo(trackPos);
//     } else {
//         trackMarker = new google.maps.Marker({
//             position: trackPos, map: map
//         });
//         trackMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
//         trackMarker.setPosition(trackPos);

//     }
//     try {
//         IsUndefinedOrNull(trackWindow);
//     } catch (err) {
//         this.infoWindowInitialization(trackMarker);
//     }
//     setDetails();
// };


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
        // flightPath = null;
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


  

  render() {
    return (
        <div id="map-dir" style={{width: '100%', height:'300px'}} className="map-dir" ></div>
    );
  }
}

export default TrackMap;

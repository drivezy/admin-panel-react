import React, { Component } from 'react';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Get, Post } from 'common-js-util';
import moment from 'moment';
import ReactDOM from 'react-dom';

import { API_HOST } from './../../Constants/global.constants';

var vehiclesOfCar = [];
var rowHeight = 50;
var leftColumnWidth = 150;
var svgWidth;
export default class CarAvailability extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leftColumn: [],
            vehicleRects: [],
            slotRectHeight: 30,
            marginLine: []
        }
        this.draw = this.draw.bind(this);
        this.makeRectangle = this.makeRectangle.bind(this);
    }

    componentDidMount() {
        this.initialise();
    }

    initialise = async () => {
        vehiclesOfCar = await this.getCarTimeline();
        this.remodelData();
        this.draw();
    }

    remodelData = () => {

    }

    getCarTimeline = async () => {
        const carParamsObj = Location.search();
        console.log(carParamsObj);
        const endDate = this.getEndDate(carParamsObj.from, carParamsObj.duration);
        const params = {
            cars: carParamsObj.car,
            end_time: endDate,
            start_time: carParamsObj.from
        }
        const carTimeline = await Post({ url: 'timeline', body: params, urlPrefix: API_HOST })
        if (carTimeline.success) {
            return carTimeline.response;
        }
    }

    getEndDate = (from, duration) => {
        let date = new Date(from);
        let endDate = moment(date).add(duration, 'hours').toDate();
        let momentObj = moment(endDate);
        let endDateString = momentObj.format('YYYY-MM-DD HH:mm');
        return endDateString;
    }

    formatDate = (date) => {
        let forDat = new Date(date);
        return forDat;
    }

    checkHourDiff = (dateTime1, dateTime2) => {
        // let date1_hrs = dateTime1.getHours();
        // let date1_days = dateTime1.getDay();
        // let date2_days = dateTime2.getDay();
        // let date1_mins = dateTime1.getMinutes();
        // let date2_mins = dateTime2.getMinutes();
        // let date2_hrs = dateTime2.getHours();
        // let minDiff = Math.abs(date2_mins - date1_mins);
        // let dayDiff = Math.abs(date2_days - date1_days);
        // dayDiff = dayDiff * 24;
        // minDiff = minDiff / 60;
        let dur = moment.duration(dateTime2.diff(dateTime1));
        let hours = dur.asHours();
        return Math.abs(hours);
    }

    makeRectangle = (startTime, endTime, attributes) => {
        let { slotRectHeight } = this.state;
        let params = Location.search();
        let timeWidth = (svgWidth - leftColumnWidth) / params.duration;
        startTime = this.formatDate(startTime);
        endTime = this.formatDate(endTime);
        if (this.formatDate(params.from) > startTime) {
            startTime = this.formatDate(params.from);
        }
        if (endTime > this.formatDate(this.getEndDate(params.from, params.duration))) {
            endTime = this.formatDate(this.getEndDate(params.from, params.duration));
        }
        let xCord;
        if (this.formatDate(params.from) <= startTime) {
            xCord = leftColumnWidth + this.checkHourDiff(moment(this.formatDate(params.from)), moment(startTime)) * timeWidth;
        }
        else {
            xCord = leftColumnWidth;
        }
        let bookingDurationHours = this.checkHourDiff(moment(startTime), moment(endTime));
        let tempRect = {
            'x': xCord,
            'y': (parseInt(attributes.rowElementNumber) + parseInt(attributes.totLength)) * rowHeight + ((rowHeight - slotRectHeight) / 2),
            'width': timeWidth * (bookingDurationHours),
            'height': slotRectHeight,
            'style': { "fill": attributes.color },
            'text': attributes.text,
            'textStyle': { "fontSize": "14px", "fill": attributes.textColor }
        }
        return tempRect;
    }

    draw = () => {
        let { leftColumn, vehicleRects, marginLine } = this.state;

        const svg = ReactDOM.findDOMNode(this.refs.mySvg);
        let params = Location.search();
        svgWidth = window.innerWidth - 0.2 * window.innerWidth;
        let timeWidth = (svgWidth - leftColumnWidth) / params.duration;
        let svgHeight = window.innerHeight;
        let interval = 12;
        let k = params.duration;
        while (k >= 0) {

            let tempLine = {
                'x1': leftColumnWidth + k * timeWidth,
                'x2': leftColumnWidth + k * timeWidth,
                'y1': 0,
                'y2': svgHeight - 50,
                'style': { "stroke": "#a2b2bc", "strokeWidth": 1 }
            }
            marginLine.push(tempLine);
            k = k - (params.duration / interval);
        }
        let totLength = 0;
        for (let m in vehiclesOfCar) {
            for (let i in vehiclesOfCar[m].vehicle) {
                let tempLeftColumn = {
                    'x': 0,
                    'y': (totLength + parseInt(i)) * rowHeight,
                    'width': leftColumnWidth,
                    'height': rowHeight,
                    'style': { "fill": "#dde7ed", "stroke": "#a2b2bc", "strokeWidth": 2 },
                    'text': vehiclesOfCar[m].vehicle[i].vehicle.registration_number + " " + vehiclesOfCar[m].car.name.split(" ")[1],
                    'styleBody': { "fill": "white", "stroke": "#a2b2bc", "strokeWidth": 2 }
                }
                leftColumn.push(tempLeftColumn);
                if (vehiclesOfCar[m].vehicle[i].availability.length == 0) {
                    const attributes = {
                        text: "Available",
                        color: "green",
                        textColor: "white",
                        rowElementNumber: i,
                        totLength: totLength
                    }
                    let tempRectObj = this.makeRectangle(params.from, this.getEndDate(params.from, params.duration), attributes);
                    vehicleRects.push(tempRectObj);
                }
                for (let j in vehiclesOfCar[m].vehicle[i].availability) {
                    let availabilityObj = vehiclesOfCar[m].vehicle[i].availability[j];
                    if (availabilityObj.booking != null) {
                        const attributes = {
                            text: "Booked",
                            color: "yellow",
                            textColor: "black",
                            rowElementNumber: i,
                            totLength: totLength
                        }
                        let tempRectObj = this.makeRectangle(availabilityObj.booking.pickup_time, availabilityObj.booking.drop_time, attributes);
                        vehicleRects.push(tempRectObj);
                    }
                    if (availabilityObj.maintenance != null) {
                        const attributes = {
                            text: "Blocked",
                            color: "red",
                            textColor: "white",
                            rowElementNumber: i,
                            totLength: totLength
                        }
                        let tempRectObj = this.makeRectangle(availabilityObj.maintenance.start_time, availabilityObj.maintenance.end_time, attributes);
                        vehicleRects.push(tempRectObj);
                    }

                }
            }
            totLength = totLength + vehiclesOfCar[m].vehicle.length;

        }
        svgHeight = totLength * rowHeight + 50;
        console.log(svgWidth);
        this.setState({ svgHeight, leftColumn, vehicleRects, svgWidth, marginLine });

    }

    render() {
        const { leftColumn, svgHeight, vehicleRects, svgWidth, slotRectHeight, marginLine } = this.state;
        return (
            <div className="car-availability">
                <div className="svgTimeline">
                    <div>
                        <svg ref="mySvg" width={svgWidth} height={svgHeight}>

                            {
                                leftColumn.map((vehicle, key) =>
                                    <g key={key}>
                                        <rect x={vehicle.x} y={vehicle.y} width={vehicle.width} height={vehicle.height} style={vehicle.style} />
                                        <text x={vehicle.x + vehicle.width - 10} y={vehicle.y + vehicle.height / 2 + 3.5} textAnchor="end"> {vehicle.text}</text>
                                        <rect x={vehicle.x + vehicle.width} y={vehicle.y} width={svgWidth - leftColumnWidth} height={vehicle.height} style={vehicle.styleBody}></rect>
                                    </g>
                                )
                            }
                            {
                                vehicleRects.map((rect, key) =>
                                    <g key={key}>
                                        <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} />
                                        <text x={rect.x + 10} y={rect.y + slotRectHeight / 2 + 3.5} textAnchor="start" style={rect.textStyle}> {rect.text}</text>
                                    </g>
                                )
                            }
                            {
                                marginLine.map((margin, key) =>
                                    <g key={key}>
                                        <line x1={margin.x1} x2={margin.x2} y1={margin.y1} y2={margin.y2} style={margin.style} />
                                    </g>
                                )
                            }
                        </svg>
                    </div>
                    {/* <div>
                        <div class="list-group">
                            <li class="list-group-item" style="color:green" >
                                <span class="badge">
                                    {availableCount}
                                </span>
                                Available
                        </li>
                            <li class="list-group-item" style="color:brown" >
                                <span class="badge">
                                    {bookedCount}
                                </span>
                                Booked
                        </li>
                            <li class="list-group-item" style="color:red" >
                                <span class="badge">
                                    {blockedCount}
                                </span>
                                Blocked
                        </li>
                            <li class="list-group-item" ng-repeat="car in carAvailability.carCount|orderBy:'car.name' track by $index">
                                <span class="badge">{count}</span>
                                {car.car.name}

                            </li>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}
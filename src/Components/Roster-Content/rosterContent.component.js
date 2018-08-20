import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class RosterContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rosterData: props.rosterData,
            svgFlag: true,
            leftColumn: [],
            marginLine: [],
            pickupDrops: [],
            shiftRects: [],
            shiftNumberRect: [],
            columnText: [],
            shiftTexts: [],
            leftButtons: [],
            overFlowShifts: [],
            shiftOverflowText: [],
            partitionRect: [],
            multiColor: [],
            manualPunch: [],
            customAddButtons: [],
            origin: props.origin,
            leftColumnWidth: 60,
            pickupDropFlag: false,
            hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            selfTimewidth: 1,
            selfIndex: 0
        }
    }

    componentDidMount() {
        this.draw();

        // parent = document.getElementById('parent');

    }
    formatDate = (date) => {
        let forDat = new Date(date);
        return forDat;
    }

    checkHourDiff = (dateTime1, dateTime2) => {
        let date1_hrs = dateTime1.getHours();
        let date1_mins = dateTime1.getMinutes();
        let date2_mins = dateTime2.getMinutes();
        let date2_hrs = dateTime2.getHours();
        let minDiff = Math.abs(date2_mins - date1_mins);
        minDiff = minDiff / 60;
        return Math.abs(date2_hrs - date1_hrs + minDiff);
    }
    daysBetween = (date1, date2) => {
        //Get 1 day in milliseconds
        let one_day = 1000 * 60 * 60 * 24;
        let dateFormatted1 = this.formatDate(date1);
        let dateFormatted2 = this.formatDate(date2);
        // Convert both dates to milliseconds
        let date1_ms = dateFormatted1.getTime();
        let date2_ms = dateFormatted2.getTime();

        // Calculate the difference in milliseconds
        let difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);

    }

    filterArray = (rosterData) => {
        let currDate = new Date();
        let rosterTemp = rosterData.roster_fleet_details;
        for (let i in rosterTemp) {

            for (let j = 0; j < rosterTemp[i].assignments.length; j++) {
                let iterDate = this.formatDate(rosterTemp[i].assignments[j].shift_details.end_time);
                if (rosterTemp[i].assignments[j].fleet_details == null && iterDate <= currDate) {
                    rosterTemp[i].assignments.splice(j, 1);
                    j = j - 1;
                }
            }

        }
        return rosterTemp

    }
    decorateDailyView = (rosterData) => {
        var rosterTemp = rosterData;
        var shift_details = [];
        var temp = _.groupBy(rosterTemp, ["venue_id"])
        // var temp = $filter("groupBy")(rosterTemp, "venue_id");
        for (var i in temp) {
            shift_details.push({
                'shift_details': temp[i]
            })
        }
        return this.assignAssignmentsDailyView(temp);
    }
    assignAssignmentsDailyView = (temp) => {
        var retObj = [];
        for (var i in temp) {
            retObj.push({
                'assignments': temp[i],
                'date': temp[i][0].shift_date
            });
        }
        return retObj;
    }
    decorate = (rosterData) => {
        var retObj = {};
        var roster_fleet_details = [];
        rosterData.forEach(function (element, key) {
            var assignments = [];
            assignments.push({ 'shift_details': key });
            roster_fleet_details.push({ 'assignments': assignments, 'date': key.shift_date });
            if (this.formatDate(key.start_time).getDate() != this.formatDate(key.end_time).getDate()) {
                roster_fleet_details.push({ 'assignments': [], 'date': String(this.formatDate(key.end_time)).substring(4, 15) });
            }
        })
        return (roster_fleet_details);
    }
    filterDailyArray = (rosterTemp) => {
        let currDate = new Date();
        for (let i in rosterTemp) {

            for (let j = 0; j < rosterTemp[i].assignments.length; j++) {
                let iterDate = this.formatDate(rosterTemp[i].assignments[j].end_time);
                if (rosterTemp[i].assignments[j].station_manager == null && iterDate <= currDate) {
                    rosterTemp[i].assignments.splice(j, 1);
                    j = j - 1;
                }
            }

        }
        return rosterTemp
    }

    pickupDropSelect = (value, index) => {
        let { origin, pickupDrops, pickupDropFlag, selfIndex } = this.state;
        if (origin != "fleetView" && origin != "dailyView") {
            pickupDropFlag = value;
            selfIndex = index;
            let visib
            if (value) {
                visib = "visible";

            }
            else {
                visib = "hidden";

            }
            for (let i = index * 24; i < (index * 24 + 24); i++) {
                pickupDrops[i].style = { "fill": "#dde7ed", "stroke": "#a2b2bc", "strokeWidth": 1, "visibility": visib };
                pickupDrops[i].pickupstyle = { "fill": "#41b6ac", "fontSize": "14px", "visibility": visib };
                pickupDrops[i].dropstyle = { "fill": " #797979", "fontSize": "14px", "visibility": visib };
            }
            this.setState({ pickupDrops, pickupDropFlag, selfIndex });
        }
    }
    shiftHover = (value, rect) => {
        let visib;
        let { origin, selfIndex, marginLine } = this.state;
        if (value) {
            visib = "visible";
        }
        else {
            visib = "hidden";
        }
        let startHour, endHour;
        let data = rect.data;
        if (origin == "dailyView") {
            startHour = this.formatDate(data.start_time).getHours();
            endHour = this.formatDate(data.end_time).getHours();
        } else {
            startHour = this.formatDate(data.shift_details.start_time).getHours();
            endHour = this.formatDate(data.shift_details.end_time).getHours();
        }
        marginLine[startHour].style = { "stroke": rect.color, "visibility": visib };
        marginLine[endHour].style = { "stroke": rect.color, "visibility": visib };
        if (origin != "fleetView" && origin != "dailyView") {
            this.pickupDropSelect(value, selfIndex);
        }
        this.setState(marginLine);
    }
    draw = () => {
        const { rosterData, origin } = this.state;
        let { leftColumn, marginLine, pickupDrops, shiftRects, shiftNumberRect, columnText, shiftTexts, leftButtons, overFlowShifts, shiftOverflowText, partitionRect, multiColor, manualPunch, customAddButtons, selfTimewidth, leftColumnWidth, hours, pickupDropFlag, selfIndex } = this.state;

        pickupDropFlag = false;
        const svg = ReactDOM.findDOMNode(this.refs.mySvg);
        let rowHeight = 5;
        leftColumnWidth = 60;
        let pickupDropHeight = 20;
        hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        let startMarginTop = 11;
        let selfWidth = svg.width.animVal.value;
        let shiftSeperatorMargin = 10;
        let shiftRectHeight = 42;
        let emptyBoxHeight = 107;
        let bottomRowBlockMargin = 12;
        let totalRowBlockHeight = 0;
        let leftColumnTextLeftMargin = 20;
        let buttonHeight = 25;
        let buttonMargin = 38;
        let shiftNumberBoxWidth = 40;

        let svgFlag = true;
        let overFlowFlag = false;
        let svgWidth;

        let buttons = [{
            'id': 0,
            'text': "\uf067",
            'color': "#5fb760",
            'fontColor': "white",
            'hoverText': "Single/Batch Assign"
        },
        {
            'id': 1,
            'text': "\uf014",
            'color': "#F15D61",
            'fontColor': "white",
            'hoverText': "Single/Batch Delete"

        },
        ];
        let customAddButton = [{
            'id': 2,
            'text': "\uf234",
            'color': "#5fb760",
            'fontColor': "white",
            'hoverText': "Custom Assign"
        }];
        let timeWidth = (selfWidth - leftColumnWidth) / 24;
        let selfMargin = svg.getBoundingClientRect().x;
        selfWidth = svg.width.animVal.value;
        let selfHeight = 5 * window.innerHeight;
        let tempHeight = selfHeight;




        // Draw 

        let bookingObj = rosterData.roster_booking_details;
        let rosterTemp;
        if (origin == "fleetView") {
            rosterTemp = this.decorate(rosterData);
        }
        else if (origin == "dailyView") {
            rosterTemp = this.decorateDailyView(rosterData);
            rosterTemp = this.filterDailyArray(rosterTemp);
        }
        else {
            //  rosterTemp = angular.copy(shiftDetails.roster_fleet_details);
            //  rosterTemp = shiftDetails.filter(function (shift) {

            // })
            rosterTemp = this.filterArray(rosterData);
        }

        let totalRowBlocks = rosterTemp.length;
        let timeIntervalWidth = (selfWidth - leftColumnWidth) / 24;
        selfTimewidth = timeIntervalWidth;
        let overFlowCount = 0;
        for (let i in rosterTemp) {
            let rowBlockHeight;
            let ShiftRectYStart = pickupDropHeight + startMarginTop + totalRowBlockHeight;
            let totalRowShifts = rosterTemp[i].assignments.length;
            let startRowPos = ShiftRectYStart - pickupDropHeight - startMarginTop;
            if (overFlowFlag) {
                overFlowFlag = false;
                totalRowShifts = totalRowShifts + overFlowCount;
                ShiftRectYStart = ShiftRectYStart + (overFlowCount * (shiftRectHeight + shiftSeperatorMargin));
            }

            if (totalRowShifts < 2) {
                rowBlockHeight = emptyBoxHeight + pickupDropHeight + startMarginTop;
            }
            else {
                rowBlockHeight = pickupDropHeight + startMarginTop + (shiftSeperatorMargin * (totalRowShifts - 1)) + (shiftRectHeight * totalRowShifts) + bottomRowBlockMargin;
            }
            totalRowBlockHeight = totalRowBlockHeight + rowBlockHeight;
            let tempLeftColumn = {
                'x': 0,
                'y': startRowPos,
                'width': leftColumnWidth,
                'height': rowBlockHeight,
                'style': { "fill": "#dde7ed", "stroke": "#a2b2bc", "strokeWidth": 2 }
            }
            leftColumn.push(tempLeftColumn);

            let tempColumnText = {};
            if (origin != "dailyView") {
                tempColumnText = {
                    'text': rosterTemp[i].date,
                    'x': leftColumnTextLeftMargin,
                    'y': startRowPos + rowBlockHeight / 2,
                    'style': { "writingMode": " tb-rl", "fontSize": "14px" }
                }
            }
            else {
                tempColumnText = {
                    'text': rosterTemp[i].assignments[0].venue.name.substring(0, 19),
                    'x': leftColumnTextLeftMargin,
                    'y': startRowPos + rowBlockHeight / 2,
                    'style': { "writingMode": "tb-rl", "fontSize": "14px" }
                }
            }
            columnText.push(tempColumnText);

            let tempPartitionRect = {
                'x': leftColumnWidth,
                'y': startRowPos,
                'width': selfWidth - leftColumnWidth,
                'height': rowBlockHeight,
                'style': { "fill": "white", "stroke": "#a2b2bc", "strokeWidth": 1, "fillOpacity": 0 }
            }
            partitionRect.push(tempPartitionRect);

            // Begin drawing pickups and drops
            if (origin != "fleetView" && origin != "dailyView") {
                for (let j in bookingObj) {
                    if (rosterTemp[i].date == bookingObj[j].date) {
                        for (let m in bookingObj[j].no_of_bookings) {
                            let timeFrame = bookingObj[j].no_of_bookings[m].time_frame;
                            let startDate = timeFrame.substring(0, 19);
                            let startHour = this.formatDate(startDate).getHours();
                            bookingObj[j].no_of_bookings[m].bookings.pickups = bookingObj[j].no_of_bookings[m].bookings.pickups ? bookingObj[j].no_of_bookings[m].bookings.pickups : 0;
                            bookingObj[j].no_of_bookings[m].bookings.dropOffs = bookingObj[j].no_of_bookings[m].bookings.dropOffs ? bookingObj[j].no_of_bookings[m].bookings.dropOffs : 0;
                            let tempPickupDrop = {
                                'x': leftColumnWidth + timeIntervalWidth * startHour,
                                'y': startRowPos,
                                'width': timeIntervalWidth,
                                'height': pickupDropHeight,
                                'textPickup': bookingObj[j].no_of_bookings[m].bookings.pickups,
                                'textDrop': bookingObj[j].no_of_bookings[m].bookings.dropOffs,
                                'style': { "fill": "#dde7ed", "stroke": "#a2b2bc", "strokeWidth": 1, "visibility": "hidden" },
                                'pickupstyle': { "fill": "#41b6ac", "fontSize": "14px", "visibility": "hidden" },
                                'dropstyle': { "fill": "#797979", "fontSize": "14px", "visibility": "hidden" }
                            }
                            pickupDrops.push(tempPickupDrop);
                        }
                    }
                }
            }
            overFlowCount = 0;
            let currDate = new Date();

            // Checking Monday, Add and delete buttons are present on every Monday of future dates
            let startIterDate = this.formatDate(rosterTemp[i].date);
            let boolCheckMonday = startIterDate.getDay() == 1 && startIterDate > currDate;
            let buttFlag = false;
            let countButton;
            if ((startIterDate.getDate() == currDate.getDate() || boolCheckMonday) && origin != "fleetView") {
                buttFlag = true;
                countButton = 0;
                for (let butt in buttons) {
                    // Buttons array stores the number and type of buttons to be inserted on the left
                    // Object that controls the position of buttons

                    let tempLeftButtons = {
                        'x': 32,
                        'y': startRowPos + rowBlockHeight / 2 + countButton - buttonMargin,
                        'width': buttonHeight, 'height': buttonHeight,
                        'style': { "fill": buttons[butt].color },
                        'text': buttons[butt].text,
                        'buttonStyle': { "fill": "white" },
                        'data': rosterTemp[i],
                        'id': buttons[butt].id,
                        'hoverText': buttons[butt].hoverText
                    }
                    leftButtons.push(tempLeftButtons);
                    countButton += 40;
                }
            }

            if (startIterDate >= currDate && origin == "weeklyView") {
                let cusCountButt = buttFlag ? countButton : 0;
                for (let custButt in customAddButton) {
                    let tempCustomAddButton = {
                        'x': 32,
                        'y': startRowPos + rowBlockHeight / 2 - buttonMargin + cusCountButt,
                        'width': buttonHeight, 'height': buttonHeight,
                        'style': { "fill": customAddButton[custButt].color },
                        'text': customAddButton[custButt].text,
                        'buttonStyle': { "fill": "white" },
                        'data': rosterTemp[i],
                        'id': customAddButton[custButt].id,
                        'hoverText': customAddButton[custButt].hoverText
                    }
                    customAddButton.push(tempCustomAddButton);
                    cusCountButt += 40;
                }
            }
            let marginCounter = 1;
            let countAssignment = 0;
            for (let j in rosterTemp[i].assignments) {
                let rosterTempShiftDetails
                if (origin == "dailyView") {
                    rosterTempShiftDetails = rosterTemp[i].assignments[j];
                }
                else {
                    rosterTempShiftDetails = rosterTemp[i].assignments[j].shift_details
                }
                let iterDate = this.formatDate(rosterTempShiftDetails.end_time);
                if (origin == "dailyView") {
                    // iterDate = this.formatDate(rosterTemp[i].assignments[j] ? rosterTempShiftDetails.end_time : formContent.date + "T23:59:59");
                }
                let timeFrame = rosterTempShiftDetails;
                let startDate = timeFrame.start_time;
                let startHour = this.formatDate(startDate).getHours();
                let endDate = timeFrame.end_time;
                let endHour = this.formatDate(endDate).getHours();
                let shiftRect = this.checkHourDiff(this.formatDate(startDate), this.formatDate(endDate));
                let shiftColor = "";
                shiftColor = "white";
                let shiftNumberRectColor = "#7e939d";
                let strokeColor = "#849aa5";
                let countApproved;
                let countUnApproved;
                let countManualPunch, tempFlag, punchFlag;
                // Green color for active = 1
                if (rosterTempShiftDetails.active && iterDate <= currDate) {
                    shiftColor = "#81c784";
                    strokeColor = "#81c784";
                    shiftNumberRectColor = "#77b87a";
                    tempFlag = false;
                    punchFlag = false;
                    countApproved = 0;
                    countUnApproved = 0;
                    countManualPunch = 0;
                    for (let m in rosterTempShiftDetails.shift_attendance) {
                        tempFlag = true;

                        if (rosterTempShiftDetails.shift_attendance[m].approved) {
                            let hourDiff = Math.abs(this.formatDate(rosterTempShiftDetails.shift_attendance[m].start_time) - this.formatDate(rosterTempShiftDetails.shift_attendance[m].end_time)) / 36e5;
                            countApproved = countApproved + hourDiff;
                        }
                        else {
                            let hourDiff = Math.abs(this.formatDate(rosterTempShiftDetails.shift_attendance[m].start_time) - this.formatDate(rosterTempShiftDetails.shift_attendance[m].end_time)) / 36e5;
                            countUnApproved = countUnApproved + hourDiff;
                        }
                        if (rosterTempShiftDetails.shift_attendance[m].manual_punch) {
                            if (rosterTempShiftDetails.shift_attendance[m].approved == null || rosterTempShiftDetails.shift_attendance[m].approved == 0) {
                                tempFlag = true;
                                punchFlag = true;
                            }
                            countManualPunch++;
                        }
                    }
                }
                // Red color for active = 0
                else if ((!rosterTempShiftDetails.active) && iterDate <= currDate) {
                    shiftColor = "#e46765";
                    strokeColor = "#e46765";
                    shiftNumberRectColor = "#d06767";
                }

                if ((rosterTemp[i].assignments[j].fleet_details || origin == "fleetView") && iterDate > currDate) {
                    shiftColor = "#ffab00";
                    strokeColor = "#ffab00";
                    shiftNumberRectColor = "#d88f17";
                }
                // Overflow condition
                if (this.formatDate(rosterTempShiftDetails.start_time).getDate() != this.formatDate(rosterTempShiftDetails.end_time).getDate() && origin != "dailyView") {
                    let dateTemp = new Date('2018-01-01T00:00');
                    let overFlowShiftRectWidth = this.checkHourDiff(this.formatDate(dateTemp), this.formatDate(endDate));
                    if (parseInt(i) < rosterTemp.length - 1) {
                        overFlowFlag = true;
                        let downShiftOverFlow = ((totalRowShifts - (parseInt(j) + 1)) * (shiftSeperatorMargin + shiftRectHeight)) + bottomRowBlockMargin + pickupDropHeight + startMarginTop + overFlowCount * (shiftSeperatorMargin + shiftRectHeight) + shiftRectHeight;
                        overFlowCount++;
                        if (origin != "fleetView") {
                            if (rosterTemp[i].assignments[j].fleet_details || iterDate >= currDate) {
                                // Object to control overflow shift rectangle
                                let tempIndent = marginCounter ? (startMarginTop) : shiftSeperatorMargin;
                                marginCounter = 0;
                                let tempOverFlowShifts = {
                                    'x': leftColumnWidth,
                                    'y': startRowPos + pickupDropHeight + tempIndent + ((shiftSeperatorMargin + shiftRectHeight) * j) + downShiftOverFlow,
                                    'width': timeIntervalWidth * (overFlowShiftRectWidth),
                                    'height': shiftRectHeight,
                                    'color': strokeColor,
                                    'style': { "fill": shiftColor, "stroke": strokeColor, "strokeWidth": "4px" },
                                    'data': rosterTemp[i].assignments[j],
                                    'uibText': rosterTemp[i].assignments[j].fleet_details ? rosterTemp[i].assignments[j].fleet_details.employee ? (parseInt(j) + 1).toString() + " " + rosterTemp[i].assignments[j].fleet_details.employee.employee_number + " " + rosterTemp[i].assignments[j].fleet_details.display_name : (parseInt(j) + 1).toString() + " " + "Missing Employee number" : (parseInt(j) + 1).toString() + " " + " Not Assigned"
                                };
                                overFlowShifts.push(tempOverFlowShifts);
                            }
                        }
                    }

                }



                // Draw shift rectangles
                let tempShiftRect = {
                    'x': leftColumnWidth + timeIntervalWidth * startHour,
                    'y': ShiftRectYStart + ((shiftSeperatorMargin + shiftRectHeight) * j),
                    'width': timeIntervalWidth * shiftRect,
                    'height': shiftRectHeight,
                    'color': strokeColor,
                    'style': { "fill": shiftColor, "stroke": strokeColor, "strokeWidth": "4px" },
                    'data': rosterTemp[i].assignments[j],
                    'uibText': rosterTemp[i].assignments[j].fleet_details ? rosterTemp[i].assignments[j].fleet_details.employee ? (parseInt(j) + 1).toString() + " " + rosterTemp[i].assignments[j].fleet_details.employee.employee_number + " " + rosterTemp[i].assignments[j].fleet_details.display_name : (parseInt(j) + 1).toString() + " " + "Missing Employee number" : (parseInt(j) + 1).toString() + " " + "Not Assigned"
                }
                shiftRects.push(tempShiftRect);
                let tempShiftNumberRects = {
                    'x': leftColumnWidth + timeIntervalWidth * startHour,
                    'y': ShiftRectYStart + ((shiftSeperatorMargin + shiftRectHeight) * j),
                    'width': shiftNumberBoxWidth,
                    'height': shiftRectHeight,
                    'color': strokeColor,
                    'style': { "fill": shiftNumberRectColor, "stroke": shiftNumberRectColor, "strokeWidth": "4px" },
                    'data': rosterTemp[i].assignments[j],
                    'uibText': rosterTemp[i].assignments[j].fleet_details ? rosterTemp[i].assignments[j].fleet_details.employee ? rosterTemp[i].assignments[j].fleet_details.employee.employee_number + " " + rosterTemp[i].assignments[j].fleet_details.display_name : "Missing Employee number" : "Not Assigned"
                }
                shiftNumberRect.push(tempShiftNumberRects);

                // Shift Texts

                let textShiftColor = "white";
                let text0, text1, text2, text3, text4;
                if ((rosterTemp[i].assignments[j].fleet_details != null && rosterTemp[i].assignments[j].fleet_details.employee) || origin != "weeklyView") {
                    text1 = "";
                    text2 = "";
                    text3 = "";
                    text4 = "";
                    let indentText = 0;
                    if (origin == "fleetView") {
                        text1 = "";
                        text2 = rosterTemp[i].assignments[j].shift_details.venue.name.substring(0, 26);
                        text3 = startDate.substring(11, 19) + " -  " + endDate.substring(11, 19);
                        indentText = 63;
                    }
                    else if (origin == "dailyView") {
                        if (rosterTemp[i].assignments[j].station_manager && rosterTemp[i].assignments[j].station_manager.user) {
                            text1 = rosterTemp[i].assignments[j].station_manager.user.employee.employee_number;
                            text2 = rosterTemp[i].assignments[j].station_manager.user.display_name.substring(0, 15);
                            text3 = startDate.substring(11, 19) + " -  " + endDate.substring(11, 19);
                            text4 = " ";
                        }
                    }
                    else {
                        text1 = rosterTemp[i].assignments[j].fleet_details.employee.employee_number;
                        text2 = rosterTemp[i].assignments[j].fleet_details.display_name.substring(0, 15);
                        text3 = startDate.substring(11, 19) + " -  " + endDate.substring(11, 19);
                        text4 = " ";

                    }


                    let tempShiftTextID = {
                        'text': text1,
                        'x': leftColumnWidth + timeIntervalWidth * startHour + 58,
                        'y': ShiftRectYStart + ((shiftSeperatorMargin + shiftRectHeight) * j) + 18,
                        'data': rosterTemp[i].assignments[j],
                        'color': strokeColor,
                        'style': { "fill": textShiftColor, "fontSize": "14px", "fontWeight": 500 },
                        'title': text0 + " " + text1 + " " + text2 + " " + text3 + " " + text4
                    };

                    shiftTexts.push(tempShiftTextID);

                    if (tempFlag) {
                        text4 = "  P: " + countApproved + "hrs | A: " + countUnApproved + "hrs | MP: " + countManualPunch;
                        let tempAttendanceText = {
                            'text': text4,
                            'x': leftColumnWidth + timeIntervalWidth * startHour + 260,
                            'y': ShiftRectYStart + ((shiftSeperatorMargin + shiftRectHeight) * j) + 18,
                            'color': strokeColor,
                            'data': rosterTemp[i].assignments[j],
                            'style': { "fill": "white", "fontSize": "14px", "fontWeight": 500 },
                            'title': text0 + " " + text1 + " " + text2 + " " + text3 + " " + text4
                        };
                        shiftTexts.push(tempAttendanceText);
                    }

                    let tempShiftTextDuration = {
                        'text': text3,
                        'x': leftColumnWidth + timeIntervalWidth * startHour + 58,
                        'y': ShiftRectYStart + ((shiftSeperatorMargin + shiftRectHeight) * j) + shiftRectHeight - 3,
                        'data': rosterTemp[i].assignments[j],
                        'color': strokeColor,
                        'style': { "fill": "white", "fontSize": "14px", "fontWeight": 500 },
                        'title': text0 + " " + text1 + " " + text2 + " " + text3 + " " + text4
                    };

                    shiftTexts.push(tempShiftTextDuration);

                    let tempShiftTextName = {
                        'text': text2,
                        'x': leftColumnWidth + timeIntervalWidth * startHour + 121 - indentText,
                        'y': ShiftRectYStart + ((shiftSeperatorMargin + shiftRectHeight) * j) + 18,
                        'color': strokeColor,
                        'data': rosterTemp[i].assignments[j],
                        'style': { "fill": "white", "fontSize": "16px", "fontWeight": 500 },
                        'title': text0 + " " + text1 + " " + text2 + " " + text3 + " " + text4
                    };

                    shiftTexts.push(tempShiftTextName);
                }
                text0 = parseInt(j) + 1;
                let text0indent = parseInt(text0) < 9 ? 15 : 10;
                let tempShiftNumber = {
                    'text': text0,
                    'x': leftColumnWidth + timeIntervalWidth * startHour + text0indent,
                    'y': ShiftRectYStart + ((shiftSeperatorMargin + shiftRectHeight) * j) + shiftRectHeight - 12,
                    'color': strokeColor,
                    'data': rosterTemp[i].assignments[j],
                    'style': { "fill": "white", "fontSize": "22px", "fontWeight": 500 },
                    'title': text0 + " " + text1 + " " + text2 + " " + text3 + " " + text4
                };
                shiftTexts.push(tempShiftNumber);
                if (origin != "fleetView") {
                    if ((rosterTemp[i].assignments[j].fleet_details == null && origin != "dailyView") || (rosterTemp[i].assignments[j].station_manager == null && origin == "dailyView")) {
                        let text5 = "Not Assigned";
                        textShiftColor = "#849aa5";
                        let tempShiftNotAssigned = {
                            'text': text5,
                            'x': leftColumnWidth + timeIntervalWidth * startHour + 58,
                            'y': ShiftRectYStart + ((shiftSeperatorMargin + shiftRectHeight) * j) + shiftRectHeight / 2 + 5,
                            'color': strokeColor,
                            'data': rosterTemp[i].assignments[j],
                            'style': { "fill": textShiftColor, "fontSize": "16px", "fontWeight": 500 },
                            'title': text0 + " " + text1 + " " + text2 + " " + text3 + " " + text4
                        };

                        shiftTexts.push(tempShiftNotAssigned);
                    }
                }




                tempFlag = false;

                countAssignment++;
            }
        }
        selfHeight = totalRowBlockHeight + 50;

        for (let k in hours) {
            makeMarginLine(leftColumnWidth + (timeIntervalWidth * k), 0);
        }
        function makeMarginLine(x, y) {
            let temp = {
                'x1': x, 'y1': y, 'x2': x, 'y2': selfHeight, 'style': { "stroke": "white", "visibility": "hidden" }
            };
            marginLine.push(temp);
        }

        pickupDropFlag = false;
        selfIndex = 0;

        selfTimewidth = parseInt(selfTimewidth);
        this.setState({ leftColumn, marginLine, pickupDrops, shiftRects, shiftNumberRect, columnText, shiftTexts, leftButtons, overFlowShifts, shiftOverflowText, partitionRect, manualPunch, customAddButton, selfHeight, selfWidth, leftColumnWidth, hours, selfTimewidth, pickupDropFlag, selfIndex });
    }

    render() {

        const { leftColumn, marginLine, pickupDrops, shiftRects, shiftNumberRect, columnText, shiftTexts, leftButtons, overFlowShifts, shiftOverflowText, partitionRect, multiColor, manualPunch, customAddButtons, selfHeight, selfWidth, leftColumnWidth, hours, selfTimewidth, selfIndex } = this.state
        // console.log("hello", this.state);
        return (
            <div>
                <div hl-sticky="" style={{ background: 'white', paddingTop: '10px', paddingBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', 'paddingLeft': leftColumnWidth + selfTimewidth / 2 }}>
                        {
                            hours.map((item, key) =>

                                <div key={key} style={{ width: selfTimewidth }} textAnchor="middle">
                                    {item}
                                </div>
                            )
                        }
                        {/* <div ng-repeat="item in roster.hours track by $index">
                            <div ng-if="item<9" ng-style="{'width': roster.roundWidth(roster.timeWidth)}">
                                {{ item }}
                            </div>
                            <div ng-if="item>=9" ng-style="{'width': roster.roundWidth(roster.timeWidth)+1}">
                                {{ item }}
                            </div>

                        </div> */}
                    </div>
                </div>
                <div className="roster-content">
                    <svg ref="mySvg" width="100%" height={selfHeight} >

                        {
                            marginLine.map((line, key) => <line key={key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} style={line.style} />)
                        }
                        {/* <line ng-repeat="line in roster.marginLine" ng-attr-x1="{{line.x1}}" ng-attr-y1="{{line.y1}}" ng-attr-x2="{{line.x2}}" ng-attr-y2="{{line.y2}}"
                        ng-attr-style="{{line.style}}" /> */}


                        {
                            leftColumn.map((day, key) => <rect key={key} x={day.x} y={day.y} width={day.width} height={day.height} style={day.style} />)
                        }
                        {/* <rect ng-repeat="rect in roster.leftColumn" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}" ng-attr-height="{{rect.height}}"
                        ng-attr-style="{{rect.style}}" /> */}

                        {
                            columnText.map((text, key) => <text key={key} x={text.x} y={text.y} style={text.style} textAnchor="middle">{text.text}</text>)
                        }
                        {/* <text ng-repeat="text in roster.columnText" ng-attr-x="{{text.x}}" ng-attr-y="{{text.y}}" ng-attr-style="{{text.style}}"
                        text-anchor="middle">{{ text.text }} </text> */}

                        {
                            partitionRect.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} onMouseEnter={() => this.pickupDropSelect(true, key)} onMouseLeave={() => this.pickupDropSelect(false, key)} />)
                        }


                        {/* <rect ng-repeat="rect in roster.partitionRect" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" /> */}

                        {
                            leftButtons.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} className="cursor-pointer"><title>{rect.hoverText}</title></rect>)
                        }

                        {/* <rect ng-repeat="rect in roster.leftButtons" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.leftButtonClick(rect.data, rect.id)"
                        className="cursor-pointer">
                        <title>{{ rect.hoverText }}</title>
                    </rect> */}
                        {
                            leftButtons.map((text, key) => <text key={key} x={text.x + text.width / 2} y={text.y + text.height / 1.5} style={text.buttonStyle} textAnchor="middle" className="fontAwesome cursor-pointer">{text.text}<title>{text.hoverText}</title></text>)
                        }
                        {/* <text ng-repeat="text in roster.leftButtons" ng-attr-x="{{text.x + text.width/2}}" ng-attr-y="{{text.y + text.height/1.5}}"
                        ng-attr-style="{{text.buttonStyle}}" text-anchor="middle" className="fontAwesome cursor-pointer" ng-click="roster.leftButtonClick(text.data, text.id)">{{ text.text }}
                        <title>{{ text.hoverText }}</title>
                    </text> */}
                        {
                            customAddButtons.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} className="cursor-pointer"><title>{rect.hoverText}</title></rect>)
                        }
                        {/* <rect ng-repeat="rect in roster.customAddButton" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.leftButtonClick(rect.data, rect.id)"
                        className="cursor-pointer">
                        <title>{{ rect.hoverText }}</title>
                    </rect> */}
                        {
                            customAddButtons.map((text, key) => <text key={key} x={text.x + text.width / 2} y={text.y + text.height / 1.5} style={text.buttonStyle} textAnchor="middle" className="fontAwesome cursor-pointer">{text.text}<title>{text.hoverText}</title></text>)
                        }

                        {/* <text ng-repeat="text in roster.customAddButton" ng-attr-x="{{text.x + text.width/2}}" ng-attr-y="{{text.y + text.height/1.5}}"
                        ng-attr-style="{{text.buttonStyle}}" text-anchor="middle" className="fontAwesome cursor-pointer" ng-click="roster.leftButtonClick(text.data, text.id)">{{ text.text }}
                        <title>{{ text.hoverText }}</title>
                    </text> */}

                        {
                            manualPunch.map((text, key) => <text x={text.x} y={text.y} style={text.buttonStyle} textAnchor="middle" className="fontAwesome">{text.text} </text>)

                        }
                        {/* <text ng-repeat="text in roster.manualPunch" ng-attr-x="{{text.x }}" ng-attr-y="{{text.y}}" ng-attr-style="{{text.buttonStyle}}"
                        className="fontAwesome">{{ text.text }}</text> */}

                        {
                            pickupDrops.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} />)
                        }

                        {/* <rect ng-repeat="rect in roster.pickupDrops" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" /> */}

                        {
                            pickupDrops.map((text, key) => <text key={key} x={text.x + text.width / 4} y={text.y + 15} style={text.pickupstyle}  >{text.textPickup}</text>)

                        }
                        {/* <text ng-repeat="text in roster.pickupDrops" ng-attr-x="{{text.x + 10}}" ng-attr-y="{{text.y + 13}}" style="fill: #039BE5">{{ text.textPickup }}</text> */}
                        {
                            pickupDrops.map((text, key) => <text key={key} x={text.x + text.width - text.width / 4} y={text.y + 15} style={text.dropstyle} textAnchor="end">{text.textDrop}</text>)

                        }
                        {/* <text ng-repeat="text in roster.pickupDrops" ng-attr-x="{{text.x + 35}}" ng-attr-y="{{text.y + 13}}" style="fill: #8E24AA;">{{ text.textDrop }}</text> */}

                        {
                            shiftRects.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} className="cursor-pointer" rx="4" ry="4" onMouseEnter={() => this.shiftHover(true, rect)} onMouseLeave={() => this.shiftHover(false, rect)}><title>{rect.uibText}</title></rect>)
                        }

                        {
                            shiftNumberRect.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} className="cursor-pointer" rx="4" ry="4" onMouseEnter={() => this.shiftHover(true, rect)} onMouseLeave={() => this.shiftHover(false, rect)}><title>{rect.uibText}</title></rect>)
                        }


                        {/* <rect ng-repeat="rect in roster.shiftRects" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.shiftClick(rect.data)" className="cursor-pointer">
                        <title>{{ rect.uibText }}</title>
                    </rect> */}

                        {
                            shiftTexts.map((text, key) => <text key={key} x={text.x} y={text.y} style={text.style} className="cursor-pointer" onMouseEnter={() => this.shiftHover(true, text)} onMouseLeave={() => this.shiftHover(false, text)}>{text.text} <title>{text.text}</title></text>)

                        }
                        {/* <text ng-repeat="text in roster.shiftTexts" ng-attr-x="{{text.x}}" ng-attr-y="{{text.y}}" className="cursor-pointer" ng-click="roster.shiftClick(text.data)"
                        ng-attr-style="{{text.style}}">{{ text.text }}
                        <title>{{ text.text }}</title>
                    </text> */}
                        {
                            overFlowShifts.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} className="cursor-pointer" rx="4" ry="4" onMouseEnter={() => this.shiftHover(true, rect)} onMouseLeave={() => this.shiftHover(false, rect)}><title>{rect.uibText}</title></rect>)

                        }
                        {/* <rect ng-repeat="rect in roster.overFlowShifts" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.shiftClick(rect.data)" className="cursor-pointer">
                        <title>{{ rect.uibText }}</title>
                    </rect> */}

                        {
                            shiftOverflowText.map((text, key) => <text key={key} x={text.x} y={text.y} style={text.style} textAnchor="middle" className="cursor-pointer" rx="4" ry="4" onMouseEnter={() => this.shiftHover(true, text)} onMouseLeave={() => this.shiftHover(false, text)}>{text.text} <title>{text.text}</title></text>)

                        }
                        {/* <text ng-repeat="text in roster.shiftOverflowText" ng-attr-x="{{text.x}}" ng-attr-y="{{text.y}}" className="cursor-pointer" ng-click="roster.shiftClick(text.data)"
                        ng-attr-style="{{text.style}}">{{ text.text }}
                        <title>{{ text.text }}</title>
                    </text> */}


                    </svg>
                </div>
            </div>
        )
    }
}
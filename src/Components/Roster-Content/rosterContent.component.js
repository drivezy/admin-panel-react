import React, { Component } from 'react';



const totalElements = 0;
const svg = document.querySelector("svg");
const rowHeight = 5;
const dayColumnWidth = 75;
const rectYHeight = 20;
let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
export default class RosterContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rosterData: props.rosterData,
            // svgWidth,
            // overFlowFlag: false,
            // svgFlag: true,
            // dayColumn: []
        }
    }

    componentDidMount() {
        // this.draw();
    }

    // draw = () => {
    //     const { rosterData, svgWidth, overFlowFlag, svgFlag, dayColumn = [] } = this.state
    //     rowHeight = 5;

    //     const bookingObj = rosterData.roster_booking_details;

    //     // If data origin is fleet View then restructure the data
    //     // if (self.origin == "fleetView") {
    //     //     var rosterTemp = decorate();
    //     // }
    //     // else {
    //     //     var rosterTemp = angular.copy(rosterData.roster_fleet_details);
    //     // }

    //     var totalDays = daysBetween(rosterTemp[0].date, rosterTemp[rosterTemp.length - 1].date);
    //     var heightDay = self.height / (totalDays + 1);
    //     timeWidth = (self.width - dayColumnWidth) / 24;
    //     self.timeWidth = timeWidth;
    //     var totalTimeWidth = self.width - dayColumnWidth;
    //     self.marginLine = [];
    //     for (var k in self.hours) {
    //         makeMarginLine(dayColumnWidth + (timeWidth * k), 15);
    //     }

    //     function makeMarginLine(x, y) {
    //         var temp = {
    //             'x1': x, 'y1': y, 'x2': x, 'y2': self.height, 'style': "stroke: #e8edf4;"
    //         };
    //         self.marginLine.push(temp);
    //     }
    //     self.pickupDrops = [];
    //     self.shiftRects = [];
    //     self.columnText = [];
    //     self.shiftTexts = [];
    //     self.leftButtons = [];
    //     self.overFlowShifts = [];
    //     self.shiftOverflowText = [];
    //     self.partitionRect = [];
    //     self.multiColor = [];
    //     self.manualPunch = [];
    //     self.customAddButton = [];
    //     var temp = {};
    //     var overFlowCount = 0;
    //     for (var i in rosterTemp) {
    //         var indentTop = 0;

    //         var rowElementLength = rosterTemp[i].assignments.length;
    //         if (overFlowFlag) {
    //             overFlowFlag = false;
    //             indentTop += 25 * (overFlowCount);
    //             rowElementLength = rowElementLength + overFlowCount;
    //         }
    //         var assignLength = rosterTemp[i].assignments.length == 0 || rosterTemp[i].assignments.length == 1 ? 2 : rowElementLength;
    //         var startY = (assignLength * 20 + (assignLength - 1) * 5 + 30);
    //         heightDay = startY;
    //         var marg = 0;
    //         // Object that makes left Column (day column)
    //         temp = {
    //             'x': 0, 'y': rowHeight, 'width': dayColumnWidth, 'height': startY, 'style': "fill: #efefef;stroke:#797979;stroke-width:1;"
    //         };
    //         self.dayColumn.push(temp);

    //         // Object that controls the text on the left column
    //         var tempColumnText = {}
    //         if (self.origin != "dailyView") {
    //             tempColumnText = {
    //                 'text': $filter('date')(rosterTemp[i].date, 'MMM, d, yyyy'), 'x': 20, 'y': rowHeight + heightDay / 2, 'style': "writing-mode: tb; font-size: 12px;"
    //             };
    //         }
    //         if (self.origin == "fleetView") {
    //             tempColumnText = {
    //                 'text': $filter('date')(rosterTemp[i].date, 'MMM, d, yyyy'), 'x': 20, 'y': rowHeight + heightDay / 2, 'style': "writing-mode: tb; font-size: 10px;"
    //             };
    //         }
    //         else if (self.origin == "dailyView") {
    //             tempColumnText = {
    //                 'text': rosterTemp[i].venue, 'x': 120 + dayColumnWidth, 'y': rowHeight + heightDay - 12, 'style': "fill: #D3D3D3; font-size: 20px"
    //             };
    //         }

    //         self.columnText.push(tempColumnText);

    //         // Object that controls the rectangle to seperate days
    //         var tempPartitionRect = {
    //             'x': dayColumnWidth, 'y': rowHeight, 'width': self.width - dayColumnWidth, 'height': startY, 'style': "fill: white;stroke:#797979;stroke-width:1;fill-opacity:0;"
    //         }
    //         self.partitionRect.push(tempPartitionRect);




    //         // Begin drawing Pickups and drops
    //         if (self.origin != "fleetView") {
    //             for (var j in bookingObj) {
    //                 if (rosterTemp[i].date == bookingObj[j].date) {
    //                     for (var m in bookingObj[j].no_of_bookings) {
    //                         var timeFrame = bookingObj[j].no_of_bookings[m].time_frame;
    //                         var startDate = timeFrame.substring(0, 19);
    //                         var startHour = formatDate(startDate).getHours();
    //                         var d = Math.abs(daysBetween(formatDate(rosterTemp[i].date), rosterTemp[0].date));
    //                         bookingObj[j].no_of_bookings[m].bookings.pickups = bookingObj[j].no_of_bookings[m].bookings.pickups ? bookingObj[j].no_of_bookings[m].bookings.pickups : 0;
    //                         bookingObj[j].no_of_bookings[m].bookings.dropOffs = bookingObj[j].no_of_bookings[m].bookings.dropOffs ? bookingObj[j].no_of_bookings[m].bookings.dropOffs : 0;
    //                         var tempPickupDrop = {
    //                             'x': dayColumnWidth + timeWidth * startHour, 'y': rowHeight, 'width': timeWidth, 'height': 20, 'style': "fill: #efefef;stroke:#797979;stroke-width:1;", 'textPickup': bookingObj[j].no_of_bookings[m].bookings.pickups, 'textDrop': bookingObj[j].no_of_bookings[m].bookings.dropOffs
    //                         }
    //                         self.pickupDrops.push(tempPickupDrop);
    //                         // c.font = "12px Roboto";
    //                         // c.fillStyle = "green";
    //                         // // left indentation of 25 from the position_x of the box, text in the middle of the box height
    //                         // bookingObj[j].no_of_bookings[m].bookings.pickups = bookingObj[j].no_of_bookings[m].bookings.pickups ? bookingObj[j].no_of_bookings[m].bookings.pickups : 0;
    //                         // bookingObj[j].no_of_bookings[m].bookings.dropOffs = bookingObj[j].no_of_bookings[m].bookings.dropOffs ? bookingObj[j].no_of_bookings[m].bookings.dropOffs : 0;
    //                         // c.fillText(bookingObj[j].no_of_bookings[m].bookings.pickups, dayColumnWidth + timeWidth * startHour + 10, rowHeight + 13);
    //                         // c.fillStyle = "red";
    //                         // c.fillText(bookingObj[j].no_of_bookings[m].bookings.dropOffs, dayColumnWidth + timeWidth * startHour + 25, rowHeight + 13);

    //                     }
    //                 }
    //             }
    //         }
    //         overFlowCount = 0;
    //         var currDate = new Date();

    //         // Checking Monday. Add and delete buttons are present on every Monday of future dates.
    //         var startIterDate = formatDate(rosterTemp[i].date);
    //         var boolCheckMonday = startIterDate.getDay() == 1 && startIterDate > currDate;

    //         if (rosterTemp[i].assignments.length < 3) {
    //             var buttonHeight = 20;
    //             var buttonMargin = 30;
    //         }
    //         else {
    //             var buttonMargin = 40;
    //             var buttonHeight = 24;
    //         }
    //         var buttFlag = false;
    //         if ((startIterDate.getDate() == currDate.getDate() || boolCheckMonday) && self.origin != "fleetView") {
    //             buttFlag = true;
    //             var countButton = 0;
    //             for (var butt in buttons) {
    //                 // Buttons array stores the number and type of buttons to be inserted on the left
    //                 // Object that controls the position of buttons

    //                 var tempLeftButtons = {
    //                     'x': 40, 'y': rowHeight + heightDay / 2 - buttonMargin + countButton, 'width': buttonHeight, 'height': buttonHeight, 'style': "fill:" + buttons[butt].color + ";stroke:#797979;stroke-width:2;", 'text': buttons[butt].text, 'buttonStyle': "fill:white", 'data': rosterTemp[i], 'id': buttons[butt].id, 'hoverText': buttons[butt].hoverText
    //                 }
    //                 self.leftButtons.push(tempLeftButtons);
    //                 countButton += 40;
    //             }
    //         }

    //         if (startIterDate >= currDate && self.origin == "weeklyView") {
    //             var cusCountButt = buttFlag ? countButton : 0;
    //             for (var custButt in customAddButton) {
    //                 var tempCustomAddButton = {
    //                     'x': 40, 'y': rowHeight + heightDay / 2 - buttonMargin + cusCountButt, 'width': buttonHeight, 'height': buttonHeight, 'style': "fill:" + customAddButton[custButt].color + ";stroke:#797979;stroke-width:2;", 'text': customAddButton[custButt].text, 'buttonStyle': "fill:white", 'data': rosterTemp[i], 'id': customAddButton[custButt].id, 'hoverText': customAddButton[custButt].hoverText
    //                 }
    //                 self.customAddButton.push(tempCustomAddButton);
    //                 cusCountButt += 40;
    //             }
    //         }

    //         // Begin drawing shifts in a date
    //         for (var j in rosterTemp[i].assignments) {
    //             var currDate = new Date();
    //             var iterDate = formatDate(rosterTemp[i].assignments[j].shift_details.end_time);
    //             if (self.origin == "dailyView") {
    //                 iterDate = formatDate(rosterTemp[i].assignments[j] ? rosterTemp[i].assignments[j].shift_details.end_time : self.formContent.date + "T23:59:59");
    //             }
    //             totalElements = totalElements + 2;
    //             indentTop += 25;
    //             var timeFrame = rosterTemp[i].assignments[j].shift_details;
    //             var startDate = timeFrame.start_time;
    //             var startHour = formatDate(startDate).getHours();
    //             var endDate = timeFrame.end_time;
    //             var endHour = formatDate(endDate).getHours();
    //             var userWidth = checkHourDiff(formatDate(startDate), formatDate(endDate));
    //             var shiftColor = "";
    //             // Variable that stores present shift color. By default light blur color for Unassigned
    //             shiftColor = "#81D4FA";

    //             // Do not show Absent or present colors if the date is in future
    //             if ((rosterTemp[i].assignments[j].fleet_details || self.origin == "fleetView") && iterDate <= currDate) {
    //                 // Green color for active = 1
    //                 if (rosterTemp[i].assignments[j].shift_details.active && iterDate <= currDate) {
    //                     shiftColor = "#43A047";
    //                     var tempFlag = false;
    //                     var punchFlag = false;
    //                     var countApproved = 0;
    //                     var countUnApproved = 0;
    //                     var countManualPunch = 0;
    //                     for (var m in rosterTemp[i].assignments[j].shift_details.shift_attendance) {
    //                         tempFlag = true;

    //                         if (rosterTemp[i].assignments[j].shift_details.shift_attendance[m].approved) {
    //                             var hourDiff = Math.abs(formatDate(rosterTemp[i].assignments[j].shift_details.shift_attendance[m].start_time) - formatDate(rosterTemp[i].assignments[j].shift_details.shift_attendance[m].end_time)) / 36e5;
    //                             countApproved = countApproved + hourDiff;
    //                         }
    //                         else {
    //                             var hourDiff = Math.abs(formatDate(rosterTemp[i].assignments[j].shift_details.shift_attendance[m].start_time) - formatDate(rosterTemp[i].assignments[j].shift_details.shift_attendance[m].end_time)) / 36e5;
    //                             countUnApproved = countUnApproved + hourDiff;
    //                         }
    //                         if (rosterTemp[i].assignments[j].shift_details.shift_attendance[m].manual_punch) {
    //                             if (rosterTemp[i].assignments[j].shift_details.shift_attendance[m].approved == null || rosterTemp[i].assignments[j].shift_details.shift_attendance[m].approved == 0) {
    //                                 tempFlag = true;
    //                                 punchFlag = true;
    //                             }
    //                             countManualPunch++;
    //                         }
    //                     }
    //                 }
    //                 // Red color for active = 0
    //                 else {
    //                     shiftColor = "#F44336";

    //                 }
    //             }
    //             // Orange color for assigned future shifts
    //             else if ((rosterTemp[i].assignments[j].fleet_details || self.origin == "fleetView") && iterDate > currDate) {
    //                 shiftColor = "#FB8C00";
    //             }

    //             // Overflow cases. Shifts starts at today and finishes tomorrow
    //             if (formatDate(rosterTemp[i].assignments[j].shift_details.start_time).getDate() != formatDate(rosterTemp[i].assignments[j].shift_details.end_time).getDate() && self.origin != "dailyView") {
    //                 totalElements++;
    //                 var dateTemp = new Date('2018-01-01T00:00');
    //                 var customUserWidth = checkHourDiff(formatDate(dateTemp), formatDate(endDate));
    //                 if (parseInt(i) < rosterTemp.length - 1) {
    //                     overFlowFlag = true;
    //                     var downShiftOverFlow = (rosterTemp[i].assignments.length - (parseInt(j) + 1)) * (5 + rectYHeight) + 5 + rectYHeight + 25 + overFlowCount * (rectYHeight + 5);
    //                     overFlowCount++;
    //                     if (self.origin != "fleetView") {
    //                         if (rosterTemp[i].assignments[j].fleet_details || iterDate >= currDate) {
    //                             // Object to control overflow shift rectangle
    //                             var tempOverFlowShifts = {
    //                                 'x': dayColumnWidth, 'y': rowHeight + indentTop + downShiftOverFlow, 'width': timeWidth * (customUserWidth), 'height': rectYHeight, 'style': "fill:" + shiftColor + ";", data: rosterTemp[i].assignments[j], 'uibText': rosterTemp[i].assignments[j].fleet_details ? rosterTemp[i].assignments[j].fleet_details.employee ? rosterTemp[i].assignments[j].fleet_details.employee.employee_number + " " + rosterTemp[i].assignments[j].fleet_details.display_name : "Missing Employee number" : " Not Assigned"
    //                             };
    //                             self.overFlowShifts.push(tempOverFlowShifts);
    //                         }
    //                     }
    //                     else if (self.origin == "fleetView") {
    //                         // Object to control overflow shift rectangle
    //                         var tempOverFlowShifts = {
    //                             'x': dayColumnWidth, 'y': rowHeight + indentTop + downShiftOverFlow + 10, 'width': timeWidth * (customUserWidth), 'height': rectYHeight, 'style': "fill:" + shiftColor + ";", data: rosterTemp[i].assignments[j], 'uibText': rosterTemp[i].assignments[j].shift_details.venue.name
    //                         };
    //                         self.overFlowShifts.push(tempOverFlowShifts);
    //                     }

    //                     if (rosterTemp[i].assignments[j].fleet_details != null && rosterTemp[i].assignments[j].fleet_details.employee) {
    //                         var text = rosterTemp[i].assignments[j].fleet_details.employee.employee_number + "   " + "  " + rosterTemp[i].assignments[j].fleet_details.display_name + "   " + "   " + startDate.substring(11, 19) + "   " + endDate.substring(11, 19);
    //                         if ((countApproved || countUnApproved || countManualPunch) && rosterTemp[i].assignments[j].shift_details.active) {
    //                             text = text + " | P: " + countApproved + "hrs | A: " + countUnApproved + "hrs | MP: " + countManualPunch;
    //                         }
    //                     }
    //                     else if (rosterTemp[i].assignments[j].fleet_details == null) {
    //                         text = "Not Assigned"
    //                     }
    //                     else {
    //                         text = " ";
    //                     }
    //                     if (self.origin == "fleetView") {
    //                         text = rosterTemp[i].assignments[j].shift_details.venue.name + " " + " " + startDate.substring(11, 19) + " " + endDate.substring(11, 19);
    //                     }
    //                     // Object to control overflow shift Text
    //                     if (rosterTemp[i].assignments[j].fleet_details || iterDate >= currDate) {
    //                         var tempOverFlowShiftText = {
    //                             'text': text, 'x': dayColumnWidth + 5, 'y': rowHeight + indentTop + downShiftOverFlow + 14, data: rosterTemp[i].assignments[j], 'style': "fill:white; letter-spacing:1.5;"
    //                         };
    //                         self.shiftOverflowText.push(tempOverFlowShiftText);
    //                     }
    //                     else if (self.origin == "fleetView") {
    //                         // Object to control overflow shift rectangle
    //                         var tempOverFlowShiftText = {
    //                             'text': text, 'x': dayColumnWidth + 5, 'y': rowHeight + indentTop + downShiftOverFlow + 14 + 10, data: rosterTemp[i].assignments[j], 'style': "fill:white; letter-spacing:1.5;"
    //                         };
    //                         self.shiftOverflowText.push(tempOverFlowShiftText);
    //                     }
    //                 }

    //             }

    //             // Draw shifts
    //             if ((rosterTemp[i].assignments[j].fleet_details || iterDate >= currDate) && self.origin != "fleetView") {
    //                 // Objects to control shifts, their color, etc
    //                 if (tempFlag && punchFlag) {
    //                     var tempManualPunch = {
    //                         'text': '\uf0a6', 'x': dayColumnWidth + timeWidth * (startHour) - 20, 'y': rowHeight + indentTop + 14, data: rosterTemp[i].assignments[j], 'style': "fill:black; letter-spacing:1.5;"
    //                     };
    //                     self.manualPunch.push(tempManualPunch);
    //                     punchFlag = false;
    //                 }
    //                 var tempShiftRect = {
    //                     'x': dayColumnWidth + timeWidth * (startHour), 'y': rowHeight + indentTop, 'width': timeWidth * (userWidth), 'height': rectYHeight, 'style': "fill:" + shiftColor + ";", data: rosterTemp[i].assignments[j], 'uibText': rosterTemp[i].assignments[j].fleet_details ? rosterTemp[i].assignments[j].fleet_details.employee ? rosterTemp[i].assignments[j].fleet_details.employee.employee_number + " " + rosterTemp[i].assignments[j].fleet_details.display_name : "Missing Employee number" : "Not Assigned"
    //                 };
    //                 self.shiftRects.push(tempShiftRect);
    //             }
    //             // If origin is from Employee roster neglect the dates
    //             else if (self.origin == "fleetView") {
    //                 if (tempFlag && punchFlag) {
    //                     var tempManualPunch = {
    //                         'text': '\uf0a6', 'x': dayColumnWidth + timeWidth * (startHour) - 20, 'y': rowHeight + indentTop + 14, data: rosterTemp[i].assignments[j], 'style': "fill:black; letter-spacing:1.5;"
    //                     };
    //                     self.manualPunch.push(tempManualPunch);
    //                 }
    //                 var tempShiftRect = {
    //                     'x': dayColumnWidth + timeWidth * (startHour), 'y': rowHeight + indentTop, 'width': timeWidth * (userWidth), 'height': rectYHeight, 'style': "fill:" + shiftColor + ";", data: rosterTemp[i].assignments[j], 'uibText': rosterTemp[i].assignments[j].shift_details.venue.name
    //                 };
    //                 self.shiftRects.push(tempShiftRect);
    //                 punchFlag = false;
    //             }
    //             if (self.origin != "fleetView") {
    //                 if (rosterTemp[i].assignments[j].fleet_details != null && rosterTemp[i].assignments[j].fleet_details.employee) {
    //                     var text = rosterTemp[i].assignments[j].fleet_details.employee.employee_number + "   " + "  " + rosterTemp[i].assignments[j].fleet_details.display_name + "   " + "   " + startDate.substring(11, 19) + "   " + endDate.substring(11, 19);
    //                     if (tempFlag) {
    //                         text = text + " | P: " + countApproved + "hrs | A: " + countUnApproved + "hrs | MP: " + countManualPunch;

    //                     }
    //                 }
    //                 else if (rosterTemp[i].assignments[j].fleet_details == null) {
    //                     text = "Not Assigned"
    //                 }
    //                 else {
    //                     text = " ";
    //                 }
    //             }
    //             if (self.origin == "fleetView") {
    //                 text = rosterTemp[i].assignments[j].shift_details.venue.name + " " + " " + startDate.substring(11, 19) + " " + endDate.substring(11, 19);
    //                 if (tempFlag) {
    //                     text = text + " | P: " + countApproved + "hrs | A: " + countUnApproved + "hrs | MP: " + countManualPunch;

    //                 }
    //             }
    //             var tempShiftText = {
    //                 'text': text, 'x': dayColumnWidth + timeWidth * (startHour) + 20, 'y': rowHeight + indentTop + 14, data: rosterTemp[i].assignments[j], 'style': "fill:white; letter-spacing:1.5;"
    //             };

    //             self.shiftTexts.push(tempShiftText);
    //             tempFlag = false;
    //         }
    //         rowHeight = rowHeight + startY;
    //     }
    //     // self.height = totalElements * rectYHeight + 10  * (totalElements-1) + rosterTemp.length * 50;
    //     self.height = (- rosterTemp.length * (25 + 10 + 20) + totalElements * (25 + 10 + 25)) * 8;
    // }




    render() {

        const { rosterData } = this.state
        return (
            <div className="roster-content">
                {/* <svg ng-attr-height="{{roster.height}}" style="width:100%">

                    <line ng-repeat="line in roster.marginLine" ng-attr-x1="{{line.x1}}" ng-attr-y1="{{line.y1}}" ng-attr-x2="{{line.x2}}" ng-attr-y2="{{line.y2}}"
                        ng-attr-style="{{line.style}}" />


                    {
                        dayColumn.map((day, key) => {
                            return (
                                <rect></rect>
                            )
                        })
                    }
                    <rect ng-repeat="rect in roster.dayColumn" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}" ng-attr-height="{{rect.height}}"
                        ng-attr-style="{{rect.style}}" />
                    <text ng-repeat="text in roster.columnText" ng-attr-x="{{text.x}}" ng-attr-y="{{text.y}}" ng-attr-style="{{text.style}}"
                        text-anchor="middle">{{ text.text }} </text>

                    <rect ng-repeat="rect in roster.partitionRect" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" />

                    <rect ng-repeat="rect in roster.leftButtons" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.leftButtonClick(rect.data, rect.id)"
                        className="cursor-pointer">
                        <title>{{ rect.hoverText }}</title>
                    </rect>
                    <text ng-repeat="text in roster.leftButtons" ng-attr-x="{{text.x + text.width/2}}" ng-attr-y="{{text.y + text.height/1.5}}"
                        ng-attr-style="{{text.buttonStyle}}" text-anchor="middle" className="fontAwesome cursor-pointer" ng-click="roster.leftButtonClick(text.data, text.id)">{{ text.text }}
                        <title>{{ text.hoverText }}</title>
                    </text>
                    <rect ng-repeat="rect in roster.customAddButton" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.leftButtonClick(rect.data, rect.id)"
                        className="cursor-pointer">
                        <title>{{ rect.hoverText }}</title>
                    </rect>
                    <text ng-repeat="text in roster.customAddButton" ng-attr-x="{{text.x + text.width/2}}" ng-attr-y="{{text.y + text.height/1.5}}"
                        ng-attr-style="{{text.buttonStyle}}" text-anchor="middle" className="fontAwesome cursor-pointer" ng-click="roster.leftButtonClick(text.data, text.id)">{{ text.text }}
                        <title>{{ text.hoverText }}</title>
                    </text>

                    <text ng-repeat="text in roster.manualPunch" ng-attr-x="{{text.x }}" ng-attr-y="{{text.y}}" ng-attr-style="{{text.buttonStyle}}"
                        className="fontAwesome">{{ text.text }}</text>


                    <rect ng-repeat="rect in roster.pickupDrops" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" />
                    <text ng-repeat="text in roster.pickupDrops" ng-attr-x="{{text.x + 10}}" ng-attr-y="{{text.y + 13}}" style="fill: #039BE5">{{ text.textPickup }}</text>
                    <text ng-repeat="text in roster.pickupDrops" ng-attr-x="{{text.x + 35}}" ng-attr-y="{{text.y + 13}}" style="fill: #8E24AA;">{{ text.textDrop }}</text>


                    <rect ng-repeat="rect in roster.shiftRects" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.shiftClick(rect.data)" className="cursor-pointer">
                        <title>{{ rect.uibText }}</title>
                    </rect>
                    <text ng-repeat="text in roster.shiftTexts" ng-attr-x="{{text.x}}" ng-attr-y="{{text.y}}" className="cursor-pointer" ng-click="roster.shiftClick(text.data)"
                        ng-attr-style="{{text.style}}">{{ text.text }}
                        <title>{{ text.text }}</title>
                    </text>

                    <rect ng-repeat="rect in roster.overFlowShifts" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.shiftClick(rect.data)" className="cursor-pointer">
                        <title>{{ rect.uibText }}</title>
                    </rect>
                    <text ng-repeat="text in roster.shiftOverflowText" ng-attr-x="{{text.x}}" ng-attr-y="{{text.y}}" className="cursor-pointer" ng-click="roster.shiftClick(text.data)"
                        ng-attr-style="{{text.style}}">{{ text.text }}
                        <title>{{ text.text }}</title>
                    </text>


                </svg> */}
            </div>
        )
    }
}
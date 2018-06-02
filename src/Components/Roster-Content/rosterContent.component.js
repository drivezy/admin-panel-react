import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class RosterContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rosterData: props.rosterData,
            svgFlag: true,
            dayColumn: [],
            marginLine: [],
            pickupDrops: [],
            shiftRects: [],
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
            dayColumnWidth: 75,
            hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            timeDivisionWidth: 1
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
        var one_day = 1000 * 60 * 60 * 24;
        var dateFormatted1 = this.formatDate(date1);
        var dateFormatted2 = this.formatDate(date2);
        // Convert both dates to milliseconds
        var date1_ms = dateFormatted1.getTime();
        var date2_ms = dateFormatted2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);

    }

    draw = () => {
        const { rosterData, origin } = this.state;
        let { dayColumn, marginLine, pickupDrops, shiftRects, columnText, shiftTexts, leftButtons, overFlowShifts, shiftOverflowText, partitionRect, multiColor, manualPunch, customAddButtons, timeDivisionWidth } = this.state;

        let totalElements = 0;
        const svg = ReactDOM.findDOMNode(this.refs.mySvg);

        let rowHeight = 5;
        const dayColumnWidth = 75;
        const rectYHeight = 20;
        let overFlowFlag = false;
        let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        let selfWidth = svg.width.animVal.value;
        let timeWidth = (selfWidth - dayColumnWidth) / 24;
        let selfHeight = 5 * window.innerHeight;
        let tempHeight = selfHeight;
        let svgWidth = svg.getBoundingClientRect().x;
        const buttons = [{
            'id': 0,
            'text': "\uf067",
            'color': "#7CB342",
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
            'color': "#7CB342",
            'fontColor': "white",
            'hoverText': "Custom Assign"
        }];

        rowHeight = 5;
        const bookingObj = rosterData.roster_booking_details;
        const rosterTemp = rosterData.roster_fleet_details;
        // If data origin is fleet View then restructure the data
        if (origin == "fleetView") {
            // const rosterTemp = decorate();
        }
        else {
            const rosterTemp = rosterData.roster_fleet_details;
        }

        let totalDays = this.daysBetween(rosterTemp[0].date, rosterTemp[rosterTemp.length - 1].date);
        let heightDay = selfHeight / (totalDays + 1);
        timeWidth = (selfWidth - dayColumnWidth) / 24;
        let totalTimeWidth = selfWidth - dayColumnWidth;
        marginLine = [];
        for (let k in hours) {
            makeMarginLine(dayColumnWidth + (timeWidth * k), 15);
        }

        function makeMarginLine(x, y) {
            let temp = {
                'x1': x, 'y1': y, 'x2': x, 'y2': selfHeight, style: { stroke: "#e8edf4" }
            };
            marginLine.push(temp);
        }
        let temp = {};
        let overFlowCount = 0;
        for (let i in rosterTemp) {
            let indentTop = 0;

            let rowElementLength = rosterTemp[i].assignments.length;
            if (overFlowFlag) {
                overFlowFlag = false;
                indentTop += 25 * (overFlowCount);
                rowElementLength = rowElementLength + overFlowCount;
            }
            let assignLength = rosterTemp[i].assignments.length == 0 || rosterTemp[i].assignments.length == 1 ? 2 : rowElementLength;
            let startY = (assignLength * 20 + (assignLength - 1) * 5 + 30);
            heightDay = startY;
            let marg = 0;
            // Object that makes left Column (day column)
            temp = {
                'x': 0, 'y': rowHeight, 'width': dayColumnWidth, 'height': startY, style: {
                    fill: '#efefef',
                    stroke: '#797979',
                    strokeWidth: 1
                }
            };
            dayColumn.push(temp);

            // Object that controls the text on the left column
            let tempColumnText = {};
            if (origin != "dailyView") {
                tempColumnText = {
                    'text': rosterTemp[i].date, 'x': 20, 'y': rowHeight + heightDay / 2, style: {
                        writingMode: 'tb',
                        fontSize: '12px'
                    }
                };
            }
            if (origin == "fleetView") {
                tempColumnText = {
                    'text': rosterTemp[i].date, 'x': 20, 'y': rowHeight + heightDay / 2, style: {
                        writingMode: 'tb',
                        fontSize: '10px'
                    }
                };
            }
            else if (origin == "dailyView") {
                tempColumnText = {
                    'text': rosterTemp[i].venue, 'x': 120 + dayColumnWidth, 'y': rowHeight + heightDay - 12, style: {
                        fill: '#D3D3D3',
                        fontSize: '20px'
                    }
                };
            }

            columnText.push(tempColumnText);

            // Object that controls the rectangle to seperate days
            let tempPartitionRect = {
                'x': dayColumnWidth, 'y': rowHeight, 'width': selfWidth - dayColumnWidth, 'height': startY,
                style: {
                    fill: 'white',
                    stroke: '#797979',
                    strokeWidth: 1,
                    fillOpacity: 0
                }
            }
            partitionRect.push(tempPartitionRect);

            // Begin drawing Pickups and drops
            if (origin != "fleetView") {
                for (var j in bookingObj) {
                    if (rosterTemp[i].date == bookingObj[j].date) {
                        for (var m in bookingObj[j].no_of_bookings) {
                            let timeFrame = bookingObj[j].no_of_bookings[m].time_frame;
                            let startDate = timeFrame.substring(0, 19);
                            let startHour = this.formatDate(startDate).getHours();
                            let d = Math.abs(this.daysBetween(this.formatDate(rosterTemp[i].date), rosterTemp[0].date));
                            bookingObj[j].no_of_bookings[m].bookings.pickups = bookingObj[j].no_of_bookings[m].bookings.pickups ? bookingObj[j].no_of_bookings[m].bookings.pickups : 0;
                            bookingObj[j].no_of_bookings[m].bookings.dropOffs = bookingObj[j].no_of_bookings[m].bookings.dropOffs ? bookingObj[j].no_of_bookings[m].bookings.dropOffs : 0;
                            let tempPickupDrop = {
                                'x': dayColumnWidth + timeWidth * startHour, 'y': rowHeight, 'width': timeWidth, 'height': 20,
                                style: {
                                    fill: '#efefef',
                                    stroke: '#797979',
                                    strokeWidth: 1,
                                },
                                'textPickup': bookingObj[j].no_of_bookings[m].bookings.pickups, 'textDrop': bookingObj[j].no_of_bookings[m].bookings.dropOffs
                            }
                            pickupDrops.push(tempPickupDrop);
                            // c.font = "12px Roboto";
                            // c.fillStyle = "green";
                            // // left indentation of 25 from the position_x of the box, text in the middle of the box height
                            // bookingObj[j].no_of_bookings[m].bookings.pickups = bookingObj[j].no_of_bookings[m].bookings.pickups ? bookingObj[j].no_of_bookings[m].bookings.pickups : 0;
                            // bookingObj[j].no_of_bookings[m].bookings.dropOffs = bookingObj[j].no_of_bookings[m].bookings.dropOffs ? bookingObj[j].no_of_bookings[m].bookings.dropOffs : 0;
                            // c.fillText(bookingObj[j].no_of_bookings[m].bookings.pickups, dayColumnWidth + timeWidth * startHour + 10, rowHeight + 13);
                            // c.fillStyle = "red";
                            // c.fillText(bookingObj[j].no_of_bookings[m].bookings.dropOffs, dayColumnWidth + timeWidth * startHour + 25, rowHeight + 13);

                        }
                    }
                }
            }
            overFlowCount = 0;
            let currDate = new Date();

            // Checking Monday. Add and delete buttons are present on every Monday of future dates.
            let startIterDate = this.formatDate(rosterTemp[i].date);
            let boolCheckMonday = startIterDate.getDay() == 1 && startIterDate > currDate;
            let buttonHeight;
            let buttonMargin;
            if (rosterTemp[i].assignments.length < 3) {
                buttonHeight = 20;
                buttonMargin = 30;
            }
            else {
                buttonMargin = 40;
                buttonHeight = 24;
            }
            let buttFlag = false;
            let countButton;
            if ((startIterDate.getDate() == currDate.getDate() || boolCheckMonday) && origin != "fleetView") {
                buttFlag = true;
                countButton = 0;
                for (let butt in buttons) {
                    // Buttons array stores the number and type of buttons to be inserted on the left
                    // Object that controls the position of buttons

                    let tempLeftButtons = {
                        'x': 40, 'y': rowHeight + heightDay / 2 - buttonMargin + countButton, 'width': buttonHeight, 'height': buttonHeight,
                        style: {
                            fill: buttons[butt].color,
                            stroke: '#797979',
                            strokeWidth: 2,

                        },
                        'text': buttons[butt].text,
                        buttonStyle: {
                            fill: 'white'
                        },
                        'data': rosterTemp[i], 'id': buttons[butt].id, 'hoverText': buttons[butt].hoverText
                    }
                    leftButtons.push(tempLeftButtons);
                    countButton += 40;
                }
            }

            if (startIterDate >= currDate && origin == "weeklyView") {
                let cusCountButt = buttFlag ? countButton : 0;
                for (let custButt in customAddButton) {
                    let tempCustomAddButton = {
                        'x': 40, 'y': rowHeight + heightDay / 2 - buttonMargin + cusCountButt, 'width': buttonHeight, 'height': buttonHeight,
                        style: {
                            fill: customAddButton[custButt].color,
                            stroke: '#797979',
                            strokeWidth: 2
                        },
                        'text': customAddButton[custButt].text,
                        buttonStyle: {
                            fill: 'white'
                        }, 'data': rosterTemp[i], 'id': customAddButton[custButt].id, 'hoverText': customAddButton[custButt].hoverText
                    }
                    customAddButtons.push(tempCustomAddButton);
                    cusCountButt += 40;
                }
            }

            // Begin drawing shifts in a date
            for (let j in rosterTemp[i].assignments) {
                let currDate = new Date();
                let iterDate = this.formatDate(rosterTemp[i].assignments[j].shift_details.end_time);
                let countApproved, countUnApproved, countManualPunch;
                let tempFlag, punchFlag;
                // if (origin == "dailyView") {
                //     iterDate = this.formatDate(rosterTemp[i].assignments[j] ? rosterTemp[i].assignments[j].shift_details.end_time : formContent.date + "T23:59:59");
                // }

                totalElements = totalElements + 2;
                indentTop += 25;
                let timeFrame = rosterTemp[i].assignments[j].shift_details;
                let startDate = timeFrame.start_time;
                let startHour = this.formatDate(startDate).getHours();
                let endDate = timeFrame.end_time;
                let endHour = this.formatDate(endDate).getHours();
                let userWidth = this.checkHourDiff(this.formatDate(startDate), this.formatDate(endDate));
                let shiftColor = "";
                // Variable that stores present shift color. By default light blur color for Unassigned
                shiftColor = "#81D4FA";

                // Do not show Absent or present colors if the date is in future
                if ((rosterTemp[i].assignments[j].fleet_details || origin == "fleetView") && iterDate <= currDate) {
                    // Green color for active = 1
                    if (rosterTemp[i].assignments[j].shift_details.active && iterDate <= currDate) {
                        shiftColor = "#43A047";
                        tempFlag = false;
                        punchFlag = false;
                        countApproved = 0;
                        countUnApproved = 0;
                        countManualPunch = 0;
                        for (let m in rosterTemp[i].assignments[j].shift_details.shift_attendance) {
                            tempFlag = true;

                            if (rosterTemp[i].assignments[j].shift_details.shift_attendance[m].approved) {
                                let hourDiff = Math.abs(this.formatDate(rosterTemp[i].assignments[j].shift_details.shift_attendance[m].start_time) - this.formatDate(rosterTemp[i].assignments[j].shift_details.shift_attendance[m].end_time)) / 36e5;
                                countApproved = countApproved + hourDiff;
                            }
                            else {
                                let hourDiff = Math.abs(this.formatDate(rosterTemp[i].assignments[j].shift_details.shift_attendance[m].start_time) - this.formatDate(rosterTemp[i].assignments[j].shift_details.shift_attendance[m].end_time)) / 36e5;
                                countUnApproved = countUnApproved + hourDiff;
                            }
                            if (rosterTemp[i].assignments[j].shift_details.shift_attendance[m].manual_punch) {
                                if (rosterTemp[i].assignments[j].shift_details.shift_attendance[m].approved == null || rosterTemp[i].assignments[j].shift_details.shift_attendance[m].approved == 0) {
                                    tempFlag = true;
                                    punchFlag = true;
                                }
                                countManualPunch++;
                            }
                        }
                    }
                    // Red color for active = 0
                    else {
                        shiftColor = "#F44336";

                    }
                }
                // Orange color for assigned future shifts
                else if ((rosterTemp[i].assignments[j].fleet_details || origin == "fleetView") && iterDate > currDate) {
                    shiftColor = "#FB8C00";
                }

                // Overflow cases. Shifts starts at today and finishes tomorrow
                if (this.formatDate(rosterTemp[i].assignments[j].shift_details.start_time).getDate() != this.formatDate(rosterTemp[i].assignments[j].shift_details.end_time).getDate() && origin != "dailyView") {
                    totalElements++;
                    let dateTemp = new Date('2018-01-01T00:00');
                    let customUserWidth = this.checkHourDiff(this.formatDate(dateTemp), this.formatDate(endDate));
                    if (parseInt(i) < rosterTemp.length - 1) {
                        overFlowFlag = true;
                        let downShiftOverFlow = (rosterTemp[i].assignments.length - (parseInt(j) + 1)) * (5 + rectYHeight) + 5 + rectYHeight + 25 + overFlowCount * (rectYHeight + 5);
                        overFlowCount++;
                        if (origin != "fleetView") {
                            if (rosterTemp[i].assignments[j].fleet_details || iterDate >= currDate) {
                                // Object to control overflow shift rectangle
                                let tempOverFlowShifts = {
                                    'x': dayColumnWidth, 'y': rowHeight + indentTop + downShiftOverFlow, 'width': timeWidth * (customUserWidth), 'height': rectYHeight,
                                    style: {
                                        fill: shiftColor
                                    },
                                    data: rosterTemp[i].assignments[j], 'uibText': rosterTemp[i].assignments[j].fleet_details ? rosterTemp[i].assignments[j].fleet_details.employee ? rosterTemp[i].assignments[j].fleet_details.employee.employee_number + " " + rosterTemp[i].assignments[j].fleet_details.display_name : "Missing Employee number" : " Not Assigned"
                                };
                                overFlowShifts.push(tempOverFlowShifts);
                            }
                        }
                        else if (origin == "fleetView") {
                            // Object to control overflow shift rectangle
                            let tempOverFlowShifts = {
                                'x': dayColumnWidth, 'y': rowHeight + indentTop + downShiftOverFlow + 10, 'width': timeWidth * (customUserWidth), 'height': rectYHeight,
                                style: {
                                    fill: shiftColor
                                },
                                data: rosterTemp[i].assignments[j], 'uibText': rosterTemp[i].assignments[j].shift_details.venue.name
                            };
                            overFlowShifts.push(tempOverFlowShifts);
                        }

                        let text;
                        if (rosterTemp[i].assignments[j].fleet_details != null && rosterTemp[i].assignments[j].fleet_details.employee) {
                            text = rosterTemp[i].assignments[j].fleet_details.employee.employee_number + "   " + "  " + rosterTemp[i].assignments[j].fleet_details.display_name + "   " + "   " + startDate.substring(11, 19) + "   " + endDate.substring(11, 19);
                            if ((countApproved || countUnApproved || countManualPunch) && rosterTemp[i].assignments[j].shift_details.active) {
                                text = text + " | P: " + countApproved + "hrs | A: " + countUnApproved + "hrs | MP: " + countManualPunch;
                            }
                        }
                        else if (rosterTemp[i].assignments[j].fleet_details == null) {
                            text = "Not Assigned"
                        }
                        else {
                            text = " ";
                        }
                        if (origin == "fleetView") {
                            text = rosterTemp[i].assignments[j].shift_details.venue.name + " " + " " + startDate.substring(11, 19) + " " + endDate.substring(11, 19);
                        }
                        // Object to control overflow shift Text
                        if (rosterTemp[i].assignments[j].fleet_details || iterDate >= currDate) {
                            let tempOverFlowShiftText = {
                                'text': text, 'x': dayColumnWidth + 5, 'y': rowHeight + indentTop + downShiftOverFlow + 14, data: rosterTemp[i].assignments[j],
                                style: {
                                    fill: 'white',
                                    letterSpacing: 1.5
                                }
                            };
                            shiftOverflowText.push(tempOverFlowShiftText);
                        }
                        else if (origin == "fleetView") {
                            // Object to control overflow shift rectangle
                            let tempOverFlowShiftText = {
                                'text': text, 'x': dayColumnWidth + 5, 'y': rowHeight + indentTop + downShiftOverFlow + 14 + 10, data: rosterTemp[i].assignments[j],
                                style: {
                                    fill: 'white',
                                    letterSpacing: 1.5
                                }
                            };
                            shiftOverflowText.push(tempOverFlowShiftText);
                        }
                    }

                }

                // Draw shifts
                if ((rosterTemp[i].assignments[j].fleet_details || iterDate >= currDate) && origin != "fleetView") {
                    // Objects to control shifts, their color, etc
                    if (tempFlag && punchFlag) {
                        let tempManualPunch = {
                            'text': '\uf0a6', 'x': dayColumnWidth + timeWidth * (startHour) - 20, 'y': rowHeight + indentTop + 14, data: rosterTemp[i].assignments[j], 'style': "fill:black; letter-spacing:1.5;"
                        };
                        manualPunch.push(tempManualPunch);
                        punchFlag = false;
                    }
                    let tempShiftRect = {
                        'x': dayColumnWidth + timeWidth * (startHour), 'y': rowHeight + indentTop, 'width': timeWidth * (userWidth), 'height': rectYHeight,
                        style: {
                            fill: shiftColor,
                        },
                        data: rosterTemp[i].assignments[j], 'uibText': rosterTemp[i].assignments[j].fleet_details ? rosterTemp[i].assignments[j].fleet_details.employee ? rosterTemp[i].assignments[j].fleet_details.employee.employee_number + " " + rosterTemp[i].assignments[j].fleet_details.display_name : "Missing Employee number" : "Not Assigned"
                    };
                    shiftRects.push(tempShiftRect);
                }
                // If origin is from Employee roster neglect the dates
                else if (origin == "fleetView") {
                    if (tempFlag && punchFlag) {
                        let tempManualPunch = {
                            'text': '\uf0a6', 'x': dayColumnWidth + timeWidth * (startHour) - 20, 'y': rowHeight + indentTop + 14, data: rosterTemp[i].assignments[j],
                            style: {
                                fill: 'black',
                                letterSpacing: 1.5
                            }
                        };
                        manualPunch.push(tempManualPunch);
                    }
                    let tempShiftRect = {
                        'x': dayColumnWidth + timeWidth * (startHour), 'y': rowHeight + indentTop, 'width': timeWidth * (userWidth), 'height': rectYHeight,
                        style: {
                            fill: shiftColor,
                        },
                        data: rosterTemp[i].assignments[j], 'uibText': rosterTemp[i].assignments[j].shift_details.venue.name
                    };
                    shiftRects.push(tempShiftRect);
                    punchFlag = false;
                }
                let text;
                if (origin != "fleetView") {
                    if (rosterTemp[i].assignments[j].fleet_details != null && rosterTemp[i].assignments[j].fleet_details.employee) {
                        text = rosterTemp[i].assignments[j].fleet_details.employee.employee_number + "   " + "  " + rosterTemp[i].assignments[j].fleet_details.display_name + "   " + "   " + startDate.substring(11, 19) + "   " + endDate.substring(11, 19);
                        if (tempFlag) {
                            text = text + " | P: " + countApproved + "hrs | A: " + countUnApproved + "hrs | MP: " + countManualPunch;

                        }
                    }
                    else if (rosterTemp[i].assignments[j].fleet_details == null) {
                        text = "Not Assigned"
                    }
                    else {
                        text = " ";
                    }
                }
                if (origin == "fleetView") {
                    text = rosterTemp[i].assignments[j].shift_details.venue.name + " " + " " + startDate.substring(11, 19) + " " + endDate.substring(11, 19);
                    if (tempFlag) {
                        text = text + " | P: " + countApproved + "hrs | A: " + countUnApproved + "hrs | MP: " + countManualPunch;

                    }
                }
                let tempShiftText = {
                    'text': text, 'x': dayColumnWidth + timeWidth * (startHour) + 20, 'y': rowHeight + indentTop + 14, data: rosterTemp[i].assignments[j],
                    style: {
                        fill: 'white',
                        letterSpacing: 1.5
                    }
                };

                shiftTexts.push(tempShiftText);
                tempFlag = false;
            }
            rowHeight = rowHeight + startY;
        }
        //selfHeight = totalElements * rectYHeight + 10  * (totalElements-1) + rosterTemp.length * 50;
        selfHeight = (- rosterTemp.length * (25 + 10 + 20) + totalElements * (25 + 10 + 25)) * 8;
        timeDivisionWidth = parseInt(timeWidth)
        this.setState({ marginLine, selfHeight, pickupDrops, shiftRects, columnText, shiftTexts, leftButtons, overFlowShifts, shiftOverflowText, partitionRect, multiColor, manualPunch, customAddButtons, selfWidth, timeDivisionWidth });
    }

    render() {

        const { dayColumn, marginLine, pickupDrops, shiftRects, columnText, shiftTexts, leftButtons, overFlowShifts, shiftOverflowText, partitionRect, multiColor, manualPunch, customAddButtons, selfHeight, selfWidth, dayColumnWidth, hours, timeDivisionWidth } = this.state
        // console.log("hello", this.state);
        return (
            <div>
                <div hl-sticky="" style={{ background: 'white', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', 'padding-left': dayColumnWidth + timeDivisionWidth / 2 }}>
                        {
                            hours.map((item, key) =>
                                item < 9 ?
                                    <div style={{width: timeDivisionWidth}}>
                                        {item}
                                    </div> :
                                    <div style={{width: timeDivisionWidth + 4}}>
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
                            dayColumn.map((day, key) => <rect key={key} x={day.x} y={day.y} width={day.width} height={day.height} style={day.style} />)
                        }
                        {/* <rect ng-repeat="rect in roster.dayColumn" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}" ng-attr-height="{{rect.height}}"
                        ng-attr-style="{{rect.style}}" /> */}

                        {
                            columnText.map((text, key) => <text key={key} x={text.x} y={text.y} style={text.style} textAnchor="middle">{text.text}</text>)
                        }
                        {/* <text ng-repeat="text in roster.columnText" ng-attr-x="{{text.x}}" ng-attr-y="{{text.y}}" ng-attr-style="{{text.style}}"
                        text-anchor="middle">{{ text.text }} </text> */}

                        {
                            partitionRect.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} />)
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
                            pickupDrops.map((text, key) => <text key={key} x={text.x + 10} y={text.y + 13} style={{ fill: '#039BE5' }} textAnchor="middle" >{text.textPickup}</text>)

                        }
                        {/* <text ng-repeat="text in roster.pickupDrops" ng-attr-x="{{text.x + 10}}" ng-attr-y="{{text.y + 13}}" style="fill: #039BE5">{{ text.textPickup }}</text> */}
                        {
                            pickupDrops.map((text, key) => <text key={key} x={text.x + 35} y={text.y + 13} style={{ fill: '#8E24AA' }} textAnchor="middle" >{text.textDrop}</text>)

                        }
                        {/* <text ng-repeat="text in roster.pickupDrops" ng-attr-x="{{text.x + 35}}" ng-attr-y="{{text.y + 13}}" style="fill: #8E24AA;">{{ text.textDrop }}</text> */}

                        {
                            shiftRects.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} className="cursor-pointer"><title>{rect.uibText}</title></rect>)
                        }

                        {/* <rect ng-repeat="rect in roster.shiftRects" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.shiftClick(rect.data)" className="cursor-pointer">
                        <title>{{ rect.uibText }}</title>
                    </rect> */}

                        {
                            shiftTexts.map((text, key) => <text key={key} x={text.x} y={text.y} style={text.style} className="cursor-pointer">{text.text} <title>{text.text}</title></text>)

                        }
                        {/* <text ng-repeat="text in roster.shiftTexts" ng-attr-x="{{text.x}}" ng-attr-y="{{text.y}}" className="cursor-pointer" ng-click="roster.shiftClick(text.data)"
                        ng-attr-style="{{text.style}}">{{ text.text }}
                        <title>{{ text.text }}</title>
                    </text> */}
                        {
                            overFlowShifts.map((rect, key) => <rect key={key} x={rect.x} y={rect.y} width={rect.width} height={rect.height} style={rect.style} className="cursor-pointer"><title>{rect.uibText}</title></rect>)

                        }
                        {/* <rect ng-repeat="rect in roster.overFlowShifts" ng-attr-x="{{rect.x}}" ng-attr-y="{{rect.y}}" ng-attr-width="{{rect.width}}"
                        ng-attr-height="{{rect.height}}" ng-attr-style="{{rect.style}}" ng-click="roster.shiftClick(rect.data)" className="cursor-pointer">
                        <title>{{ rect.uibText }}</title>
                    </rect> */}

                        {
                            shiftOverflowText.map((text, key) => <text key={key} x={text.x} y={text.y} style={text.style} textAnchor="middle" className="cursor-pointer">{text.text} <title>{text.text}</title></text>)

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
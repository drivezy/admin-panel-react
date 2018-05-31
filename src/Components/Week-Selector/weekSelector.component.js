import React, { Component } from 'react';

import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';
import moment from 'moment'


export default class WeekSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weeks: props.weeks,
            minLimit: props.minLimit,
            maxLimit: props.maxLimit,
            week: props.week
        }
    }

    selectWeek = (data) => {
        this.setState({ week: data });
        this.props.onChange(data);
    }

    render() {
        const { weeks = [], minLimit, maxLimit, week } = this.state;
        let limit;
        for (limit = -(minLimit); limit <= (maxLimit); limit++) {
            let start = moment().add(limit, 'week').startOf('week').add(1, 'day').format('ddd DD MMM YY');
            let end = moment(start).endOf('week').add(1, 'day').format('ddd DD MMM YY');
            let shiftDate = moment().add(limit, 'week').startOf('week').add(1, 'day').format('YYYY-MM-DD');
            let shiftStartDate = moment().add(limit, 'week').startOf('week').add(1, 'day').format('YYYY-MM-DD');
            let shiftEndDate = moment(start).endOf('week').add(1, 'day').format('YYYY-MM-DD');
            let timeSlot = start + ' to ' + end;
            weeks.push({ startDate: start, endDate: end, timeSlot: timeSlot, shiftDate: shiftDate, shiftStartDate: shiftStartDate, shiftEndDate: shiftEndDate, });
        }
        return (
            <div className="week-selector">
                {
                    weeks.length &&
                    <SelectBox
                        onChange={(data) => this.selectWeek(data)}
                        options={weeks}
                        placeholder="Week"
                        field='timeSlot'
                        value={week}
                    />
                }
            </div>
        )
    }
}

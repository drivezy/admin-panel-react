import GLOBAL from './../Constants/global.constants';
const moment = require('moment');


export function GetTime({ dateTime, format } = {}) {
    const dt = dateTime ? new Date(dateTime) : moment();
    console.log(format || GLOBAL.API_DATE_TIME_FORMAT);
    return moment(dt).format(format || GLOBAL.API_DATE_TIME_FORMAT);
}

export function ConvertLiteral(description) {
    return eval(description);
}

/**
 * Function to convert seconds to mm:ss format
 * @param  {number} secs
 */
export function ConvertToMMSS(secs) {
    let Seconds = secs;
    let minutes = Math.floor(Seconds / 60);
    Seconds = Seconds % 60;
    minutes = minutes % 60;
    return `${Padding(minutes)}:${Padding(Seconds)}`;
}

/**
 * Can Add or Subtract time from given time param
 * @param  {string} {time - base time to be added or subtracted
 * @param  {number} value - for e.x. if paramName is 'minutes' and 15 is value, means it would add or subtract 15 minutes
 * @param  {string} paramName - can be minutes, hours, seconds (default is minutes)
 * @param  {string} format} - default is API_DATE_TIME_FORMAT
 * @param  {string} method} -  can be add or subtract (default is add)
 */
export function CalculateTime({ time, value, paramName, format, method }) {
    method = method || 'add';
    const newTime = time || GetTime({ format });
    return moment(newTime)[method](value, paramName || 'minutes').format(format || GLOBAL.API_DATE_TIME_FORMAT);
}

export function ConvertToDisplayformat(time) {
    return moment(time).format(GLOBAL.DISPLAY_DATE_FORMAT);
}

export function ReturnTimeObject(time) {
    return {
        hour: moment(time).format('hh'),
        minute: moment(time).format('mm'),
        mode: moment(time).format('a')
    };
}

export function TimeOperation({ method, parameter, value, format, time = null }) {
    const dateTime = time ? moment(time) : moment();
    return time ? moment(time)[method](value, parameter).format(format) : moment()[method](value, parameter).format(format);
    // moment().subtract(1, "day").format(this.dateFormat);

}

export function SetTimeInExistingDate(newDate, existingdateTime) {
    if (!newDate || !existingdateTime) return;
    return newDate.set({
        'hour': existingdateTime.get('hour'),
        'minute': existingdateTime.get('minute'),
        'second': existingdateTime.get('second')
    })
}
/**
 * Function to add Paddingding of 0 if number id sigle digit
 * @param  {number} num
 */
function Padding(num) {
    return `0${num}`.slice(-2);
}
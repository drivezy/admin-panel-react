/**
 * Component for Track History
 */
import React, { Component } from "react";
import Slider from "react-rangeslider";
import 'react-rangeslider/lib/index.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { StoreEvent, SubscribeToEvent } from 'state-manager-utility';

import TimeSpeedChart from './../../Components/Highcharts/TimeChart/timeChart.component';
import TrackMap from './../../Components/Track-Map/trackMap.component';

const style = {display: 'flex',justifyContent: 'space-around',padding: '0px'};
var Timer;

export default class TrackHistoryComponent extends React.Component {
    speedArr = [{ displayName: "1x", value: 1000 }, 
        { displayName: "2x", value: 500 }, { displayName: "4x", value: 250}, 
        { displayName: "8x", value: 125 }, { displayName: "16x", value: 65 },
        { displayName: "32x", value: 30}, { displayName: "64x", value: 15 }];
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            alarms:this.props.alarms,
            alerts: this.props.alerts,
            alertPreference: this.props.alertPreference,
            currentPosition : 0,
            playFlag : 0,
            playSpeed : this.speedArr[0],
            currentSpeedIndex : 0,
            trackHistoryObj : {},
            difference: 60,
            noCount: 0
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.data.length){
            let temp = new Date(nextProps.data[0].time);
            let difference;
            nextProps.data.map((item) => {
                let currentTime = new Date(item.time);
                item.timeInSeconds = parseInt((currentTime.getTime() - temp.getTime())/1000);
            })
            let startTime = nextProps.data.length ? nextProps.data[0].timeInSeconds : '';
            let endTime = nextProps.data.length ? nextProps.data[nextProps.data.length-1].timeInSeconds : '';
            let data = nextProps.data || [];
            let currentPosition = startTime;
            let temphistoryObj = data;
            if(data.length>=2){
                difference = data[1].timeInSeconds - data[0].timeInSeconds;
            }
            let speedArr = [];
            for (var i = 0; i < temphistoryObj.length; i++) {
                let speedObj = temphistoryObj[i];
                let date = moment(speedObj.time).unix() * 1000;
                let obj = [date, parseFloat(parseFloat(speedObj.speed).toFixed(1))];
                speedArr.push(obj);
            }
            let trackHistoryObj = {
                history : data,
                noCount : 0,
            }
            this.setState({ data, startTime, endTime, currentPosition, speedArr, trackHistoryObj, difference});
        }
        if(nextProps.alertPreference && nextProps.alarms && nextProps.alarms.length && nextProps.alerts && nextProps.alerts.length){
            if(nextProps.alertPreference){
                StoreEvent({eventName: 'alertPreferenceChanged', data: {alertPreference: nextProps.alertPreference, alarms: nextProps.alarms, alerts: nextProps.alerts} });
            }
        }
    }

    pushTillGivenIndex = (noCount) => {
        let trackHistoryObj = {
            history : this.state.data.slice(0,noCount)
        }
        StoreEvent({eventName: 'trackHistoryObj', data: trackHistoryObj })
    }

  forward = () => {
    let { noCount} = this.state;
    if(noCount < this.state.data.length){
        noCount++;
        let currentPosition = this.state.data[noCount].timeInSeconds;
        this.pushTillGivenIndex(noCount);
        this.setState({noCount, currentPosition});
    }
  };
  backward = () => {
    let { noCount} = this.state;
    if(noCount > 0){
        noCount--;
        let currentPosition = this.state.data[noCount].timeInSeconds;
        this.pushTillGivenIndex(noCount, currentPosition);
        this.setState({noCount});
    }
  };
  play = () => {
    this.setState({playFlag: 1})
    let {currentPosition, noCount, endTime, playSpeed} = this.state;
    console.log(this.state);
    Timer = setInterval(()=>{
        noCount++;
        currentPosition = this.state.data[noCount].timeInSeconds;
        console.log(this.state.data[noCount].timeInSeconds);
        this.pushTillGivenIndex(noCount);
        this.setState({ noCount, currentPosition });
        if(noCount >= this.state.data.length){
            clearInterval(Timer);
            Timer=0;
        }
    }, playSpeed.value)
      
  };
  pause = () => {
    this.setState({playFlag: 0});
    clearInterval(Timer);
    Timer = 0;
  };
  speedChanged = (isIncreased) => {
      let { currentSpeedIndex, playSpeed } = this.state;
        let length = this.speedArr.length - 1;
        let temp = isIncreased ? currentSpeedIndex + 1 : currentSpeedIndex - 1;
        if (temp <= length && temp >= 0) {
            currentSpeedIndex = temp;
            playSpeed = this.speedArr[temp];
        }
        this.setState({currentSpeedIndex, playSpeed})
  };

  speedGraphClicked = (index) => {
        if(Timer){
            this.setState({playFlag: 0});
            clearInterval(Timer);
            Timer = 0;
        }
        let noCount = index;
        let currentPosition = this.state.data[index].timeInSeconds;
        this.pushTillGivenIndex(noCount);
        this.setState({currentPosition, noCount});
  };

  handleChange = (value) => {
    if(Timer){
        this.setState({playFlag: 0});
        clearInterval(Timer);
        Timer = 0;
    }
      console.log(value);
      console.log(this.state.difference);
    this.setCurrentIndex(value);
    let currentPosition = value;
    this.setState({ currentPosition });
  }

    secondsToHms = (d) => {
        d = Number(d);
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);

        let hDisplay = h > 0 ? h : "00";
        let mDisplay = m > 0 ? m : "00";
        let sDisplay = s > 0 ? s : "00";
        return hDisplay + ':' + mDisplay + ':' + sDisplay; 
    }

  setCurrentIndex = (value) => {
      let noCount , f=0;
      this.state.data.map((item, key) => {
            if(item.timeInSeconds >= value && f== 0){
                noCount = key;
                f = 1;
            }
      })
      this.pushTillGivenIndex(noCount);
      this.setState({noCount});
  }

  render() {
    const {startTime, endTime, currentPosition, difference, alarms, alerts, alertPreference, playFlag, data, playSpeed, speedArr} = this.state;
    return (
      <div>
         <div className="Flexible-container">
         {
             data && data.length &&
            <TrackMap data={data} alarms={alarms} alerts={alerts} alertPreference={alertPreference} />
         }
        </div>
        <div style={style} className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div style={style} className="col-lg-3 col-md-3 col-sm-12 col-xs-12 black-text">
            <div className="" onClick={() =>this.forward()}>
              <i  style={{fontSize: '22px', paddingTop: '15px'}} className="fa fa-step-backward" aria-hidden="true" />
            </div>
            {
                !playFlag ?
                (<div className="" onClick={() => this.play()}>
                <i style={{fontSize: '22px', paddingTop: '15px'}} className="fa fa-play" aria-hidden="true" />
                </div>)
                :
                (<div className="" onClick={() => this.pause()}>
                <i style={{fontSize: '22px', paddingTop: '15px'}} className="fa fa-pause" aria-hidden="true" />
                </div>)
            }
            <div className="" onClick={() => this.backward}>
              <i style={{fontSize: '22px', paddingTop: '15px'}} className="fa fa-step-forward" aria-hidden="true" />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 opacity-8 space-around align-center speed-container">
                <div className="" onClick={() => this.speedChanged(false)}>
                    <i style={{fontSize: '20px', paddingTop: '18px'}} className="fa fa-minus-circle" aria-hidden="true" />
                </div>
                <div style={{paddingTop: '15px',fontSize: '16px'}}>{playSpeed.displayName}</div>
                <div className="" onClick={() => this.speedChanged(true)}>
                    <i style={{fontSize: '20px', paddingTop: '18px'}} className="fa fa-plus-circle" aria-hidden="true" />
                </div>
            </div>
          </div>
          <div style={{paddingTop: '22px', textAlign: 'center'}} className="col-lg-1 col-md-1 col-sm-2 col-xs-2 margin-top-4 font-12 roboto-regular opacity-7 black-text">
            {this.secondsToHms(currentPosition)}
          </div>
          <div style={{paddingTop: '5px'}} className="col-lg-7 slider">
            <Slider
              min={startTime}
              max={endTime}
              step={difference}
              value={currentPosition}
              tooltip={false}
              onChange={this.handleChange}
            />
          </div>
          <div style={{paddingTop: '22px', textAlign: 'center'}} className="col-lg-1 col-md-1 col-sm-2 col-xs-2 margin-top-4 font-12 roboto-regular opacity-7 black-text">
            {this.secondsToHms(endTime)}
          </div>
          
        </div>
        <div>
            {
                speedArr && speedArr.length &&
            <TimeSpeedChart
                    title={"Speed graph"} subtitle={''} X={''} Ytitle={"Speed (kmph)"} tooltip={''} Y={speedArr} clickedMethod={this.speedGraphClicked}
                />
            }
                </div>
      </div>
    );
  }
}

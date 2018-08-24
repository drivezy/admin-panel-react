/**
 * Component for Track History
 */
import React, { Component } from "react";
import Slider from "react-rangeslider";
import 'react-rangeslider/lib/index.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { TrackVehicleFactory } from './../../Utils/trackVehicle.utils';
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
            currentPosition : 0,
            playFlag : 0,
            playSpeed : this.speedArr[0],
            currentSpeedIndex : 0,
            step: 10,
            trackHistoryObj : {},
            difference: 30
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
                currentPosition : 0
            }
            this.setState({ data, startTime, endTime, currentPosition, speedArr, trackHistoryObj, difference});
        }
    }

    pushTillGivenIndex = (time) => {
        let i = 0;
        let trackHistoryObj = { history : []};
        while(this.state.data[i].timeInSeconds < time){
            trackHistoryObj.history.push(this.state.data[i]);
            i++;
        }
        trackHistoryObj.currentPosition = i;
        StoreEvent({eventName: 'trackHistoryObj', data: trackHistoryObj })
    }

  forward = () => {
    let {currentPosition, step, endTime} = this.state;
    if(currentPosition < endTime && currentPosition+step <= endTime){
        currentPosition = currentPosition+step;
        this.pushTillGivenIndex(currentPosition);
        this.setState({currentPosition})
    }
  };
  backward = () => {
    let {currentPosition, step, endTime} = this.state;
    if(currentPosition > 0 && currentPosition-step >= 0){
        currentPosition = currentPosition-step;
        this.pushTillGivenIndex(currentPosition);
        this.setState({currentPosition})
    }
  };
  play = () => {
    this.setState({playFlag: 1})
    let {currentPosition, step, endTime} = this.state;
    let counter = currentPosition;
    Timer = setInterval(()=>{
        counter+=step;
        this.pushTillGivenIndex(counter);
        this.setState({currentPosition: counter });
        if(counter >= endTime || !this.state.playFlag){
            clearInterval(Timer);
            Timer=0;
        }
    }, 1000)
      
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
            playSpeed.selected = this.speedArr[temp];
        }
        this.setState({currentSpeedIndex, playSpeed})
  };

  speedGraphClicked = (index) => {
        let currentPosition = this.state.data[index].timeInSeconds;
        this.pushTillGivenIndex(currentPosition);
        this.setState({currentPosition});
  };

  handleChange = (value) => {
    this.setState({ currentPosition: value })
    this.pushTillGivenIndex(value);
  }

  render() {
    const {startTime, endTime, currentPosition, playFlag, data, playSpeed, step, speedArr} = this.state;
    return (
      <div>
         <div className="Flexible-container">
         {
             data && data.length &&
            <TrackMap data={data} />
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
            {currentPosition}
          </div>
          <div style={{paddingTop: '5px'}} className="col-lg-7 slider">
            <Slider
              min={startTime}
              max={endTime}
              step={playSpeed.value}
              value={currentPosition}
              tooltip={false}
              onChange={this.handleChange}
            />
          </div>
          <div style={{paddingTop: '22px', textAlign: 'center'}} className="col-lg-1 col-md-1 col-sm-2 col-xs-2 margin-top-4 font-12 roboto-regular opacity-7 black-text">
            {endTime}
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

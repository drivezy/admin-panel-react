import React, { Component } from 'react'

import Highcharts from 'highcharts'

var divStyle = {
    height: '450px',
    width: '300px',
}
var colors= ['#e8e9ed', '#b9bdcb', '#8b90a8', '#5b6484', '#5a6384']

export default class TimeSpeedChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        }
    };
    
    componentDidMount() {
        let data = this.props.Y;
        let clickedMethod = this.props.clickedMethod
        var chart = Highcharts.chart('container', {
            chart: {
                zoomType: "x"
            }, title: {
                text: this.props.title
            }, subtitle: {
                text:  this.props.subtitle
            }, xAxis: {
                type: "datetime"
            }, yAxis: {
                title: {
                    text:  this.props.Ytitle
                }, min: 0
            }, legend: {
                enabled: false
            }, exporting: {
                enabled: false
            }, plotOptions: {
                area: {
                    point: {
                        events: {
                            click: function (e) {
                                console.log(this);
                                clickedMethod(this.index);
                            }
                        }
                    }, marker: {
                        radius: 2
                    }, lineWidth: 1, states: {
                        hover: {
                            lineWidth: 1
                        }
                    }, threshold: null
                }
            }, series: [{
                type: "area", name: "speed", data: data
            }]
          });
    }
    
    render() {
        return (
            <div id="container" style={{minWidth: '310px', height: '300px', margin: '0 auto'}}></div>
        );
    }
}





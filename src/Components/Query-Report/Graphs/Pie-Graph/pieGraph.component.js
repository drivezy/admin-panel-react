import React from 'react';

import ReactHighcharts from 'react-highcharts'; // Expects that Highcharts was loaded in the code.

export default class PieGraph extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ...this.setConfig(props.config)
        };
    }

    setConfig = (graph) => {
        return {
            config: {
                height: 100,
                width: '500px',
                chart: {
                    type: 'pie',
                    events: {
                        load: function () {
                            // scope.pieGraph.showGraph = true;
                        }
                    }
                },
                exporting: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tooltip: {
                    pointFormat: "{series.name}: <b>{point.y}</b>"
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    name: graph.yAxis.split('_').join(' '),
                    data: graph.graphData
                }]
            }
        }
    }

    render() {

        const { config } = this.state;

        return <div>
            <ReactHighcharts config={config} />
        </div>;
    }
}


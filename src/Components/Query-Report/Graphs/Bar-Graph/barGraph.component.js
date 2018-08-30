import React from 'react';

import ReactHighcharts from 'react-highcharts'; // Expects that Highcharts was loaded in the code.

export default class BarGraph extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ...this.setConfig(props.config)
    };
  }

  setConfig = (graph) => {
    return {
      config: {
        chart: {
          type: "column",
          //   events: {
          //   load: function () {
          //     scope.barGraph.showGraph = true;
          //   }
          // }
        },
        series: graph.graphData,
        title: {
          text: ''
        },
        subtitle: {
          text: ""
        },
        xAxis: {
          categories: graph.categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: graph.yAxis.split('_').join(' ')
          }
        },
        tooltip: {
          headerFormat: "<span style=\"font-size:10px\">{point.key}</span><table>",
          pointFormat: "<tr><td style=\"color:{series.color};padding:0\">" + graph.yAxis.split('_').join(' ') + ": </td>" + "<td style=\"padding:0\"><b>{point.y}</b></td></tr>",
          footerFormat: "</table>",
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2, borderWidth: 0
          }
        }
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


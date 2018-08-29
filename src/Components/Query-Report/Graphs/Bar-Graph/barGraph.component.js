import React from 'react';

import ReactHighcharts from 'react-highcharts'; // Expects that Highcharts was loaded in the code.

export default class BarGraph extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      config: this.props.config
    };
  }

  render() {

    const { config } = this.state;

    return <div>
      <ReactHighcharts config={config} />
    </div>;
  }
}


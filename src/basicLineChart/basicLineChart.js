import React, { Component } from 'react';
import * as d3 from 'd3';

export default class BasicLineChartI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 960,
      height: 500,
      margin: {
        top: 20,
        right: 30,
        bottom: 40,
        left: 430
      },
      data: [
        {
          name: 'A',
          value: 12
        },
        {
          name: 'B',
          value: 15
        },
        {
          name: 'C',
          value: 17
        },
        {
          name: 'D',
          value: 10
        },
        {
          name: 'E',
          value: 19
        },
        {
          name: 'F',
          value: 20
        },
      ]
    };
  }

  renderChart = () => {
    const { width, height, margin, data } = this.state;

    // 创建x比例尺
    let x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.left, width - margin.right]);

    // 创建y比例尺
    let y = d3.scaleLinear()
        .domain(data.map(d => d.value))
        .range([height - margin.bottom, margin.top]);

    // 创建x横轴
    let xAxis = g => g.attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom().tickSizeOuter(0));

    // 创建y纵轴
    let yAxis = g => g.attr('transform', `translate()`)
  };

  componentDidMount() {

  }

  render() {
    return (
        <svg></svg>
    );
  }
}

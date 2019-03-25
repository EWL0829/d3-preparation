import React, { Component } from 'react';
import './arcPadding.css';
import * as d3 from 'd3';

class ArcPadding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [1, 1, 2, 3, 5, 8, 13, 21],
      width: 960,
      height: 500,
    };
  }

  // 生成颜色合集
  generateColor = (index) => {
    return d3.schemeCategory10[index];
  };

  componentDidMount() {
    const { width, height, data } = this.state;

    let radius = height / 2 - 10;

    // 创建弧形
    let arc = d3.arc()
        .innerRadius(radius - 40)
        .outerRadius(radius);

    let pie = d3.pie().padAngle(.02);

    var svg = d3.select('svg')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .style('fill', () => {
          return '#fff';
        })
        .style("fill", (d, i) => {
          return this.generateColor(i);
        })
        .attr("d", arc);
  }

  render() {
    return (
        <svg></svg>
    );
  }
}

export default ArcPadding;

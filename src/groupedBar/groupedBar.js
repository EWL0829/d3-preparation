import React, { Component } from 'react';
import './groupedBar.css';
import * as d3 from 'd3';

class GroupedBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 960,
      height: 500,
      margin: {
        top: 20,
        right: 30,
        bottom: 30,
        left: 40,
      },
      samplesCount: 20,
      seriesCount: 4,
    };
  }

  componentDidMount() {
    const { width, height, margin, samplesCount, seriesCount } = this.state;
    const { top, right, bottom, left } = margin;

    let realWidth = width - left - right,
        realHeight = height - top - bottom;

    const data = d3.range(seriesCount)
        .map(() => {
          return d3.range(samplesCount).map(Math.random);
        });

    // y比例尺
    let yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([realHeight, 0]);

    // 外层x比例尺
    let x0 = d3.scaleBand()
        .domain(d3.range(samplesCount))
        .range([0, realWidth])
        .paddingOuter(.2)
        .paddingInner(.2);

    // 内层x比例尺
    let x1 = d3.scaleBand()
        .domain(d3.range(seriesCount))
        .range([0, x0.bandwidth()]);

    let z = d3.schemeCategory10;

    let xAxis = d3.axisBottom()
        .scale(x0);

    let yAxis = d3.axisLeft()
        .scale(yScale);

    let svg = d3.select('svg')
        .attr('width', realWidth + left + right)
        .attr('height', realHeight + top + bottom)
        .append('g')
        .attr('transform', `translate(${left}, ${top})`);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${realHeight})`)
        .call(xAxis);

    svg.append("g").selectAll("g")
        .data(data)
        .enter().append("g")
        .style("fill", function (d, i) {
          return z[i];
        })
        .attr("transform", function (d, i) {
          return `translate(${x1(i)}, 0)`;
        })
        .selectAll("rect")
        .data(function (d) {
          return d;
        })
        .enter().append("rect")
        .attr("width", x1.bandwidth())
        .attr("height", yScale)
        .attr("x", function (d, i) {
          return x0(i);
        })
        .attr("y", function (d) {
          return realHeight - yScale(d);
        });
  }

  render() {
    return (
        <svg></svg>
    );
  }
}

export default GroupedBar;

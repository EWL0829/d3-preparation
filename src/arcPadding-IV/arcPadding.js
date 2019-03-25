import React, { Component } from 'react';
import * as d3 from 'd3';
import './arcPadding.css';

class ArcPadding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 960,
      height: 500,
      data: [1, 1, 2, 3, 5, 8, 13, 21],
    };
  }

  componentDidMount() {
    const { width, height, data } = this.state;

    let outerRadius = height / 2 - 30,
        innerRadius = outerRadius * 2 / 3;

    let color = d3.schemeCategory10;

    let pie = d3.pie().padAngle(.03);

    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    let svg = d3.select('svg')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let straightPath = svg.append("g")
        .attr("class", "paths--straight")
        .selectAll("path")
        .data(data)
        .enter().append("path");

    let roundPath = svg.append("g")
        .attr("class", "paths--round")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .style('fill', (d, i) => {
          return color[i];
        })
        .style("fill-opacity", .25);

    let ease = d3.transition().ease(),
        duration = 2500;

    let timerId =d3.timer((elapsed) => {
      let t = ease(1 - Math.abs((elapsed % duration) / duration - .5) * 2),
          arcs = pie(data);

      straightPath.data(arcs).attr("d", arc.cornerRadius(0));
      roundPath.data(arcs).attr("d", arc.cornerRadius((outerRadius - innerRadius) / 2 * t));

      if (elapsed >= 2500) {
        timerId.stop();
      }
    });
  }

  render() {
    return (
        <svg></svg>
    );
  }
}

export default ArcPadding;

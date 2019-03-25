import React, { Component } from 'react';
import './arcPadding.css';
import * as d3 from 'd3';

class ArcPadding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 960,
      height: 500,
      data: [1, 1, 2, 3, 5, 8, 13],
    };
  }

  componentDidMount() {
    const { width, height, data } = this.state;

    let outerRadius = height / 2 - 30;
    let innerRadius = outerRadius / 3;

    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cornerRadius(12);

    let svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    let path = svg.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .style('fill', (d, i) => {
          return d3.schemeCategory10[i];
        })
        .style('fill-opacity', .25);

    let pie = d3.pie();

    let ease = d3.transition().ease(),
        duration = 7500;

    let timerId = d3.timer((elapsed) => {
      var t = ease(1 - Math.abs((elapsed % duration) / duration - .5) * 2);

      path.data(pie.padAngle(t * 2 * Math.PI / data.length)(data))
          .attr("d", arc);

      if (elapsed >= 7500) {
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

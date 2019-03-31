import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Loading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 500,
      height: 100,
    };
  }

  componentDidMount() {
    const { width, height } = this.state;
    const data = [
      {
        val: 1,
      },
      {
        val: 2,
      },
      {
        val: 3,
      },
      {
        val: 4,
      },
      {
        val: 5,
      },
    ];


    let bounce = (selection, duration) => {
      selection.transition()
          .ease(d3.easeBounce)
          .duration(d => {
            return d.val * 150
          })
          .attrTween('cx', (d) => {
            return d3.interpolate(`${d.val * 3 + 5}%`, `${d.val * 3}%`)
          });

      setTimeout(() => { bounce(selection, duration); }, duration)
    };

    let svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    let circle = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .classed('circle', true)
        .attr('cx', (d) => {
          return `${d.val * 3}%`;
        })
        .attr('cy', '50%')
        .attr('r', 3)
        .attr('fill', 'steelblue')
        .call(bounce, 1000);
  }

  render() {
    return (
        <svg></svg>
    )
  }
}

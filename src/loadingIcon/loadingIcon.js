import React, { Component } from 'react';
import * as d3 from 'd3';
import './loadingIcon.css';

export default class Loading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 300,
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
            return d3.interpolate(`${d.val * 16 + 16}%`, `${d.val * 16}%`)
          });

      setTimeout(() => { bounce(selection, duration); }, duration)
    };

    let svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .classed('circle', true)
        .attr('cx', (d) => {
          return `${d.val * 16}%`;
        })
        .attr('cy', '50%')
        .attr('r', 3)
        .attr('fill', 'steelblue')
        .call(bounce, 1000);
  }

  render() {
    return (
        <svg id='loading'></svg>
    )
  }
}

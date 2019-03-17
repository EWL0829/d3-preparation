import './basicExample.css';
import * as d3 from 'd3';
import React, { Component } from 'react';

class BasicExample extends Component {
  renderPara = () => {
    let numArr = [1, 2, 3, 4, 5];

    d3.select('#svgWrap')
        .selectAll('p')
        .data(numArr)
        .enter()
        .append('p')
        .text(d => d);
  };

  componentDidMount() {
    this.renderPara();
  }

  render() {
    return (
        <div id="svgWrap"></div>
    )
  }
}

export default BasicExample;

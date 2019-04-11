/* eslint-disable */

import React, { Component } from 'react';
import * as d3 from 'd3';
import './horizonAxis.css';

export default class HorizonAxis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 975,
      height: 500,
      margin: {
        top: 20,
        right: 10,
        bottom: 30,
        left: 40,
      },
      category: [
        {name: 'AVOCADO'},
        {name: 'BANANA'},
        {name: 'CUCUMBER'},
        {name: 'PLUM'},
        {name: 'LIME'},
        {name: 'LEMON'},
        {name: 'GRAPE'},
        {name: 'MELON'},
        {name: 'APPLE'},
      ],
      category01: [
        {name: 1},
        {name: 2},
        {name: 4},
        {name: 3},
        {name: 7},
        {name: 8},
        {name: 6},
        {name: 5},
        {name: 9},
      ],
    };
  }

  renderAXis = () => {
    const { width, height, margin, category, category01 } = this.state;
    const { top, right, bottom, left } = margin;

    const svg = d3.select('#axisWrap')
        .attr('width', width)
        .attr('height', height);

    // 创建横轴比例尺
    // 类目轴
    let fruitScale = d3.scaleBand()
        .domain(category.map(d => d.name))
        .range([margin.left, width - margin.right]);

    let fruitAxis = g => g.attr('transform', `translate(0, ${height - bottom})`)
        .call(d3.axisBottom()
                .scale(fruitScale)
                .tickPadding(15)
            // .tickSizeOuter(0)
            // .tickSizeInner(0)
            // .tickSize(0)
        );

    // 线性轴
    // let fruitScale = d3.scaleLinear()
    //     .domain([0, d3.max(category01.map(d => d.name))])
    //     // .domain([0, 21])
    //     .range([margin.left, width - margin.right]);
    //
    // let fruitAxis = g => g.attr('transform', `translate(0, ${height - bottom})`)
    //     .call(d3.axisBottom()
    //             .scale(fruitScale)
    //             // .ticks(20)  // ticks的传值规则
    //             // .tickValues([1, 2, 3, 5, 8, 13, 21])
    //             // .tickArguments([10])
    //             .tickPadding(15)
    //         // .tickSizeOuter(0)
    //         // .tickSizeInner(0)
    //         // .tickSize(0)
    //     );

    svg.append('g')
        .call(fruitAxis);
  };

  componentDidMount() {
    this.renderAXis();
  }

  render() {
    return (
        <div className="wrap">

          <svg id="axisWrap">

          </svg>
        </div>
    );
  }
}


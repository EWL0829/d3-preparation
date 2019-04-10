import React, { Component } from 'react';
import * as d3 from 'd3';

export default class GroupHorizonChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 975,
      height: 500,
      margin: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 40,
      },
      category: [
        'orange',
        'apple',
        'grape',
        'watermelon',
        'plum',
      ],
      data: [
        {
          name: 'Jane',
          orange: 0,
          apple: 2,
          grape: 5,
          watermelon: 4,
          plum: 9,
        },
        {
          name: 'John',
          orange: 5,
          apple: 7,
          grape: 3,
          watermelon: 1,
          plum: 6,
        },
      ],
    };
  }

  componentDidMount() {
    const { width, height, margin, data, category } = this.state;

    let groupKey = 'name';
    let keys = category;

    // 创建外层y轴比例尺
    let y0 = d3.scaleBand()
        .domain(data.map(d => d[groupKey]))
        .range([height - margin.bottom, margin.top])
        .paddingInner(0.1);

    // 创建内层y轴比例尺
    let y1 = d3.scaleBand()
        .domain(keys)
        .range([0, y0.bandwidth()])
        .paddingInner(0.05);

    // 创建x轴比例尺
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))])
        .range([margin.left, width - margin.right]);

    // 建立x坐标轴函数
    let xAxis = g => g.attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.select('.domain').remove());

    // 建立y坐标轴函数
    let yAxis = g => g.attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y0))
        .call(g => g.select(".domain").remove());

    // 创建颜色数组
    let color = d3.scaleOrdinal()
        .range(["#FFA500", "#FF0000", "#800080", "#F08080", "#DDA0DD"]);

    let legend = svg => {
      const g = svg
          .attr("transform", `translate(${width},0)`)
          .attr("text-anchor", "end")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .selectAll("g")
          .data(color.domain().slice().reverse())
          .join("g")
          .attr("transform", (d, i) => `translate(0,${i * 20})`);

      g.append("rect")
          .attr("x", -19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", color);

      g.append("text")
          .attr("x", -24)
          .attr("y", 9.5)
          .attr("dy", "0.35em")
          .text(d => d);
    };

    const svg = d3.select('#svgWrap')
        .attr('width', width)
        .attr('height', height);

    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0, ${y0(d[groupKey])})`)
        .selectAll("rect")
        .data(d => keys.map(key => ({ key, value: d[key] })))
        .join("rect")
        .attr("x", d => x(d.value))
        .attr("y", d => y1(d.key))
        .attr('height', y1.bandwidth())
        .attr('width', d => x(d.value) - x(0))
        .attr('transform', d => {
          return `translate(${-x(d.value) + margin.left}, 0)`;
        })
        .attr("fill", d => color(d.key));

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(legend);

  }

  render() {
    return (
        <svg id="svgWrap"></svg>
    )
  }
}

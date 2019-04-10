import React, { Component } from 'react';
import './highChartSimu.css';
import * as d3 from 'd3';

export default class HighChartSimu extends Component {
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
    }
    ;
  }

  componentDidMount() {
    const { width, height, margin } = this.state;
    // this.renderChart();
    d3.csv("https://gist.githubusercontent.com/mbostock/3887051/raw/805adad40306cedf1a513c252ddd95e7c981885a/data.csv", d3.autoType)
        .then(res => {
          let data = Object.assign(res, { y: 'population' });
          let groupKey = data.columns[0];
          let keys = data.columns.slice(1); // 类目
          console.log('res', data);
          console.log('group', groupKey);
          console.log('keys', keys);

          let x0 = d3.scaleBand()
              .domain(data.map(d => d[groupKey]))
              .rangeRound([margin.left, width - margin.right])
              .paddingInner(0.1);

          let x1 = d3.scaleBand()
              .domain(keys)
              .rangeRound([0, x0.bandwidth()])
              .paddingInner(0.05);

          let y = d3.scaleLinear()
              .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
              .rangeRound([height - margin.bottom, margin.top]);

          let xAxis = g => g
              .attr("transform", `translate(0,${height - margin.bottom})`)
              .call(d3.axisBottom(x0).tickSizeOuter(0))
              .call(g => g.select(".domain").remove());

          let yAxis = g => g
              .attr("transform", `translate(${margin.left},0)`)
              .call(d3.axisLeft(y).ticks(null, "s"))
              .call(g => g.select(".domain").remove())
              .call(g => g.select(".tick:last-of-type text").clone()
                  .attr("x", 3)
                  .attr("text-anchor", "start")
                  .attr("font-weight", "bold"),
              )

          let color = d3.scaleOrdinal()
              .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

          const svg = d3.select('#svgWrap')
              .attr('width', width)
              .attr('height', height);

          svg.append("g")
              .selectAll("g")
              .data(data)
              .join("g")
              .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
              .selectAll("rect")
              .data(d => keys.map(key => ({ key, value: d[key] })))
              .join("rect")
              .attr("x", d => x1(d.key))
              .attr("y", d => y(d.value))
              .attr("width", x1.bandwidth())
              .attr("height", d => y(0) - y(d.value))
              .attr("fill", d => color(d.key));

          svg.append("g")
              .call(xAxis);

          svg.append("g")
              .call(yAxis);
        })
  }

  renderChart = () => {
    const { margin, width, height, data, category, colorCategory } = this.state;
    const { top, right, bottom, left } = margin;

    let allCategoryVal = [];
    data.forEach(item => {
      let itemMax = d3.max(item.value);
      allCategoryVal.push(itemMax);
    });

    // 选中svg标签
    const svg = d3.select('#svgWrap')
        .attr('width', width)
        .attr('height', height);

    // 创建外层y轴比例尺
    let y = d3.scaleBand()
        .domain(category)
        .range([top, height - bottom]);

    // 创建外层y轴函数
    let yAxis = g => g.attr('transform', `translate(${left}, 0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.select('.domain').remove());

    // 创建外层y轴
    svg.append('g')
        .classed('y-axis', true)
        .call(yAxis);

    // 创建内层y轴比例尺
    let y1 = d3.scaleBand()
        .domain(d3.map(category, d => d.name))
        .range([0, y.bandwidth()]);

    // 创建x轴比例尺
    let x = d3.scaleLinear()
        .domain([0, d3.max(allCategoryVal)])
        .range([left, width - right]);

    // 创建x轴函数
    let xAxis = g => g.attr('transform', `translate(0, 0)`)
        .call(d3.axisBottom(x)
            .tickPadding(5)
            .tickSizeInner(height - bottom)  // 设置刻度线为纵向贯穿整个svg
            .tickFormat(d => d),
        );

    // 创建x轴
    svg.append('g')
        .classed('x-axis', true)
        .call(xAxis);

    // 创建分组的柱状图


  };

  render() {
    return (
        <svg id="svgWrap"></svg>
    )
  }
}

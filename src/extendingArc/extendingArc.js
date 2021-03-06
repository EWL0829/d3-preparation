import React, { Component } from 'react';
import * as d3 from 'd3';
import './extendingArc.css';

class ExtendingArc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 960,
      height: 500,
      data: [1, 1, 2, 3, 5, 8, 13, 21],
    };
  }

  componentDidMount() {
    var data = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

    var width = 960,
        height = 500;

    var outerRadius = height / 2 - 20,
        innerRadius = outerRadius / 3,
        cornerRadius = 10;

    // 使用d3中的饼状图布局，设置各个扇形之间的间距
    var pie = d3.pie()
        .padAngle(.02);

    // 弧布局，创建具有内外半径的圆弧
    var arc = d3.arc()
        .padRadius(outerRadius)
        .innerRadius(innerRadius)
        .cornerRadius(cornerRadius);

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg.selectAll("path")
        .data(pie(data))
        .enter().append("path")
        .each(function (d) {
          d.outerRadius = outerRadius - 20;
        })
        .attr("d", arc)
        .style('fill', (d, i) => {
          return d3.schemeCategory10[i];
        })
        .style('fill-opacity', .3)
        .on("mouseover", arcTween(outerRadius, 0))
        .on("mouseout", arcTween(outerRadius - 20, 150));

    function arcTween(outerRadius, delay) {
      return function () {
        d3.select(this)
            .transition()
            .delay(delay)
            .ease(d3.easeBounce)
            .attrTween("d", (d) => {
              var i = d3.interpolate(d.outerRadius, outerRadius);
              return (t) => {
                // 随时间变化
                d.outerRadius = i(t);
                return arc(d);
              };
            });
      };
    }
  }

  render() {
    return (
        <svg></svg>
    );
  }
}

export default ExtendingArc;

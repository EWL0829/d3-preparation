import React, { Component } from 'react';
import * as d3 from 'd3';
import './arcPadding.css';

class ArcPaddingIII extends Component {
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

    let outerRadius = height / 2 - 10,   // 外圈半径
        innerRadius = outerRadius - 60,  // 内圈半径
        cornerRadius = 12,               // （外圆与内圆截取的环状扇形）环状扇形的四个角半径，当角半径 * 2大于梯形扇形时，环状扇形的边缘变为圆形
        padAngle = .03;                  // 扇形间距角度占比, 实际角度 = 2 * Math.PI * padAngle

    let pie = d3.pie()
        .padAngle(padAngle);

    let arcs = pie(data);

    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cornerRadius(cornerRadius);

    let color = d3.schemeCategory10;

    let svg = d3.select("svg")
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // 绘制内圆
    svg.append("circle")
        .style("fill", "none")
        .style("stroke", "#555")
        .attr("r", innerRadius);

    // 绘制外圆
    svg.append("circle")
        .style("fill", "none")
        .style("stroke", "#555")
        .attr("r", outerRadius);

    // 绘制环状扇形四角的圆弧
    // svg.append("g")
    //     .style("stroke", "#555")
    //     .style("fill", "none")
    //     .attr("class", "corner")
    //     .selectAll("circle")
    //     .data(d3.merge(arcs.map((d) =>{
    //       // radius表示位置半径
    //       // angle表示当前圆形圆心偏离的角度，分为顺时针与逆时针
    //       return [
    //         {angle: d.startAngle + padAngle / 2, radius: outerRadius - cornerRadius, start: +1},
    //         {angle: d.endAngle - padAngle / 2, radius: outerRadius - cornerRadius, start: -1},
    //         {angle: d.endAngle - padAngle / 2 * outerRadius / innerRadius, radius: innerRadius + cornerRadius, start: -1},
    //         {angle: d.startAngle + padAngle / 2 * outerRadius / innerRadius, radius: innerRadius + cornerRadius, start: +1}
    //       ];
    //     })))
    //     .enter().append("circle")
    //     .attr("cx", (d) => {
    //       return d.start * cornerRadius * Math.cos(d.angle) + Math.sqrt(d.radius * d.radius - cornerRadius * cornerRadius) * Math.sin(d.angle); })
    //     .attr("cy", (d) => { return d.start * cornerRadius * Math.sin(d.angle) - Math.sqrt(d.radius * d.radius - cornerRadius * cornerRadius) * Math.cos(d.angle); })
    //     .attr("r", cornerRadius);

    // 绘制各个环状扇形
    let path = svg.append("g").selectAll("path")
        .data(arcs)
        .enter().append("path")
        .style("fill", (d, i) => { return color[i]; })
        .style("fill-opacity", .25)
        .style("stroke", "#000")
        .style("stroke-width", "1.5px")
        .attr("d", arc);

    let ease = d3.transition().ease(),
        duration = 2500;

    let timerId = d3.timer((elapsed) => {
      var t = ease(1 - Math.abs((elapsed % duration) / duration - .5) * 2),
          arcs = pie.padAngle(t * .1 + .03)(data);

      arc.innerRadius(outerRadius / (3 - t));
      path.data(arcs).attr("d", arc);

      if (elapsed > 2500) {
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

export default ArcPaddingIII;

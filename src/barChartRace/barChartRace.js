import React, { Component } from 'react';
import * as d3 from 'd3';
import './barChartRace.css';

export default class BarChartRace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 975,
      height: 600,
      margin: {
        top: 80,
        right: 0,
        bottom: 5,
        left: 0,
      },
      top_n: 12,
      tickDuration: 333,
      brandData: null, // 品牌数据信息
    };
  }

  fetchBrandData = () => {
    return d3.csv('https://gist.githubusercontent.com/johnburnmurdoch/2e5712cce1e2a9407bf081a952b85bac/raw/08cf82f5e03c619f7da2700d1777da0b5247df18/INTERBRAND_brand_values_2000_2018_decimalised.csv');
  };

  componentDidMount() {
    this.fetchBrandData().then(data => {
      this.setState({
        brandData: data,
      }, () => {
        this.renderChart(this.state.brandData);
        // console.log('this.state.brandData', this.state.brandData);
      });
    });
  }

  renderChart = (brandData) => {
    const { width, height, margin, top_n, tickDuration } = this.state;
    const { top, right, bottom, left } = margin;

    // 选中svg标签
    const svg = d3.select('#svgWrap')
        .attr('width', width)
        .attr('height', height);

    // 配置柱状图单个矩形之间的距离
    let barPadding = (height - (top + bottom)) / (top_n * 5);

    // 配置标题
    svg.append('text')
        .attr('class', 'title')
        .attr('y', 24)
        .text('18 years of Interbrand’s Top Global Brands');

    // 配置副标题
    svg.append('text')
        .text('Brand value: $m')
        .attr('class', 'subtitle')
        .attr('y', 50);

    // 配置右下角图例
    svg.append('text')
        .text('Source: Interbrand')
        .attr('class', 'caption')
        .attr('x', width)
        .attr('y', height - bottom);

    // 配置起始年份
    let year = 2000;

    // 处理品牌数据
    brandData.forEach(d => {
      d.value = +d.value;
      d.lastValue = +d.lastValue;
      d.value = isNaN(d.value) ? 0 : d.value;
      d.year = +d.year;
      d.colour = d3.hsl(Math.random() * 360, 0.75, 0.75);
    });

    // 过滤出年份与year相同且非NaN的排名前12位的数据
    let yearSlice = brandData.filter(d => d.year === year && !isNaN(d.value))
        .sort((a, b) => a.value - b.value) // 升序排列
        .slice(0, top_n);

    // 为过滤出来的每一条数据rank属性，其值为当前年份的排名次序
    yearSlice.forEach((d, i) => d.rank = i);

    // 创建x轴比例尺
    let x = d3.scaleLinear()
        .domain([0, d3.max(yearSlice, d => d.value)]) // 以每条数据的value为x轴的衡量标准
        .range([left, width - right - 65]);

    // 创建y轴比例尺
    let y = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height - bottom, top]);

    // x轴设置为top位置
    let xAxis = d3.axisTop()
        .scale(x)
        .ticks(width > 500 ? 5 : 2)
        .tickSize(-(height - top - bottom))
        .tickFormat(d => d3.format(',')(d));

    svg.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        // eslint-disable-next-line
        .classed('origin', d => d == 0);

    svg.selectAll('rect.bar')
        .data(yearSlice, d => d.name)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('y', d => y(d.rank) + 5)
        .attr('width', d => {
          return  x(d.value) - x(0) - 1;
        })
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', d => d.colour);

    svg.selectAll('text.label')
        .data(yearSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value) - 8)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
        .attr('text-anchor', 'end')
        .html(d => d.name);

    svg.selectAll('text.valueLabel')
        .data(yearSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
        .text(d => d3.format(',.0f')(d.lastValue));

    let halo = (text, strokeWidth) => {
      text.select(function () {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
          .style('fill', '#fff')
          .style('stroke', '#fff')
          .style('stroke-width', strokeWidth)
          .style('stroke-linejoin', 'round')
          .style('opacity', 1);
    };

    let yearText = svg.append('text')
        .attr('class', 'yearText')
        .attr('x', width - right)
        .attr('y', height - 25)
        .style('text-anchor', 'end')
        .html(~~year)
        .call(halo, 10);

    let ticker = d3.interval(e => {
      // eslint-disable-next-line
      yearSlice = brandData.filter(d => d.year == year && !isNaN(d.value))
          .sort((a, b) => b.value - a.value)
          .slice(0, top_n);

      yearSlice.forEach((d, i) => d.rank = i);

      x.domain([0, d3.max(yearSlice, d => d.value)]);

      svg.select('.xAxis')
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .call(xAxis);

      let bars = svg.selectAll('.bar').data(yearSlice, d => d.name);

      bars
          .enter()
          .append('rect')
          .attr('class', d => `bar ${d.name.replace(/\s/g, '_')}`)
          .attr('x', x(0) + 1)
          .attr('y', d => y(top_n + 1) + 5)
          .attr('width', d => {
            return x(d.value) - x(0) - 1
          })
          .attr('height', y(1) - y(0) - barPadding)
          .style('fill', d => d.colour)
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank) + 5);

      bars
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('width', d => x(d.value) - x(0) - 1)
          .attr('y', d => y(d.rank) + 5);

      bars
          .exit()
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('width', d => x(d.value) - x(0) - 1)
          .attr('y', d => y(top_n + 1) + 5)
          .remove();

      let labels = svg.selectAll('.label').data(yearSlice, d => d.name);

      labels
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.value) - 8)
          .attr('y', d => y(top_n + 1) + 5 + ((y(1) - y(0)) / 2))
          .style('text-anchor', 'end')
          .html(d => d.name)
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

      labels
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x(d.value) - 8)
          .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

      labels
          .exit()
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x(d.value) - 8)
          .attr('y', d => y(top_n + 1) + 5)
          .remove();

      let valueLabels = svg.selectAll('.valueLabel').data(yearSlice, d => d.name);

      valueLabels
          .enter()
          .append('text')
          .attr('class', 'valueLabel')
          .attr('x', d => x(d.value) + 5)
          .attr('y', d => y(top_n + 1) + 5)
          .text(d => d3.format(',.0f')(d.lastValue))
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

      valueLabels
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x(d.value) + 5)
          .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
          .tween("text", function (d) {
            let i = d3.interpolateRound(d.lastValue, d.value);
            return function (t) {
              this.textContent = d3.format(',')(i(t));
            };
          });

      valueLabels
          .exit()
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x(d.value) + 5)
          .attr('y', d => y(top_n + 1) + 5,)
          .remove();

      yearText.html(~~year);

      // eslint-disable-next-line
      if (year == 2018) ticker.stop();
      year = d3.format('.1f')((+year) + 0.1);
    }, tickDuration);
  };

  render() {
    return (
        <svg id='svgWrap'></svg>
    )
  }
}

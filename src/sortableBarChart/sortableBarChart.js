import React, { Component } from 'react';
import './sortableBarChart.css';
import * as d3 from 'd3';

class SortableBarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],  // 渲染所需的name-value数据对数组
      margin: {
        top: 20,
        right: 0,
        bottom: 30,
        left: 40,
      },
      width: 975,
      height: 500,
      x: null,  // x比例尺
      y: null,  // y比例尺
      xAxis: null,  // x轴
      yAxis: null,  // y轴
      barsGroup: null,    // 柱状图分组
      gxAxisGroup: null,       // 柱状图分组x轴分组
      name: null,
      value: null,
    };
  }

  /**
   * @description: 渲染表格
   * @author: liyue
   * @date: 2019-03-17
   * @param: csv数据
   * @return: 无
   **/
  renderChart = (data) => {
    const { width, height, margin } = this.state;

    // 创建x比例尺
    let x = d3.scaleBand().domain(data.map(d => d.name)).range([margin.left, width - margin.right]).padding(0.1);

    // 创建y比例尺
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()   // 将连续的数字转化为四舍五入的数字
        .range([height - margin.bottom, margin.top]);

    // 创建x轴函数
    let xAxis = g => g.attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.selectAll('.tick text')
            .attr('y', 10)
            .attr('transform', 'rotate(10)'),
        );

    // 创建y轴函数
    let yAxis = g => g.attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select('.domain').remove());

    // 添加svg
    let svg = d3.select('#svgWrap')
        .attr('width', width + 'px')
        .attr('height', height + 'px')
        .classed('svg-wrap', true);

    // 添加柱状图分组
    const barsGroup = svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .enter().append("rect")
        .style("mix-blend-mode", "multiply")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());

    // 添加横坐标分组
    const gxAxis = svg.append("g")
        .call(xAxis);

    // 添加纵坐标分组
    svg.append("g")
        .call(yAxis);

    this.setState({
      barsGroup,
      gxAxisGroup: gxAxis,
      x,
      xAxis,
      yAxis,
      y,
    }, () => {
      this.switchOrder('name-ascending');
    });
  };

  /**
   * @description: 更新视图
   * @author: liyue
   * @date: 2019-03-17
   * @param: svg分组名称，坐标轴
   * @return: 无
   **/
  update = (groupName, gx) => {
    const { data, x, xAxis } = this.state;
    const svg = d3.select('#svgWrap');
    const t = svg.transition()
        .duration(750);

    groupName.data(data, d => d.name)
        .order()
        .transition(t)
        .delay((d, i) => i * 20)
        .attr("x", d => x(d.name));

    gx.transition(t)
        .call(xAxis)
        .selectAll(".tick")
        .delay((d, i) => i * 20);
  };

  /**
   * @description: 切换视图展示的顺序
   * @author: liyue
   * @date: 2019-03-17
   * @param: 排序
   * @return: 排序
   **/
  switchOrder = (order) => {
    const { barsGroup, gxAxisGroup, data, x } = this.state;

    switch (order) {
      case "name-ascending":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "value-ascending":
        data.sort((a, b) => a.value - b.value);
        break;
      case "value-descending":
        data.sort((a, b) => b.value - a.value);
        break;
      default:
        data.sort((a, b) => a.name.localeCompare(b.name));
    }
    x.domain(data.map(d => d.name));
    this.update(barsGroup, gxAxisGroup);
    return order;
  };

  /**
   * @description: 异步获取展示数据
   * @author: liyue
   * @date: 2019-03-17
   * @param: 数据地址
   * @return: csv数据
   **/
  getRawData = (url) => {
    d3.csv(url, ({ letter, frequency }) => {
      return {
        name: letter,
        value: +frequency,
      }
    }).then(data => {
      // 更新数据
      this.setState({
        data,
      }, () => {
        this.renderChart(this.state.data);
      });
    }).catch(() => {
      console.log('something wrong happened. plz check it');
    });
  };

  componentDidMount() {
    this.getRawData('https://gist.githubusercontent.com/mbostock/81aa27912ad9b1ed577016797a780b2c/raw/3a807eb0cbb0f5904053ac2f9edf765e2f87a2f5/alphabet.csv');
  }

  render() {
    return (
        <div className="App" id="svgBox">
          <div id="select">
            <select name="order-select" id="orderSelect" onChange={e => this.switchOrder(e.target.value)}>
              <option value="name-ascending">name-ascending</option>
              <option value="value-ascending">value-ascending</option>
              <option value="value-descending">value-descending</option>
            </select>
          </div>
          <svg id="svgWrap"></svg>
        </div>
    );
  }
}

export default SortableBarChart;

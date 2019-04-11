import React, { Component } from 'react';
import './sortableBarChart.css';
import * as d3 from 'd3';
import Loading from '../loadingIcon/loadingIcon';

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

    // 创建x比例尺--类目轴
    let x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    // 创建y比例尺--线性轴
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
        .classed('rect', true)
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .enter().append("rect")
        .style("mix-blend-mode", "multiply")   // 设置背景的混合模式为叠加，在切换排列次序的时候可以明显看出叠加的效果
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("height", d => {
          // console.log('y(value)', y(d.value)); // 笛卡尔坐标系和计算机坐标系的差别加之比例尺的顺序由下至上值域对应值越来越小
          // console.log('y(0)', y(0));           // 导致需要反过来用定义域值小的减去定义域值大的
          return y(0) - y(d.value);
        })
        .attr("width", x.bandwidth() / 3)
        .attr('transform', `translate(${x.bandwidth() / 3}, 0)`)
        .on('mouseover', function (d, i) {
          let xPosition = parseFloat(d3.select(this).attr("x")) + x.bandwidth() / 3;
          let yPosition = parseFloat(d3.select(this).attr("y") - 10);

          // d3.select('#svgWrap').append('text')
          //     .attr('id', 'toolTip')
          //     .style('backgroundColor', 'red')
          //     .text(d.value)
          //     .attr('x', xPosition)
          //     .attr('y', yPosition);

          d3.select("#tooltip")
              .classed('hidden', false)
              .style("left", `${xPosition + x.bandwidth() / 3}px`)
              .style("top", `${yPosition - 40}px`)
              .text(`${d.name}今天走了${d.value}步`);
        })
        .on('mouseleave', d => {
          d3.select('#tooltip')
              .classed('hidden', true);
        });

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

    // 更新柱状图中各rect的横坐标
    groupName.data(data, d => d.name)
        .order()  // 重新在document中插入元素，以便使元素的排列顺序和绑定的数据的排列顺序保持一致
        .transition(t)
        .delay((d, i) => i * 20)
        .attr("x", d => x(d.name));

    // console.log('groupName', groupName);
    // 由于x比例尺已经做了变更，所以xAxis会跟着进行变化，直接给横坐标绑定xAxis函数即可
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
        data.sort((a, b) => a.value - b.value);  // 升序
        break;
      case "value-descending":
        data.sort((a, b) => b.value - a.value);  // 降序
        break;
      default:
        data.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 每一次更新的都是横坐标对应的定义域排序，故一旦给定的数据发生顺序变化，定义域都要刷新
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
    // d3的csv方法会返回一个promise
    d3.csv(url, ({ letter, frequency }) => {
      return {
        name: letter,
        value: +frequency,
      }
    }).then(data => {
      let d = [
        {
          name: '我',
          value: 4927,
        },
        {
          name: '红颖',
          value: 4973,
        },
        {
          name: '青青',
          value: 4407,
        },
        {
          name: '云龙',
          value: 1903,
        },
        {
          name: '粲爷',
          value: 2785,
        },
        {
          name: '徐潇',
          value: 2641,
        },
        {
          name: '智攀',
          value: 5735,
        },
        {
          name: '辉哥',
          value: 5004,
        },
      ];
      // 更新数据
      this.setState({
        data: d,
        // data,
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
    const { data } = this.state;
    const length = data.length;

    return (
        <div className="App" id="svgBox">
          <div id="select">
            <select name="order-select" id="orderSelect" onChange={e => this.switchOrder(e.target.value)}>
              <option value="name-ascending">name-ascending</option>
              <option value="value-ascending">value-ascending</option>
              <option value="value-descending">value-descending</option>
            </select>
          </div>
          <div className="svg-wrap">
            {
              length <= 0 ? <Loading/> : <svg id="svgWrap"></svg>
            }
          </div>
          <div id="tooltip" className="hidden">

          </div>
        </div>
    );
  }
}

export default SortableBarChart;

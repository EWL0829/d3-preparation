import React, { Component } from 'react';
import * as d3 from 'd3';

export default class FruitBasket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 960,
      height: 500,
      fruits: [
        {
          val: 100,
        },
        {
          val: 200,
        },
        {
          val: 300,
        },
        {
          val: 400,
        },
      ],
    };
  }

  renderApples = () => {
    const { width, height, fruits } = this.state;


    this.svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    // update状态的selection，为红色
    this.apples = this.svg.selectAll('circle')
        .data(fruits)
        .attr('cx', (d, i) => i * 100 + 40)
        .attr('fill', 'red');
    console.log('update', this.apples);
    // enter状态的selection，为绿色
    this.apples
        .enter()
        .append('circle')
        .attr('fill', 'green')
        .merge(this.apples)
        .attr('cx', (d, i) => i * 100 + 40)
        .attr('cy', 250)
        .attr('r', 40);
    console.log('enter', this.apples);

    // exit状态的selection，为黑色
    this.apples
        .exit()
        .attr('fill', '#000')
        // .remove();
  };

  componentDidMount() {
    this.renderApples();
  }

  handlePush = (type) => {
    const { fruits } = this.state;
    const newFruits = fruits.slice(0);

    if (type.toLowerCase() === 'push') {
      newFruits.push({
        val: Math.random() * 100,
      });
    } else {
      newFruits.pop();
    }

    this.setState({
      fruits: newFruits,
    }, () => {
      this.renderApples();
    });
  };

  render() {
    return (
        <div className='fruitsBasket'>
          <svg></svg>
          <button id="btn" onClick={() => this.handlePush('push')}>push one</button>
          <button id="btn" onClick={() => this.handlePush('pop')}>pop one</button>
        </div>
    );
  }
}

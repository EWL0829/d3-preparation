import React, { Component } from 'react';
import img from '../d3-img.png';

export default class Home extends Component {
  render() {
    return (
        <div>
          <img className='home-top-img' src="//camo.githubusercontent.com/a42604d171b0b0ea871b7826dbc927d4cfdfaefb/68747470733a2f2f64336a732e6f72672f6c6f676f2e7376673f73616e6974697a653d74727565" alt=""/>
          <h1 className='home-d3-intro'>Data-Driven Documents</h1>
          <img width={900} className='home-intro-img' src={img} alt=""/>

        </div>
    );
  }
}

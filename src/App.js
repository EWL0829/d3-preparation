import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SortableBarChart from './sortableBarChart/sortableBarChart';
import BasicExample from './basicExamples/basicExample';
import ArcPaddingI from './arcPadding-I/arcPadding';
import ArcPaddingII from './arcPadding-II/arcPadding';
import ArcPaddingIII from './arcPadding-III/arcPadding';
import ArcPaddingIV from './arcPadding-IV/arcPadding';
import ExtendingArc from './extendingArc/extendingArc';
import GroupedBar from './groupedBar/groupedBar';
import Loading from './loadingIcon/loadingIcon';
import FruitBasket from './fruitBasket/fruitBasket';
import BarChartRace from './barChartRace/barChartRace';
import HighChartSimu from './highChartSimulate/highChartSimu';
import GroupHorizonChart from './groupHorizonChart/groupHorizonChart';
import HorizonAxis from './horizonAxis/horizonAxis';
import Home from './home/index';

class App extends Component {
  render() {
    return (
        <Router>
          <div className="wrap">
            <div className="left-menu">
              <ul>
                <li className="list-item list-head">
                  D3-MENU
                </li>
                <li className='list-item list-body'>
                  <Link to='/'>首页</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/basicExamples">基本示例</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/ArcPaddingI">饼状图I</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/ArcPaddingII">饼状图II</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/ArcPaddingIII">饼状图III</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/ArcPaddingIV">饼状图IV</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/ExtendingArc">悬浮增大半径的饼状图</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/GroupedBar">群组柱状图</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/SortableBarChart">排序柱状图</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/Loading">加载icon</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/FruitBasket">水果篮</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/BarChartRace">race柱状图</Link>
                </li>
                <li className='list-item list-body'>
                  <Link to="/HighChartSimu">模仿highChart类目图</Link>
                </li>
                <li className="list-item list-body">
                  <Link to='/GroupHorizonChart'>模仿highChart横向类目</Link>
                </li>
                <li className="list-item list-body">
                  <Link to='/HorizonAxis'>轴的介绍</Link>
                </li>
              </ul>

            </div>
            <div className="right-content">
              <Route path="/" exact component={Home}/>
              <Route path="/basicExamples" component={BasicExample}/>
              <Route path="/ArcPaddingI" component={ArcPaddingI}/>
              <Route path="/ArcPaddingII" component={ArcPaddingII}/>
              <Route path="/ArcPaddingIII" component={ArcPaddingIII}/>
              <Route path="/ArcPaddingIV" component={ArcPaddingIV}/>
              <Route path="/ExtendingArc" component={ExtendingArc}/>
              <Route path="/GroupedBar" component={GroupedBar}/>
              <Route path="/SortableBarChart" component={SortableBarChart}/>
              <Route path="/Loading" component={Loading}/>
              <Route path="/FruitBasket" component={FruitBasket}/>
              <Route path="/BarChartRace" component={BarChartRace}/>
              <Route path="/HighChartSimu" component={HighChartSimu}/>
              <Route path="/GroupHorizonChart" component={GroupHorizonChart}/>
              <Route path="/HorizonAxis" component={HorizonAxis}/>
            </div>
          </div>
        </Router>
    );
  }
}

export default App;

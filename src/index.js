import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// examples
import SortableBarChart from './sortableBarChart/sortableBarChart';
import BasicExample from './basicExamples/basicExample';
// import ArcPadding from './arcPadding-I/arcPadding';
// import ArcPadding from './arcPadding-II/arcPadding';
// import ArcPadding from './arcPadding-III/arcPadding';
// import ArcPadding from './arcPadding-IV/arcPadding';
// import ExtendingArc from './extendingArc/extendingArc';
import GroupedBar from './groupedBar/groupedBar';

import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<SortableBarChart />, document.getElementById('root'));
ReactDOM.render(<GroupedBar />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import SortableBarChart from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SortableBarChart />, div);
  ReactDOM.unmountComponentAtNode(div);
});

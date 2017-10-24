// Application entrypoint.

// Load up the application styles
require('../styles/application.scss');

// Render the top-level React component
import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import pages from './redux/reducers/pages';
import createTemplates from './redux/reducers/create-templates';
import templates from './redux/reducers/grab-data';
import { fetchData } from './redux/actions/grab-data';

import App from './App.jsx';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';

const totalReducer = combineReducers({
  pages,
  createTemplates,
  templates
});

const store = createStore(
  totalReducer,
  applyMiddleware(logger),
  applyMiddleware(thunk)
);

// store.dispatch(fetchData);

console.log(store.getState());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-root')
);

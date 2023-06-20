// React
import React from 'react';
import ReactDOM from 'react-dom/client';

// Redux
import { Provider } from 'react-redux';

// Redux Store
import store from './store/store';

// Custom Components
import Router from './router/Router';

// Global styling
import './styling/index.scss';

// Main
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router />
  </Provider>
);

// React
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";

// Redux
import { Provider } from 'react-redux';

// Redux Store
import store from './store/store';

// Custon Router
import { router } from './router/routes';

// Custom Components
import NavBar from './components/NavBar';

// Global styling
import './styling/index.scss';

// Main
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <NavBar />
    <RouterProvider router={router} />
  </Provider>
);

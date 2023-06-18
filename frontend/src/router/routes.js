// React Router Imports
import { createBrowserRouter } from "react-router-dom";

// Pages
import Home from '../pages/Home';
import Movies from '../pages/Movies';
import Shows from '../pages/Shows';
import Settings from '../pages/Settings';
import Player from '../pages/Player';

// Setup router
export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/movies", element: <Movies /> },
  { path: "/shows", element: <Shows /> },
  { path: "/settings", element: <Settings /> },
  { path: "/player/:id", element: <Player /> },
  { path: "*", element: <div>404 NOT FOUND</div> }
]);
// React Router Imports
import { Route, Routes } from "react-router-dom";

// Main Pages
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import Player from '../pages/Player';

// Movie Routes
import Movies from '../pages/Movies';
import MovieDetails from "../pages/MovieDetails";

// Show Routes
import Shows from '../pages/Shows';
import ShowDetails from "../pages/ShowDetails";
import SeasonDetails from "../pages/SeasonDetails";
import EpisodeDetails from "../pages/EpisodeDetails";

// Main
export default function RouterRoutes () {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/movies" element={<Movies />} /> 
      <Route path="/movies/:movie_id" element={<MovieDetails />} /> 
      <Route path="/shows" element={<Shows />} /> 
      <Route path="/shows/:show_id" element={<ShowDetails />} /> 
      <Route path="/shows/:show_id/season/:season_id" element={<SeasonDetails />} /> 
      <Route path="/shows/:show_id/season/:season_id/episode/:episode_id" element={<EpisodeDetails />} /> 
      <Route path="/settings" element={<Settings />} /> 
      <Route path="/player/:id" element={<Player />} /> 
      <Route path="*" element={<div>404 NOT FOUND</div>} /> 
    </Routes>
  );
}
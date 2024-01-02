// NPM Imports
import { createRouter, createWebHistory } from 'vue-router';

// Components
import Home from '../pages/Home.vue';
import Movies from '../pages/Movies.vue';
import MovieDetails from '../pages/MovieDetails.vue';
import Shows from '../pages/Shows.vue';
import ShowDetails from '../pages/ShowDetails.vue';
import SeasonDetails from '../pages/SeasonDetails.vue';
import EpisodeDetails from '../pages/EpisodeDetails.vue';
import Player from '../pages/Player.vue';

// Setup Router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/movies',
      name: 'movies',
      component: Movies
    },
    {
      path: '/movie/:movie_id',
      name: 'movie_details',
      component: MovieDetails
    },
    {
      path: '/shows',
      name: 'shows',
      component: Shows
    },
    {
      path: '/show/:show_id',
      name: 'show_details',
      component: ShowDetails
    },
    {
      path: '/show/:show_id/season/:season_id',
      name: 'season_details',
      component: SeasonDetails
    },
    {
      path: '/show/:show_id/season/:season_id/episode/:episode_id',
      name: 'episode_details',
      component: EpisodeDetails
    }
    ,
    {
      path: '/player/:id',
      name: 'player',
      component: Player
    }
  ]
});

export default router;

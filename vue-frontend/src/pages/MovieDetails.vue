<template>
  <!-- Page Container -->
  <div class="h-screen bg-white dark:bg-neutral-800 flex flex-col text-gray-300 pb-3">

    <!-- Nav Bar -->
    <NavBar />

    <!-- Main Container -->
    <div class="mt-20 mx-2 flex flex-row flex-grow custom-container">

      <!-- Side Bar -->
      <SideBar />

      <!-- Main Content -->
      <div class="h-calc-screen flex flex-col flex-grow px-4 py-3 overflow-y-auto">

        <Loader v-if="this.loading" />

        <div v-else>

          <!-- Title -->
          <h3 className="text-lg font-medium mb-8">Movies</h3>

          <!-- Show Info -->
          <div className='flex flex-row mb-10'>

            <!-- Show Poster -->
            <div className='flex flex-col mr-8'>
              <img className='w-72 h-475 object-fill rounded' :src="`${this.movie.poster}`" :alt="`${this.movie.title}`" />
            </div>

            <!-- Show Details -->
            <div className='flex flex-col'>

              <!-- Title -->
              <h3 className="text-3xl font-medium mb-4">{{ this.movie.title }}</h3>

              <!-- Year -->
              <h5 className='text-md font-sm mb-1'>{{ this.movie.year }}</h5>

              <!-- Genres -->
              <h5 className='text-md font-sm mb-1'>{{ this.movie.genre }}</h5>

              <!-- Duration -->
              <h5 className="text-md font-sm mb-4">{{ `${this.movie.duration}min` }}</h5>

              <!-- Ratings -->
              <div v-if="this.movie.ratings_tmdb" className='flex flex-row items-center mb-6'>
                <img className='h-2.5 mr-3' src='@/assets/tmdb-logo.svg' alt='IMDb' />
                <h5 className='text-md font-medium'>{{ parseFloat(this.movie.ratings_tmdb).toFixed(1) }} / 10</h5>
              </div>
              <div v-else className='mb-6'></div>

              <!-- Play Button -->
              <RouterLink className='flex items-center w-40 bg-amber-400 py-2 px-4 mb-8 rounded text-black font-medium text-lg hover:bg-amber-300' :to="`/player/${this.movie.id}`">Play</RouterLink>

              <!-- Description -->
              <p className='w-136 text-md font-medium'>{{ this.movie.description }}</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import NavBar from "../components/NavBar.vue";
import SideBar from "../components/SideBar.vue";
import Loader from '../components/Loader.vue';


export default {
  name: "MovieDetails",
  components: {
    RouterLink,
    NavBar,
    SideBar,
    Loader
  },
  props: {

  },
  data() {
    return {
      loading: true,
      movie: null
    }
  },
  methods: {

  },
  created() {
    axios.get('/api/movie', { params: { token: localStorage.getItem('token'), movie_id: this.$route.params.movie_id } }).then((response) => {
      this.movie = response.data.data;
      this.loading = false;
    }).catch((error) => {
      console.log(error);
      this.loading = false;
    })
  }
}
</script>

<style scoped></style>
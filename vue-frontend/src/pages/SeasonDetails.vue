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
          <h3 className="text-lg font-medium mb-8">{{ this.show.title }}</h3>

          <!-- Show Info -->
          <div className='flex flex-row mb-10'>

            <!-- Show Poster -->
            <div className='flex flex-col mr-8'>
              <img className='w-72 h-475 object-fill rounded' :src="`${this.season.poster}`" :alt="`${this.season.title}`" />
            </div>

            <!-- Show Details -->
            <div className='flex flex-col'>

              <!-- Title -->
              <h3 className="text-3xl font-medium mb-4">{{this.season.title }}</h3>

              <!-- Ratings -->
              <div v-if="this.season.ratings_tmdb" className='flex flex-row items-center mb-6'>
                <img className='h-2.5 mr-3' src='@/assets/tmdb-logo.svg' alt='IMDb' />
                <h5 className='text-md font-medium'>{{ parseFloat(this.season.ratings_tmdb).toFixed(1) }} / 10</h5>
              </div>
              <div v-else className='mb-6'></div>

              <!-- Play Button -->
              <button className='flex items-center w-40 bg-amber-400 py-2 px-4 mb-8 rounded text-black font-medium text-lg hover:bg-amber-300'>Play</button>

              <!-- Description -->
              <p className='w-136 text-md font-medium'>{{ this.season.description }}</p>

            </div>
          </div>

          <!-- Seasons -->
          <h3 className="text-lg font-medium mb-8">Episodes</h3>

          <!-- List all of the seaons -->
          <div className="w-calc-screen flex flex-row w-full flex-wrap gap-6 mb-6">
            <div v-for="episode in this.episodes" :key="episode.id">
              <div className='flex flex-col'>
                <RouterLink className="flex flex-col p-1 rounded hover:bg-neutral-700 cursor-pointer" :to="`/show/${this.$route.params.show_id}/season/${this.$route.params.show_id}/episode/${episode.id}`">
                  <img className="w-80 h-48 object-fill rounded mb-2" :src="`${episode.poster}`" :alt="`${episode.title}`" />
                  <div className="font-medium mb-1 ml-1.5">{{ episode.title }}</div>
                  <div className="text-sm mb-1 ml-1.5 opacity-70">{{ `Episode ${episode.episode}` }}</div>
                </RouterLink>
              </div>
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
  name: "SeasonDetails",
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
      show: null,
      season: null,
      episodes: []
    }
  },
  methods: {

  },
  created() {
    axios.get('/api/show', { params: { token: localStorage.getItem('token'), show_id: this.$route.params.show_id } }).then((response) => {
      this.show = response.data.data.show;
      this.season = response.data.data.seasons.filter(x => x.id == this.$route.params.season_id)[0];
      this.episodes = response.data.data.episodes.filter(x => x.season_id == this.$route.params.season_id);
      this.loading = false;
    }).catch((error) => {
      console.log(error);
      this.loading = false;
    })
  }
}
</script>

<style scoped></style>
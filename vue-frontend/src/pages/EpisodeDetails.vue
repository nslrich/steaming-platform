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
          <div className='flex flex-col'>

            <!-- Show Poster -->
            <div className='flex flex-col mb-8'>
              <img className='w-108 h-60 object-fill rounded' :src="`${this.episode.poster}`" :alt="`${this.episode.title}`" /> 
            </div>

            <!-- Show Details -->
            <div className='flex flex-col ml-2'>

              <!-- Title -->
              <h3 className="text-3xl font-medium mb-2">{{ this.episode.title }}</h3>

              <!-- Season and Episode Numbers -->
              <div className='flex flew-row mb-1'>
                <h5 className="text-md font-sm mr-6">{{ `Season ${this.episode.season}` }}</h5>
                <h5 className="text-md font-sm">{{ `Episode ${this.episode.episode}` }}</h5>
              </div>

              <!-- Duration -->
              <h5 className="text-md font-sm mb-4">{{ `${this.episode.duration}min` }}</h5>

               <!-- Ratings -->
               <div v-if="this.episode.ratings_tmdb" className='flex flex-row items-center mb-6'>
                <img className='h-2.5 mr-3' src='@/assets/tmdb-logo.svg' alt='IMDb' />
                <h5 className='text-md font-medium'>{{ parseFloat(this.episode.ratings_tmdb).toFixed(1) }} / 10</h5>
              </div>
              <div v-else className='mb-6'></div>

              <!-- Play Button -->
              <RouterLink className='flex items-center w-40 bg-amber-400 py-2 px-4 mb-8 rounded text-black font-medium text-lg hover:bg-amber-300' :to="`/player/${this.episode.id}`">Play</RouterLink>

              <!-- Description -->
              <p className='w-136 text-md font-medium'>{{ this.episode.description }}</p>

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
  name: "EpisodeDetails",
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
      episode: null
    }
  },
  methods: {

  },
  created() {
    axios.get('/api/show', { params: { token: localStorage.getItem('token'), show_id: this.$route.params.show_id } }).then((response) => {
      this.show = response.data.data.show;
      this.season = response.data.data.seasons.filter(x => x.id == this.$route.params.season_id)[0];
      this.episode = response.data.data.episodes.filter(x => x.id == this.$route.params.episode_id)[0];
      this.loading = false;
    }).catch((error) => {
      console.log(error);
      this.loading = false;
    })
  }
}
</script>

<style scoped></style>
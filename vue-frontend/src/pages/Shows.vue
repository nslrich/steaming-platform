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
          <h3 className="text-lg font-medium mb-8">TV Shows</h3>

          <!-- List of all movies -->
          <div className="flex flex-row flex-wrap w-calc-screen gap-6">
            <div v-for="show in shows" :key="show.id">
              <RouterLink className="w-48 flex flex-col p-1 rounded hover:bg-neutral-700 cursor-pointer" :to="`/show/${show.id}`">
                <img className="w-48 h-68 object-cover rounded mb-2" :src="`${show.poster}`" :alt="`${show.title}`" />
                <div className="text-sm font-medium mb-1 ml-1.5 truncate">{{ show.title }}</div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "../components/NavBar.vue";
import SideBar from "../components/SideBar.vue";
import Loader from '../components/Loader.vue';

export default {
  name: "Shows",
  components: {
    NavBar,
    SideBar,
    Loader,
  },
  props: {

  },
  data() {
    return {
      loading: true,
      shows: [],
    }
  },
  methods: {

  },
  created() {
    axios.get('/api/shows', { params: { token: localStorage.getItem('token') } }).then((response) => {
      this.shows = response.data.data;
      this.loading = false;
    }).catch((error) => {
      console.log(error);
      this.loading = false;
    })
  }
}
</script>

<style scoped></style>
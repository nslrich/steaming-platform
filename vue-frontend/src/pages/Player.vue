<template>
  <!-- Page Container -->
  <div class="h-screen bg-white dark:bg-neutral-800 flex flex-col text-gray-300 pb-3">

    <!-- Nav Bar -->
    <NavBar />

    <!-- Main Container -->
    <div class="mt-20 mx-2 flex flex-row flex-grow custom-container">

      <!-- Main Content -->
      <div class="h-calc-screen flex flex-col flex-grow px-4 py-3 overflow-y-auto">

        <video className="video-player" controls="true" autoPlay>
          <source :src="`/api/stream/${this.$route.params.id}/${this.token}`" type='video/mp4' />
        </video>

      </div>
    </div>

  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import SideBar from "../components/SideBar.vue";

export default {
  name: "Player",
  components: {
    NavBar,
    SideBar
  },
  props: {

  },
  data() {
    return {
      token: null,
    }
  },
  methods: {

  },
  created() {
    this.token = localStorage.getItem('token');
  }
}
</script>

<style scoped></style>
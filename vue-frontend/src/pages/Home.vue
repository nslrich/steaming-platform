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
          <h3 className="text-lg font-medium mb-8">Continue Watching</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../components/Loader.vue";
import NavBar from "../components/NavBar.vue";
import SideBar from "../components/SideBar.vue";

export default {
  name: "Home",
  components: {
    NavBar,
    SideBar,
    Loader
  },
  props: {

  },
  data() {
    return {
      loading: true,
      continue: [],
    }
  },
  methods: {

  },
  created() {
    this.loading = false;
  }
}
</script>

<style scoped></style>
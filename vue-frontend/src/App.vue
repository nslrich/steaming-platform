<script>

// NPM Imports
import axios from 'axios';
import { RouterView } from 'vue-router';

// Components
import Login from './pages/Login.vue';

export default {
    name: "App",
    components: {
      Login
    },
    props: {
      
    },
    data () {
      return {
        loading: true,
        authenticated: false,
      }
    }, 
    methods: {
      setAuth(value) {
        console.log('here');
        this.authenticated = value;
      }
    },
    created () {
      var localToken = localStorage.getItem('token');
      if (localToken == null) {
        this.loading = false;
      } else {
        axios.get('/api/verify', { params: { token: localToken }}).then((response) => {
          this.authenticated = true;
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
        })
      }
    }
  }
</script>

<template>

  <div class="h-screen bg-white dark:bg-neutral-800 flex flex-col justify-center items-center text-white" v-if="this.loading">LOADING</div>
  <RouterView v-else-if="this.authenticated" />
  <Login v-else @setAuth="setAuth"/>
  
</template>

<style scoped></style>

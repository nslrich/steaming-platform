<template>
  <div className='h-screen bg-white dark:bg-neutral-800 flex flex-col justify-center items-center text-white'>
      <div className='flex flex-col rounded-md p-8 bg-neutral-600 h-130 w-128'>

        <h2 className='text-center text-2xl mb-0'>Login</h2>

        <div className='flex flex-col flex-grow justify-center'>

          <div className='flex flex-col mb-2'>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">Username</label>
            <input type="text" name="username" id="username" @change="setUsername" className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" placeholder="John.Doe" />
          </div>

          <div className='flex flex-col mb-2'>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password</label>
            <input type="password" name="password" id="password" @change="setPassword" onKeyDown="" className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" placeholder="*************" />
          </div>

        </div>

        <button
          className='bg-amber-400 py-3 px-5 rounded-3xl text-black disabled:opacity-60'
          disabled="true"
          v-if="this.loading"
        >Loading...</button>

        <button
          className='bg-amber-400 py-3 px-5 rounded-3xl text-black disabled:opacity-60'
          @click="login"
          v-else
        >Login</button>
      </div>
    </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Login",
    components: {
      
    },
    props: {
      
    },
    data () {
      return {
        loading: false,
        username: "",
        password: "",
      }
    }, 
    methods: {
      login () {

        // Set loading
        this.loading = true;

        // Check credentials
        axios.post('/api/signin', { username: this.username, password: this.password }).then((response) => {
          var token = response.data.token;
          localStorage.setItem('token', token);
          console.log('authed');
          this.$emit('setAuth', true);
        }).catch((error) => {
          console.log(error);
          this.loading = false;
        })
      },
      setUsername (event) {
        var { value } = event.target;
        this.username = value;
      },
      setPassword (event) {
        var { value } = event.target;
        this.password = value;
      },
    }
  }
</script>

<style scoped>

</style>
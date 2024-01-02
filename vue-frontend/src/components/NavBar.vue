<template>
  <!-- Container -->
  <div class="fixed dark:bg-neutral-900 z-20 top-2 left-0 right-0 flex flex-row mx-2 my-1 px-5 py-3 rounded">

    <div className='flex justify-start items-center cursor-pointer hover:bg-neutral-800 px-4'>
      <div class="">Menu</div>
    </div>

    <RouterLink to='/' className='flex justify-start items-center ml-4 cursor-pointer hover:bg-neutral-800 px-4'>
      <div class="">Home</div>
    </RouterLink>

    <div className='flex justify-start items-center ml-4 flex-grow'>
      <!-- <AiOutlineSearch color='rgb(229 231 235)' size={17} className='absolute ml-2' /> -->
      <input className='dark:bg-neutral-700 rounded pl-9 py-0.5 w-80' />
    </div>

    <RouterLink to='/settings' className='flex justify-start items-center mr-4 cursor-pointer hover:bg-neutral-800 px-4'>
      <div class="">Settings</div>
    </RouterLink>

    <div className='flex justify-start items-center  cursor-pointer hover:bg-neutral-800 px-4'>
      <div class="">Account</div>
    </div>

  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  name: "NavBar",
  components: {
    RouterLink
  },
  props: {

  },
  methods: {

  }
}
</script>

<style scoped></style>
<template>
  <div className="flex flex-col dark:bg-neutral-900 rounded w-64 h-full py-3 px-3 mr-3" id='sidebar'>

    <RouterLink to='/' className='flex justify-start items-center hover:bg-neutral-600 px-2 py-2 rounded'>
      <!-- <AiOutlineHome color='rgb(229 231 235)' size={20} /> -->
      <div className='ml-4'>Home</div>
    </RouterLink>

    <RouterLink to='/movies' className='flex justify-start items-center hover:bg-neutral-600 px-2 py-2 rounded'>
      <!-- <BsCameraReels color='rgb(229 231 235)' size={20} /> -->
      <div className='ml-4'>Movies</div>
    </RouterLink>

    <RouterLink to='/shows' className='flex justify-start items-center hover:bg-neutral-600 px-2 py-2 rounded'>
      <!-- <MdOutlineTv color='rgb(229 231 235)' size={20} /> -->
      <div className='ml-4'>Shows</div>
    </RouterLink>

  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  name: "SideBar",
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
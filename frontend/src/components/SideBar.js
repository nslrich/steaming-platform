// NPM Imports

// Redux

// Custom Components

// Icons
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineTv } from 'react-icons/md';
import { BsCameraReels } from 'react-icons/bs';

// Styling

// Main
function SideBar(props) {

  // State


  // Render
  return (
    <div className="flex flex-col dark:bg-neutral-900 rounded w-64 h-full py-3 px-3 mr-3">
      
      {/* Home / Library */}
      <a href='/' className='flex justify-start items-center hover:bg-neutral-600 px-2 py-2 rounded'>
        <AiOutlineHome color='rgb(229 231 235)' size={20} />
        <div className='ml-4'>Home</div>
      </a>

      {/* Movies Library */}
      <a href='/movies' className='flex justify-start items-center hover:bg-neutral-600 px-2 py-2 rounded'>
        <BsCameraReels color='rgb(229 231 235)' size={20} />
        <div className='ml-4'>Movies</div>
      </a>

      {/* Shows Library */}
      <a href='/shows' className='flex justify-start items-center hover:bg-neutral-600 px-2 py-2 rounded'>
        <MdOutlineTv color='rgb(229 231 235)' size={20} />
        <div className='ml-4'>Shows</div>
      </a>

    </div>
  )
};

// Export
export default SideBar;
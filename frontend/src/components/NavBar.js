// NPM Imports
import { Link } from 'react-router-dom';

// Redux

// Custom Components

// Icons
import { RxAvatar } from 'react-icons/rx';
import { FaWrench } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai';

// Styling

// Main
function NavBar(props) {

  // State


  // Render
  return (
    <div className='fixed dark:bg-neutral-900 z-20 top-2 left-0 right-0 flex flex-row mx-2 my-1 px-5 py-3 rounded'>

      {/* Menu Button */}
      <div className='flex justify-start items-center'>
        <AiOutlineMenu color='rgb(229 231 235)' size={20} />
      </div>

      {/* Home Button */}
      <Link to='/' className='flex justify-start items-center ml-4'>
        <AiOutlineHome color='rgb(229 231 235)' size={20} />
      </Link>

      {/* Search Bar */}
      <div className='flex justify-start items-center ml-4 flex-grow'>
        <AiOutlineSearch color='rgb(229 231 235)' size={17} className='absolute ml-2'/>
        <input className='dark:bg-neutral-700 rounded pl-9 py-0.5 w-80'/>
      </div>

      {/* Settings */}
      <Link to='/settings' className='flex justify-start items-center mr-4'>
        <FaWrench color='rgb(229 231 235)' size={20} />
      </Link>

      {/* Account */}
      <div className='flex justify-start items-center'>
        <RxAvatar color='rgb(229 231 235)' size={26} />
      </div>

    </div>
  )
};

// Export
export default NavBar;
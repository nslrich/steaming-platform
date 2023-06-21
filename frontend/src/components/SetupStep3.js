// NPM Imports
import { useState } from "react";

// Redux

// Custom Components
import FolderSelector from "./FolderSelector";

// Main
function SetupStep3({ state, onStateChange }) {

  // State
  const [showModal, setShowModal] = useState(false);

  // Render
  return (
    <>
      <h2 className='text-center text-2xl mb-4'>Default Settings</h2>
      <div className='flex flex-col grow'>

        <div className='flex flex-col mb-2'>
          <label htmlFor="movie_location" className="block text-sm font-medium leading-6 text-white">Movie Location</label>

          <div className='flex flex-row gap-2'>
            <input type="text" disabled={true} name="movie_location" id="movie_location" placeholder="C:\..." className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 disabled:bg-white" />

            <button className='bg-amber-400 rounded-md py-1.5 px-3 text-black'
              onClick={(e) => setShowModal(true)}
            > Change </button>
          </div>
        </div>

        <div className='flex flex-col mb-2'>
          <label htmlFor="show_location" className="block text-sm font-medium leading-6 text-white">Show Location</label>

          <div className='flex flex-row gap-2'>
            <input type="text" disabled={true} name="show_location" id="show_location" placeholder="C:\..." className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 disabled:bg-white" />

            <button className='bg-amber-400 rounded-md py-1.5 px-3 text-black'
              onClick={(e) => setShowModal(true)}
            > Change </button>
          </div>
        </div>
      </div>

      <FolderSelector
        showModal={showModal}
        onClose={(value) => setShowModal(value)}
        onSelect={(value) => { }}
      />
    </>
  );
};

export default SetupStep3;
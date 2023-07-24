// NPM Imports
import { useEffect, useState } from "react";

// Redux

// Custom Components
import FolderSelector from "./FolderSelector";

// Main
function SetupStep3({ state, onStateChange }) {

  // State
  const [showModal, setShowModal] = useState(false);
  const [target, setTarget] = useState(null);
  const [defaultPath, setDefaultPath] = useState(null);
  const [movieLocation, setMovieLocation] = useState(state.movie_location);
  const [showLocation, setShowLocation] = useState(state.show_location);

  // On Change of any of the state variables update the parent
  useEffect(() => {

    // Make a new state object
    const newState = {
      movie_location: movieLocation,
      show_location: showLocation
    };

    // Pass to parent
    onStateChange(newState);

  }, [movieLocation, showLocation]);

  // Render
  return (
    <>
      <h2 className='text-center text-2xl mb-4'>Default Settings</h2>
      <div className='flex flex-col grow'>

        <div className='flex flex-col mb-2'>
          <label htmlFor="movie_location" className="block text-sm font-medium leading-6 text-white">Movie Location</label>

          <div className='flex flex-row gap-2'>
            <input type="text" disabled={true} name="movie_location" id="movie_location" placeholder="C:\..." value={movieLocation} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 disabled:bg-white" />

            <button className='bg-amber-400 rounded-md py-1.5 px-3 text-black'
              onClick={(e) => {
                setTarget('movies');
                setDefaultPath(movieLocation === '' ? null : movieLocation);
                setShowModal(true);
              }}
            > Change </button>
          </div>
        </div>

        <div className='flex flex-col mb-2'>
          <label htmlFor="show_location" className="block text-sm font-medium leading-6 text-white">Show Location</label>

          <div className='flex flex-row gap-2'>
            <input type="text" disabled={true} name="show_location" id="show_location" placeholder="C:\..." value={showLocation} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 disabled:bg-white" />

            <button className='bg-amber-400 rounded-md py-1.5 px-3 text-black'
              onClick={(e) => {
                setTarget('shows');
                setDefaultPath(showLocation === '' ? null : showLocation);
                setShowModal(true);
              }}
            > Change </button>
          </div>
        </div>
      </div>

      <FolderSelector
        showModal={showModal}
        defaultPath={defaultPath}
        onClose={() => {
          setTarget(null);
          setDefaultPath(null);
          setShowModal(false);
        }}
        onSelect={(value) => {
          if (target === 'movies') {
            setMovieLocation(value);
          } else {
            setShowLocation(value);
          }

          setTarget(null);
          setDefaultPath(null);
          setShowModal(false);
        }}
      />
    </>
  );
};

export default SetupStep3;
// NPM Imports
import axios from 'axios';
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';
import { setContent } from '../store/content';

// Custom Components
import ImageLoader from '../components/ImageLoader';

// Styling

// Icons
import { BsPlayFill } from 'react-icons/bs';

// Main
function ShowDetails(props) {

  // Redux Dispatch
  const dispatch = useDispatch();

  // Show id
  const { show_id } = useParams();

  // State
  const [showDetails, setShowDetails] = useState(null);

  // On load get all shows
  useEffect(() => {

    // Get token out of local storage
    const token = localStorage.getItem('token');

    // Get shows
    axios.get('/api/show', { params: { token: token, show_id: show_id } }).then((response) => {

      // Set state
      setShowDetails(response.data.data);

      // Set Redux Store
      dispatch(setContent(response.data.data));

    }).catch((error) => {
      console.log(error);
    })
  }, []);


  // Render
  return (
    <>
      {showDetails === null
        ? null
        : (
          <div className="h-calc-screen flex flex-col flex-grow px-4 py-3 overflow-y-auto">

            {/* Title */}
            <h3 className="text-lg font-medium mb-8">TV Shows</h3>

            {/* Show info */}
            <div className='flex flex-row mb-10'>

              {/* Show Poster */}
              <div className='flex flex-col mr-8'>
                <img className='w-72 h-475 object-fill rounded' src={showDetails.show.poster} alt={showDetails.show.title} />
              </div>

              {/* Show Details */}
              <div className='flex flex-col'>

                {/* Title */}
                <h3 className="text-3xl font-medium mb-4">{showDetails.show.title}</h3>

                {/* Year */}
                <h5 className='text-md font-sm mb-1'>{showDetails.show.year}</h5>

                {/* Genres */}
                <h5 className='text-md font-sm mb-4'>{showDetails.show.genre}</h5>

                {/* Ratings */}
                {showDetails.show.ratings_tmdb === null
                  ? <div className='mb-6'></div>
                  : (
                    <div className='flex flex-row items-center mb-6'>
                      <img className='h-2.5 mr-3' src='/assets/tmdb-logo.svg' alt='IMDb' />
                      <h5 className='text-md font-medium'>{parseFloat(showDetails.show.ratings_tmdb).toFixed(1)} / 10</h5>
                    </div>
                  )
                }

                {/* Watch Button */}
                <button className='flex items-center w-40 bg-amber-400 py-2 px-4 mb-8 rounded text-black font-medium text-lg hover:bg-amber-300'><BsPlayFill size={30} /> Play</button>

                {/* Show Description */}
                <p className='w-136 text-md font-medium'>{showDetails.show.description}</p>

              </div>
            </div>

            {/* Seasons */}
            <h3 className="text-lg font-medium mb-8">Seasons</h3>

            {/* List all the seasons */}
            <div className="w-calc-screen flex flex-row w-full flex-wrap gap-6 mb-6">
              {showDetails.seasons.map((item, index) => (
                <div className='flex flex-col'>
                  <Link
                    key={item.id}
                    className="flex flex-col p-1 rounded hover:bg-neutral-700 cursor-pointer"
                    to={`/shows/${show_id}/season/${item.id}`}
                  >
                    <ImageLoader className="w-44 h-60 object-fill rounded mb-2" src={item.poster} alt={`Season ${item.season}`} />
                    {/* <img className="w-44 h-60 object-fill rounded mb-2" src={item.poster} alt={`Season ${item.season}`} /> */}
                    <div className="font-medium mb-1 ml-1.5">{`Season ${item.season}`}</div>
                    <div className="text-sm mb-1 ml-1.5 opacity-70">{`${showDetails.episodes.filter(x => x.season_id === item.id).length} episodes`}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      }
    </>
  )
};

// Export
export default ShowDetails;
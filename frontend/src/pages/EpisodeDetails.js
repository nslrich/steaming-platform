// NPM Imports
import axios from 'axios';
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

// Redux

// Custom Components
import ImageLoader from '../components/ImageLoader';

// Styling

// Icons
import { BsPlayFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';

// Main
function EpisodeDetails(props) {

  // Show id
  const { show_id, season_id, episode_id } = useParams();

  // State
  const showDetails = useSelector(state => state.content);

  // Selected Season
  const selectedEpisode = showDetails.episodes.find((x) => x.id === episode_id);

  // Render
  return (
    <>
      {showDetails === null
        ? null
        : (
          <div className="h-calc-screen flex flex-col flex-grow px-4 py-3 overflow-y-auto">

            {/* Title */}
            <h3 className="text-lg font-medium mb-8">{showDetails.show.title}</h3>

            {/* Show info */}
            <div className='flex flex-col'>

              {/* Show Poster */}
              <div className='flex flex-col mb-8'>
                <ImageLoader className='w-108 h-60 object-fill rounded' src={selectedEpisode.poster} alt={selectedEpisode.title} />
                {/* <img className='w-108 h-60 object-fill rounded' src={selectedEpisode.poster} alt={selectedEpisode.title} /> */}
              </div>

              {/* Show Details */}
              <div className='flex flex-col ml-2'>

                {/* Title */}
                <h3 className="text-3xl font-medium mb-2">{selectedEpisode.title}</h3>

                {/* Season and Episode */}
                <div className='flex flew-row mb-1'>
                  <h5 className="text-md font-sm mr-6">{`Season ${selectedEpisode.season}`}</h5>
                  <h5 className="text-md font-sm">{`Episode ${selectedEpisode.episode}`}</h5>
                </div>

                {/* Duration */}
                <h5 className="text-md font-sm mb-4">{`${selectedEpisode.duration}min`}</h5>

                {/* Ratings */}
                {selectedEpisode.ratings_tmdb === null
                  ? <div className='mb-6'></div>
                  : (
                    <div className='flex flex-row items-center mb-6'>
                      <img className='h-2.5 mr-3' src='/assets/tmdb-logo.svg' alt='IMDb' />
                      <h5 className='text-md font-medium'>{parseFloat(selectedEpisode.ratings_tmdb).toFixed(1)} / 10</h5>
                    </div>
                  )
                }

                {/* Watch Button */}
                <Link className='flex items-center w-40 bg-amber-400 py-2 px-4 mb-8 rounded text-black font-medium text-lg hover:bg-amber-300' to={`/player/${selectedEpisode.id}`}><BsPlayFill size={30} /> Play</Link>

                {/* Show Description */}
                <p className='w-136 text-md font-medium'>{selectedEpisode.description}</p>

              </div>
            </div>
          </div>
        )
      }
    </>
  )
};

// Export
export default EpisodeDetails;
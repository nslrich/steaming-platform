// NPM Imports
import axios from 'axios';
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

// Redux

// Custom Components

// Styling

// Icons
import { BsPlayFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import ImageLoader from '../components/ImageLoader';

// Main
function SeasonDetails(props) {

  // Show id
  const { show_id, season_id } = useParams();

  // State
  const showDetails = useSelector(state => state.content);

  // Selected Season
  const selectedSeason = showDetails.seasons.find((x) => x.id === season_id);

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
            <div className='flex flex-row mb-10'>

              {/* Show Poster */}
              <div className='flex flex-col mr-8'>
                <img className='w-72 h-475 object-fill rounded' src={selectedSeason.poster} alt={selectedSeason.title} />
              </div>

              {/* Show Details */}
              <div className='flex flex-col'>

                {/* Title */}
                <h3 className="text-3xl font-medium mb-4">{selectedSeason.title}</h3>

                {/* Ratings */}
                {selectedSeason.ratings_tmdb === null
                  ? <div className='mb-6'></div>
                  : (
                    <div className='flex flex-row items-center mb-6'>
                      <img className='h-2.5 mr-3' src='/assets/tmdb-logo.svg' alt='IMDb' />
                      <h5 className='text-md font-medium'>{parseFloat(selectedSeason.ratings_tmdb).toFixed(1)} / 10</h5>
                    </div>
                  )
                }

                {/* Watch Button */}
                <button className='flex items-center w-40 bg-amber-400 py-2 px-4 mb-8 rounded text-black font-medium text-lg hover:bg-amber-300'><BsPlayFill size={30} /> Play</button>

                {/* Show Description */}
                <p className='w-136 text-md font-medium'>{selectedSeason.description}</p>

              </div>
            </div>

            {/* Seasons */}
            <h3 className="text-lg font-medium mb-8">Episodes</h3>

            {/* List all the seasons */}
            <div className="w-calc-screen flex flex-row w-full gap-6 flex-wrap mb-6">
              {showDetails.episodes.filter(x => x.season === selectedSeason.season).map((item, index) => (
                <div className='flex flex-col'>
                  <Link key={item.id} className="flex flex-col p-1 rounded hover:bg-neutral-700 cursor-pointer" to={`/shows/${show_id}/season/${season_id}/episode/${item.id}`}>
                    <ImageLoader className="w-80 h-48 object-fill rounded mb-2" src={item.poster} alt={item.title} />
                    {/* <img className="w-80 h-48 object-fill rounded mb-2" src={item.poster} alt={item.title} /> */}
                    <div className="font-medium mb-1 ml-1.5">{item.title}</div>
                    <div className="text-sm mb-1 ml-1.5 opacity-70">{`Episode ${item.episode}`}</div>
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
export default SeasonDetails;
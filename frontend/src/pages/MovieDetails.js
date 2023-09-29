// NPM Imports
import axios from 'axios';
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setContent } from '../store/content';

// Custom Components

// Styling

// Icons
import { BsPlayFill } from 'react-icons/bs';
import ImageLoader from '../components/ImageLoader';

// Main
function MovieDetails(props) {

  // Redux Dispatch
  const dispatch = useDispatch();

  // Show id
  const { movie_id } = useParams();

  // State
  const movieDetails = useSelector(state => state.content.movie);

  // Render
  return (
    <>
      {movieDetails === null
        ? null
        : (
          <div className="h-calc-screen flex flex-col flex-grow px-4 py-3 overflow-y-auto">

            {/* Title */}
            <h3 className="text-lg font-medium mb-8">Movies</h3>

            {/* Show info */}
            <div className='flex flex-row mb-10'>

              {/* Show Poster */}
              <div className='flex flex-col mr-8'>
                <ImageLoader className='w-72 h-475 object-fill rounded' src={movieDetails.poster} alt={movieDetails.title} />
                {/* <img className='w-72 h-475 object-fill rounded' src={movieDetails.poster} alt={movieDetails.title} /> */}
              </div>

              {/* Show Details */}
              <div className='flex flex-col'>

                {/* Title */}
                <h3 className="text-3xl font-medium mb-4">{movieDetails.title}</h3>

                {/* Year */}
                <h5 className='text-md font-sm mb-1'>{movieDetails.year}</h5>

                {/* Genres */}
                <h5 className='text-md font-sm mb-1'>{movieDetails.genre}</h5>

                {/* Duration */}
                <h5 className="text-md font-sm mb-4">{`${movieDetails.duration}min`}</h5>

                {/* Ratings */}
                {movieDetails.ratings_tmdb === null
                  ? <div className='mb-6'></div>
                  : (
                    <div className='flex flex-row items-center mb-6'>
                      <img className='h-2.5 mr-3' src='/assets/tmdb-logo.svg' alt='IMDb' />
                      <h5 className='text-md font-medium'>{parseFloat(movieDetails.ratings_tmdb).toFixed(1)} / 10</h5>
                    </div>
                  )
                }

                {/* Watch Button */}
                <Link className='flex items-center w-40 bg-amber-400 py-2 px-4 mb-8 rounded text-black font-medium text-lg hover:bg-amber-300' to={`/player/${movieDetails.id}`}><BsPlayFill size={30} /> Play</Link>

                {/* Show Description */}
                <p className='w-136 text-md font-medium'>{movieDetails.description}</p>

              </div>
            </div>
          </div>
        )
      }
    </>
  )
};

// Export
export default MovieDetails;
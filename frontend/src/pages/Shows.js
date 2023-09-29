// NPM Imports
import axios from 'axios';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';
import { displayAlert } from '../store/alert';

// Custom Components
import ImageLoader from '../components/ImageLoader';

// Styling

// Main
function Shows(props) {

  // Dispatch
  const dispatch = useDispatch();

  // State
  const [allShows, setAllShows] = useState([]);

  // On load get all shows
  useEffect(() => {

    // Get token out of local storage
    const token = localStorage.getItem('token');

    // Get shows
    axios.get('/api/shows', { params: { token: token } }).then((response) => {
      
      // Set state
      setAllShows(response.data.data);

    }).catch((error) => {

      // Show alert
      dispatch(displayAlert({ 
        show: true,
        message: error.response.data.msg,
        variant: 'failure'
      }));
    })
  }, []);


  // Render
  return (
    <div className="h-calc-screen flex flex-col flex-grow px-4 py-3 overflow-y-auto">

      {/* Title */}
      <h3 className="text-lg font-medium mb-8">TV Shows</h3>
      
      {/* List of all shows */}
      <div className="flex flex-row flex-wrap w-calc-screen gap-6">
        {allShows.map((item) => (
          <Link 
            key={item.id} 
            className="w-48 flex flex-col p-1 rounded hover:bg-neutral-700 cursor-pointer" 
            to={`/shows/${item.id}`}
          >
            <ImageLoader className="w-48 h-68 object-cover rounded mb-2" src={item.poster} alt={item.title} />
            {/* <img className="w-48 h-68 object-cover rounded mb-2" src={item.poster} alt={item.title}/> */}
            <div className="text-sm font-medium mb-1 ml-1.5 truncate">{item.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
};

// Export
export default Shows;
// NPM Imports
import axios from 'axios';
import { useEffect, useState } from "react";

// Redux

// Custom Components

// Styling

// Main
function Shows(props) {

  // State
  const [allShows, setAllShows] = useState([]);

  // On load get all shows
  useEffect(() => {

    // Get token out of local storage
    const token = localStorage.getItem('token');

    // Get shows
    axios.get('/api/shows', { params: { token: token} }).then((response) => {
      
      // Set state
      setAllShows(response.data.data);

    }).catch((error) => {
      console.log(error);
    })
  }, []);

  // Render
  return (
    <div className="flex flex-col flex-grow px-4 py-3">
      
      {/* Continue Watching */}
      <div className="flex flex-row w-full gap-6">
        {allShows.map((item) => (
          <div key={item.id} className="flex flex-col">
            <img className="w-44 h-60 object-fill rounded mb-2" src={item.poster} alt={item.title}/>
            <div className="font-medium mb-1 ml-1.5">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
};

// Export
export default Shows;
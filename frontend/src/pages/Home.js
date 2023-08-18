// NPM Imports
import { useState } from "react"

// Redux

// Custom Components

// Styling

// Main
function Home(props) {

  // State
  const [continueWatching, setContinueWatching] = useState([
    { id: 'akld89a09sd8g', show_name: 'S.W.A.T', episode_name: 'Forget Shorty', season_number: 6, episode_number: 21, show_thumbnail: 'https://m.media-amazon.com/images/M/MV5BMTJkMGQxMGItMTlkOC00YWYzLWJhMDEtOTliNjcwNGM1MmFhXkEyXkFqcGdeQXVyNjg4NzAyOTA@._V1_FMjpg_UX1000_.jpg' },
    { id: 'oijags809u3oir', show_name: 'Ted Lasso', episode_name: 'So Long, Farewell', season_number: 3, episode_number: 12, show_thumbnail: 'https://m.media-amazon.com/images/M/MV5BMTdmZjBjZjQtY2JiNS00Y2ZlLTg2NzgtMjUzMGY2OTVmOWJiXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg' },
    { id: 'lkj;asdgoij903', show_name: 'Silo', episode_name: 'The Relic', season_number: 1, episode_number: 6, show_thumbnail: 'https://m.media-amazon.com/images/M/MV5BNTk3MGJkZGItNzRjYy00MDhiLWExMjUtOWU2Njc3YWRmOWE3XkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_FMjpg_UX1000_.jpg' },
  ]);

  // Render
  return (
    <div className="flex flex-col w-full px-4 py-3">
      
      {/* Continue Watching */}
      <h3 className="text-lg font-medium mb-4">Continue Watching</h3>
      <div className="flex flex-row w-full gap-6">
        {continueWatching.map((item) => (
          <div key={item.id} className="flex flex-col">
            <img className="w-44 h-60 object-fill rounded mb-2" src={item.show_thumbnail} alt={item.show_name}/>
            <div className="font-medium mb-1 ml-1.5">{item.show_name}</div>
            <div className="font-light text-sm text-gray-300 mb-1 ml-1.5">{item.episode_name}</div>
            <div className="font-light text-sm text-gray-300 ml-1.5">S{item.season_number} - E{item.episode_number}</div>
          </div>
        ))}
      </div>
    </div>
  )
};

// Export
export default Home;
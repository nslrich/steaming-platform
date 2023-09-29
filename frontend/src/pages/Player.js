// NPM Imports
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Redux

// Custom Components

// Styling

// Main
function Player(props) {

  // Params
  const { id } = useParams();

  // State
  const videoRef = useRef(null);
  const [controlsTimeout, setControlsTimeout] = useState(null);

  // Get user token
  const token = localStorage.getItem('token');

  // Video Ref
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.removeAttribute('src')
      videoRef.current.load()
    }
  });

  // On load hide/show sidbar
  useEffect(() => {

    // Hide side bar
    document.getElementById('sidebar').style.display = 'none';

    // On exit of page
    return () => {

      // Show side bar again
      document.getElementById('sidebar').style.display = 'flex';
    }
  }, []);


  // Render
  return (
    <div className="h-calc-screen flex flex-row flex-grow px-4 py-3 items-center justify-items-center">
      <video 
        className="video-player" 
        ref={videoRef} 
        controls={false} 
        autoPlay 
        onMouseEnter={(e) => {
          if (controlsTimeout !== null) {
            clearTimeout(controlsTimeout);
            setControlsTimeout(null);
          }
          document.getElementById('video-controls').classList.remove('video-controls-hidden');
        }}
        onMouseLeave={(e) => {
          if (controlsTimeout === null) {
            setControlsTimeout(setTimeout(() => {
              document.getElementById('video-controls').classList.add('video-controls-hidden');
            }, 2000))
          }
        }}
      >
        {/* <source src={`/api/stream/${id}/${token}`} type='video/mp4'></source> */}
      </video>

      {/* Custom Video Controls */}
      <div id="video-controls" className="video-controls"></div>
    </div>
  )
};

// Export
export default Player;
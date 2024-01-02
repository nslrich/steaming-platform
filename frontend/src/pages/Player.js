// NPM Imports
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Redux

// Custom Components

// Styling

// Icons
import { BiCaptions, BiFullscreen } from 'react-icons/bi';
import { BsPlayCircle, BsPauseCircle, BsFillSkipEndFill, BsFillSkipStartFill } from 'react-icons/bs';
import { RxSpeakerOff, RxSpeakerQuiet, RxSpeakerLoud } from 'react-icons/rx';
import { secondsToMinutes } from '../helpers/mathFunctions';

// Main
function Player(props) {

  // Params
  const { id } = useParams();

  // State
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolumne] = useState(1);
  const [seekingXY, setSeekingXY] = useState({ top: 0, left: 0 });
  const [seekingValue, setSeekingValue] = useState(0);
  const [controlsTimeout, setControlsTimeout] = useState(null);

  // Get user token
  const token = localStorage.getItem('token');

  // Video Ref
  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.pause()
  //     videoRef.current.removeAttribute('src')
  //     videoRef.current.load()
  //   }
  // });

  useEffect(() => {
    setVolumne(videoRef.current.volume);
  }, [videoRef]);

  // On load hide/show sidbar
  useEffect(() => {

    // Hide side bar
    document.getElementById('sidebar').style.display = 'none';

    // On exit of page
    return () => {

      // Show side bar again
      document.getElementById('sidebar').style.display = 'flex';

      // Check to see if there is a timeout waiting
      if (controlsTimeout !== null) {
        clearTimeout(controlsTimeout);
      }
    }
  }, []);

  // Render
  return (
    <div
      className="h-calc-screen flex flex-row flex-grow px-4 py-3 items-center justify-items-center"
      onMouseEnter={(e) => {
        if (controlsTimeout !== null) {
          clearTimeout(controlsTimeout);
          setControlsTimeout(null);
        }
        document.getElementById('video-controls').classList.remove('hidden');
      }}
      onMouseLeave={(e) => {
        if (controlsTimeout === null) {
          setControlsTimeout(setTimeout(() => {
            document.getElementById('video-controls').classList.add('hidden');
          }, 2000))
        }
      }}
    >
      <video
        className="video-player"
        ref={videoRef}
        controls={false}
        autoPlay
      >
        <source src={`/api/stream/${id}/${token}`} type='video/mp4'></source>
      </video>

      {/* Custom Video Controls */}
      <div id="video-controls" className="video-controls bg-neutral-900 flex flex-col opacity-90">

        {/* Progress bar */}
        <div className="flex flex-col w-full">

          {/* Progress bar */}
          <input
            id="video-progress"
            type="range"
            className="video-progress w-full h-1"
            min={0}
            value={videoRef.current === null ? 0 : videoRef.current.currentTime}
            onChange={(e) => {
              videoRef.current.currentTime = seekingValue;
            }}
            onMouseMove={(e) => {
              let w = e.target.offsetWidth;
              let x = e.nativeEvent.offsetX;
              let percents = x / w;
              let max = parseFloat(e.target.max);
              let display = percents * max;
              console.log(e);
              setSeekingXY({ x: e.screenX, y: e.screenY });
              setSeekingValue(display);
              document.getElementById('seeking-value').classList.remove('hidden');
            }}
            onMouseLeave={(e) => {
              document.getElementById('seeking-value').classList.add('hidden');
            }}
            max={videoRef.current === null ? 100 : videoRef.current.duration}
          ></input>

          <div
            id="seeking-value"
            className="hidden bg-neutral-700 px-2 py-1 z-20 text-xs absolute"
            style={{ ...seekingXY }}
          >
            {secondsToMinutes(seekingValue)}
          </div>

          {/* Current time and end time */}
          <div className="flex flex-row w-full justify-between">
            <h5 className="ml-1 text-xs">{videoRef.current === null ? null : secondsToMinutes(videoRef.current.currentTime)}</h5>
            <h5 className="mr-1 text-xs">{videoRef.current === null ? null : secondsToMinutes(videoRef.current.duration)}</h5>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-row flex-grow items-center px-5">

          {/* Sound slider */}
          <div className="flex flex-row items-center">
            {volume === 0
              ? <RxSpeakerOff size={25} className="hover:text-amber-400 mr-2" />
              : volume < 50
                ? <RxSpeakerQuiet size={25} className="hover:text-amber-400 mr-2" />
                : <RxSpeakerLoud size={25} className="hover:text-amber-400 mr-2" />
            }
            <input
              id="volume-slider"
              type="range"
              className="video-progress h-1"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => {
                const vol = e.target.value / 100;
                setVolumne(e.target.value);
                videoRef.current.volume = vol;
              }}
            ></input>
          </div>

          {/* Main controls */}
          <div className="flex flex-row flex-grow gap-5 justify-center">

            {/* Previous */}
            <BsFillSkipStartFill size={40} className="hover:text-amber-400" onClick={(e) => console.log(videoRef)} />

            {/* Play/Pause */}
            {!playing
              ? <BsPlayCircle size={40} className="hover:text-amber-400"
                onClick={(e) => {
                  videoRef.current.play();
                  setPlaying(true);
                }}
              />
              : <BsPauseCircle size={40} className="hover:text-amber-400"
                onClick={(e) => {
                  videoRef.current.pause();
                  setPlaying(false);
                }}
              />
            }

            {/* Next */}
            <BsFillSkipEndFill size={40} className="hover:text-amber-400" />
          </div>

          {/* Subtitles selector */}
          <div className="flex flex-row gap-6">
            <BiCaptions size={25} className="hover:text-amber-400" />
            <BiFullscreen size={20} className="hover:text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  )
};

// Export
export default Player;
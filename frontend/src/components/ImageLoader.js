// NPM Imports
import { useState } from "react";

// Icons


// Main
function ImageLoader({ className, src, alt }) {

  // State
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {loaded
        ? null
        : <img className={`${className}`} src="/assets/placeholder-img.jpg" alt="" />
      }
      <img className={`${className} ${loaded ? '' : 'hidden'}`} src={src} alt={alt} onLoad={(e) => { setLoaded(true) }} />
    </>
  )
}

export default ImageLoader;
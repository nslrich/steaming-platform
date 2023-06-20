// React Imports
import axios from 'axios';
import { useEffect, useState } from 'react';
import { RouterProvider } from "react-router-dom";

// Custon Router
import { router } from './routes';

// Custom Compenents
import Login from '../pages/Login';
import NavBar from '../components/NavBar';
import Setup from '../pages/Setup';
import SplashScreen from '../pages/SplashScreen';

// Main
function Router(props) {

  // State
  const [splashScreen, setSplashScreen] = useState(true);
  const [firstTimeSetup, setFirstTimeSetup] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // On page load, check for token
  useEffect(() => {

    // Check to see if this is the first time using the app
    // axios.get().then((response) => {

    // }).catch((error) => {

    // });

    // Get token from local storage
    const token = localStorage.getItem('token');

    // Make sure token is there
    if (token !== null) {

      // Validate token
      setAuthenticated(true);

    }

    
    
  }, []);

  // Render
  return (
    <>
      {splashScreen
        ? <SplashScreen />
        : firstTimeSetup
          ? <Setup />
          : authenticated
            ? (
              <>
                {/* Nav Bar */}
                <NavBar />

                {/* Routes */}
                <RouterProvider router={router} />
              </>
            )
            : <Login />
      }
    </>
  );
};

// Export
export default Router;
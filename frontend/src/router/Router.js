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
import SideBar from '../components/SideBar';
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
    axios.get('/api/setup').then((response) => {

      // Check response
      if (response.data.status === true) {

        // Run first time setup
        setFirstTimeSetup(true);
        setSplashScreen(false);

      } else {

        // Get token from local storage
        const token = localStorage.getItem('token');

        // Make sure token is there
        if (token !== null) {

          // Validate token
          setAuthenticated(true);
          setSplashScreen(false);

        } else {

          // Validate token
          setAuthenticated(false);
          setSplashScreen(false);
        }
      }
    }).catch((error) => {
      console.log(error);
    });

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

                <div className='main-content'>

                  {/* Side Bar */}
                  <SideBar />

                  {/* Routes */}
                  <RouterProvider router={router} />
                </div>
              </>
            )
            : <Login />
      }
    </>
  );
};

// Export
export default Router;
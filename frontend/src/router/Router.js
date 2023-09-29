// React Imports
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";

// Custon Router
import RouterRoutes from './RouterRoutes';

// Custom Compenents
import Alert from '../components/Alert';
import Login from '../pages/Login';
import NavBar from '../components/NavBar';
import Setup from '../pages/Setup';
import SideBar from '../components/SideBar';

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
      if (response.data.code === 0 && response.data.status === true) {

        // Run first time setup
        setFirstTimeSetup(true);
        setSplashScreen(false);

      } else {

        // Get token from local storage
        const token = localStorage.getItem('token');

        // Make sure token is there
        if (token !== null) {

          // Validate token
          axios.get('/api/verify', { params: { token: token } }).then((res) => {

            // All good.
            setAuthenticated(true);
            setSplashScreen(false);

          }).catch((error) => {

            // Token is invalid
            setAuthenticated(false);
            setSplashScreen(false);
          });
        } else {

          // No token
          setAuthenticated(false);
          setSplashScreen(false);
        }
      }
    }).catch((error) => {

      // Something bad happened.
      setAuthenticated(false);
      setSplashScreen(false);
    });
  }, []);

  // Render
  return (
    <>
      {splashScreen
        ? <div className='h-screen bg-white dark:bg-neutral-800 flex flex-col text-gray-300 pb-3'></div>
        : firstTimeSetup
          ? <Setup />
          : authenticated
            ? (
              <div className='h-screen bg-white dark:bg-neutral-800 flex flex-col text-gray-300 pb-3'>

                {/* Router */}
                <BrowserRouter>

                  {/* Nav Bar */}
                  <NavBar />

                  <div className='mt-20 mx-2 flex flex-row flex-grow custom-container'>

                    {/* Side Bar */}
                    <SideBar />

                    {/* Routes */}
                    <RouterRoutes />

                  </div>
                </BrowserRouter>
              </div>
            )
            : <Login />
      }

      <Alert />
    </>
  );
};

// Export
export default Router;
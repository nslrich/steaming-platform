// NPM Imports
import axios from "axios";
import { useState } from "react";

// Redux
import { useDispatch } from 'react-redux';
import { displayAlert } from "../store/alert";
import { setUser } from "../store/profile";

// Custom Components

// Styling

// Main
function Login(props) {

  // Redux
  const dispatch = useDispatch();

  // State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle key down for on enter
  const handleKeyDown = (e) => {

    // Check to see if user hit the enter key (username and password cannot be blank)
    if (e.key === 'Enter' && username !== '' && password !== '') {

      // Run the signin function
      signin();
    }
  };

  // Function to check credentials
  const signin = () => {

    // Setup body for request
    const body = {
      username: username,
      password: password
    };

    // Run request
    axios.post('/api/signin', body).then((res) => {

      // Get data out of the response
      const data = res.data;

      // Get the token out
      const token = data.token;

      // Save token in local storage
      localStorage.setItem('token', token);

      // Save user data in redux store
      dispatch(setUser(data.user));

      // Redirect to home page
      window.location.href = `/`;

    }).catch((error) => {
      
      // Show alert 
      dispatch(displayAlert({ message: 'Invalid username or password.', variant: 'failure' }));
    });
  };

  // Render
  return (
    <div className='h-screen bg-white dark:bg-neutral-800 flex flex-col justify-center items-center text-white'>
      <div className='flex flex-col rounded-md p-8 bg-neutral-600 h-130 w-128'>

        <h2 className='text-center text-2xl mb-0'>Login</h2>

        <div className='flex flex-col flex-grow justify-center'>

          <div className='flex flex-col mb-2'>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">Username</label>
            <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" placeholder="John" />
          </div>

          <div className='flex flex-col mb-2'>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password</label>
            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => handleKeyDown(e)} className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" placeholder="Doe" />
          </div>

        </div>

        <button
          className='bg-amber-400 py-3 px-5 rounded-3xl text-black disabled:opacity-60'
          disabled={username === '' || password === ''}
          onClick={(e) => signin()}
        >Login</button>
      </div>
    </div>
  )
};

// Export
export default Login;
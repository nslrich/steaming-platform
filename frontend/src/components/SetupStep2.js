// NPM Imports
import { useEffect, useState } from "react";

// Redux

// Custom Components

// Main
function SetupStep2({ state, onStateChange }) {

  // State
  const [firstName, setFirstName] = useState(state.first_name);
  const [lastName, setlastName] = useState(state.last_name);
  const [username, setUsername] = useState(state.username);
  const [password1, setPassword1] = useState(state.password);
  const [password2, setPassword2] = useState(state.confirm);

  // On Change of any of the state variables update the parent
  useEffect(() => {

    // Make a new state object
    const newState = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      password: password1,
      confirm: password2
    };

    // Pass to parent
    onStateChange(newState);

  }, [firstName, lastName, username, password1, password2]);

  // Render
  return (
    <>
      <h2 className='text-center text-2xl mb-4'>Lets setup your account</h2>
      <div className='flex flex-col grow'>
        <div className='flex flex-col mb-2'>
          <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-white">First Name</label>
          <input type="text" name="first_name" id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" placeholder="John" />
        </div>

        <div className='flex flex-col mb-2'>
          <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-white">Last Name</label>
          <input type="text" name="last_name" id="last_name" value={lastName} onChange={(e) => setlastName(e.target.value)} className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" placeholder="Doe" />
        </div>

        <div className='flex flex-col mb-2'>
          <label htmlFor="user_name" className="block text-sm font-medium leading-6 text-white">Username</label>
          <input type="text" name="user_name" id="user_name" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" placeholder="john_doe" />
        </div>

        <div className='flex flex-col mb-2'>
          <label htmlFor="password1" className="block text-sm font-medium leading-6 text-white">Password</label>
          <input type="password" name="password1" id="password1" value={password1} onChange={(e) => setPassword1(e.target.value)} className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" />
        </div>

        <div className='flex flex-col mb-4'>
          <label htmlFor="password2" className="block text-sm font-medium leading-6 text-white">Confirm Password</label>
          <input type="password" name="password2" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" />
        </div>
      </div>
    </>
  );
}

export default SetupStep2;
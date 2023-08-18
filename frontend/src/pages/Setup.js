// NPM Imports
import axios from 'axios';
import { useState } from 'react';

// Redux
import { useDispatch } from 'react-redux';
import { setUser } from '../store/profile';
import { displayAlert } from '../store/alert';

// Custom Components
import SetupStep1 from '../components/SetupStep1';
import SetupStep2 from '../components/SetupStep2';
import SetupStep3 from '../components/SetupStep3';

// Icons
import { BsArrowRight } from 'react-icons/bs';
import { RiNumber1, RiNumber2, RiNumber3 } from 'react-icons/ri';

// Main
function Setup(props) {

  // Redux
  const dispatch = useDispatch();

  // State
  const [step, setStep] = useState(1);

  // State for step 2
  const [stateStep2, setStateStep2] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm: ''
  });

  // State for step 3
  const [stateStep3, setStateStep3] = useState({
    movie_location: '',
    show_location: ''
  });

  // Function to verify if all fields where properly filled out for step 2
  const verifyStep2 = () => {

    // Failure check variable
    var fail = false;

    // Check first name
    if (stateStep2.first_name === '') {
      document.getElementById('first_name').classList.add('border-rose-500');
      fail = true;
    } else {
      document.getElementById('first_name').classList.remove('border-rose-500');
    }

    // Check last name
    if (stateStep2.first_name === '') {
      document.getElementById('last_name').classList.add('border-rose-500');
      fail = true;
    } else {
      document.getElementById('last_name').classList.remove('border-rose-500');
    }

    // Check username
    if (stateStep2.first_name === '') {
      document.getElementById('user_name').classList.add('border-rose-500');
      fail = true;
    } else {
      document.getElementById('user_name').classList.remove('border-rose-500');
    }

    // Check passwords
    if (stateStep2.password === '' || stateStep2.confirm === '') {
      document.getElementById('password1').classList.add('border-rose-500');
      document.getElementById('password2').classList.add('border-rose-500');
      fail = true;
    } else if (stateStep2.password !== stateStep2.confirm) {
      document.getElementById('password1').classList.add('border-rose-500');
      document.getElementById('password2').classList.add('border-rose-500');
      fail = true;
    } else {
      document.getElementById('password1').classList.remove('border-rose-500');
      document.getElementById('password2').classList.remove('border-rose-500');
    }

    // Check to see if anything failed
    if (!fail) {

      // Next step
      setStep(step + 1);
    }
  }

  // Function to verify if all fields where properly filled out for step 3
  const verifyStep3 = () => {

    // Failure check variable
    var fail = false;

    // Check movie path
    if (stateStep3.movie_location === '') {
      document.getElementById('movie_location').classList.add('disabled:border-rose-500');
      fail = true;
    } else {
      document.getElementById('movie_location').classList.remove('disabled:border-rose-500');
    }

    // Check show path
    if (stateStep3.show_location === '') {
      document.getElementById('show_location').classList.add('disabled:border-rose-500');
      fail = true;
    } else {
      document.getElementById('show_location').classList.remove('disabled:border-rose-500');
    }

    // Check to make sure paths are different
    if (stateStep3.show_location !== '' && stateStep3.movie_location !== '') {
      if (stateStep3.movie_location === stateStep3.show_location) {
        document.getElementById('movie_location').classList.add('disabled:border-rose-500');
        document.getElementById('show_location').classList.add('disabled:border-rose-500');
        fail = true;
      } else {
        document.getElementById('movie_location').classList.remove('disabled:border-rose-500');
        document.getElementById('show_location').classList.remove('disabled:border-rose-500');
      }
    }

    // Check to see if anything failed
    if (!fail) {

      // Setup body
      const body = {
        ...stateStep2,
        ...stateStep3
      };

      // Next step
      axios.post('/api/setup', body).then((response) => {

        // Check response
        if (response.data.code === 0) {

          // Get auth token out of response and store it in local storage
          localStorage.setItem('token', response.data.token);

          // Store user info in redux
          dispatch(setUser(response.data.user));

          // Redirect to home page
          window.location.href = `/`;

        } else {

          // Something went wrong.
          dispatch(displayAlert({ message: 'Something went wrong with setup. Refresh page and try again.', variant: 'failure' }));
        }
      }).catch((error) => {

        // Error
        dispatch(displayAlert({ message: 'Something went wrong with setup. Refresh page and try again.', variant: 'failure' }));
      });
    }
  };

  // Render
  return (
    <div className='h-screen bg-white dark:bg-neutral-800 flex flex-col justify-center items-center text-white'>
      <div className='flex flex-row items-center gap-4 mb-4'>

        <div className={step === 1 ? 'rounded-full p-4 bg-amber-400 text-black' : 'rounded-full p-4 bg-neutral-600'}>
          <RiNumber1 size={25} />
        </div>

        <BsArrowRight size={25} />

        <div className={step === 2 ? 'rounded-full p-4 bg-amber-400 text-black' : 'rounded-full p-4 bg-neutral-600'}>
          <RiNumber2 size={25} />
        </div>

        <BsArrowRight size={25} />

        <div className={step === 3 ? 'rounded-full p-4 bg-amber-400 text-black' : 'rounded-full p-4 bg-neutral-600'}>
          <RiNumber3 size={25} />
        </div>
      </div>

      <div className='flex flex-col rounded-md p-8 bg-neutral-600 h-130 w-128'>
        {step === 1
          ? <SetupStep1 />
          : step === 2
            ? <SetupStep2 state={stateStep2} onStateChange={(newState) => setStateStep2(newState)} />
            : step === 3
              ? <SetupStep3 state={stateStep3} onStateChange={(newState) => setStateStep3(newState)} />
              : null
        }

        <div className='flex justify-between'>

          <button
            className='bg-amber-400 py-3 px-5 rounded-3xl text-black'
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
            onClick={(e) => setStep(step - 1)}
          >Back</button>

          <button
            className='bg-amber-400 py-3 px-5 rounded-3xl text-black'
            onClick={(e) => {
              if (step === 3) {
                verifyStep3();
              } else if (step === 2) {
                verifyStep2();
              } else {
                setStep(step + 1);
              }
            }}
          >{step === 3 ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  )
};

// Export
export default Setup;
// NPM Imports
import { useState } from 'react';

// Redux

// Custom Components

// Icons
import { BsArrowRight } from 'react-icons/bs';
import { RiNumber1, RiNumber2, RiNumber3 } from 'react-icons/ri';

// Styling
import '../styling/pages/Setup.scss';

// Main
function Setup(props) {

  // State
  const [step, setStep] = useState(1);


  // Render
  return (
    <div className='setup'>
      <div className='steps'>

        <div className={step === 1 ? 'step current' : 'step'}>
          <RiNumber1 size={25} />
        </div>

        <BsArrowRight size={25} />

        <div className={step === 2 ? 'step current' : 'step'}>
          <RiNumber2 size={25} />
        </div>

        <BsArrowRight size={25} />

        <div className={step === 3 ? 'step current' : 'step'}>
          <RiNumber3 size={25} />
        </div>
      </div>

      <div className='container'>
        {step === 1
          ? (
            <>
              <h2>Welcome to Your Streamer</h2>
              <div>This guide will help you setup Your Streamer.</div>
            </>
          )
          : step === 2
            ? (
              <>
                <h2>Who are you?</h2>
                <div className='input-group'>
                  <label>First Name: </label>
                  <input></input>
                </div>
                <div className='input-group'>
                  <label>Last Name: </label>
                  <input></input>
                </div>
                <div className='input-group'>
                  <label>Username: </label>
                  <input></input>
                </div>
                <div className='input-group'>
                  <label>Password: </label>
                  <input type='password'></input>
                </div>
                <div className='input-group'>
                  <label>Confim: </label>
                  <input type='password'></input>
                </div>
              </>
            )
            : step === 3
              ? (
                <>
                  <h2>Default Settings</h2>
                  <div>Movie Location</div>
                  <div>Show Location</div>
                </>
              )
              : null
        }

        <div className='btn-bar'>

          <button
            className='btn'
            disabled={step === 1}
            onClick={(e) => setStep(step - 1)}
          >Back</button>

          <button
            className='btn'
            onClick={(e) => setStep(step + 1)}
          >{step === 3 ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  )
};

// Export
export default Setup;
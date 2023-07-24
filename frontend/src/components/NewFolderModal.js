// NPM Imports
import axios from 'axios';
import { useState } from 'react';

// Redux

// Custom Components

// Icons

// Main
function NewFolderModal({ showModal, onClose, onSelect }) {

  // State
  const [name, setName] = useState('');

  // Render
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none"
            onClick={(e) => onClose()}
          >
            <div className="flex flex-col items-center rounded-md p-8 bg-neutral-600 h-64 w-128" onClick={(e) => e.stopPropagation()}>
              <h2 className='text-center text-2xl mb-4'>New folder</h2>

              <div className='flex flex-col mb-4 w-4/5'>
                <label htmlFor="new_folder" className="block text-sm font-medium leading-6 text-white">Folder Name</label>
                <input type="text" name="new_folder" id="new_folder" value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-md border-2 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" placeholder="Folder_name" />
              </div>

              <div className='flex flex-row justify-between w-4/5'>

                <button
                  className='bg-amber-400 py-3 px-5 rounded-3xl text-black'
                  onClick={(e) => onClose()}
                >Cancel</button>

                <button
                  className='bg-amber-400 py-3 px-5 rounded-3xl text-black'
                  onClick={(e) => onSelect(name)}
                >Select</button>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-30 bg-black"></div>
        </>
      ) : null
      }
    </>
  )
};

// Export
export default NewFolderModal;
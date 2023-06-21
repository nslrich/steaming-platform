// NPM Imports

// Redux

// Custom Components

// Icons
import { BsArrow90DegUp, BsFolderPlus } from 'react-icons/bs';

// Main
function FolderSelector({ showModal, onClose, onSelect }) {

  // State


  // Render
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={(e) => onClose(false)}
          >
            <div className="flex flex-col items-center rounded-md p-8 bg-neutral-600 h-136 w-128" onClick={(e) => e.stopPropagation()}>
              <h2 className='text-center text-2xl mb-4'>Select a folder</h2>

              <div className='flex flex-row justify-start mb-2 w-4/5 gap-2'>
                <button className='rounded-md bg-neutral-400 bg px-3 py-2'>
                  <BsArrow90DegUp size={25} />
                </button>

                <button className='rounded-md bg-neutral-400 bg px-3 py-2'>
                  <BsFolderPlus size={25} />
                </button>
              </div>

              <div className="flex flex-col grow rounded-md bg-neutral-300 w-4/5 mb-4">

              </div>

              <div className='flex flex-row justify-between w-4/5'>

                <button
                  className='bg-amber-400 py-3 px-5 rounded-3xl text-black'
                  onClick={(e) => onClose(false)}
                >Cancel</button>

                <button
                  className='bg-amber-400 py-3 px-5 rounded-3xl text-black'
                  onClick={(e) => { }}
                >Select</button>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null
      }
    </>
  )
};

// Export
export default FolderSelector;
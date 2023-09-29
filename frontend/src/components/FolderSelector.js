// NPM Imports
import axios from 'axios';
import { useEffect, useState } from 'react';

// Redux

// Custom Components
import NewFolderModal from './NewFolderModal';

// Icons
import { BsArrow90DegUp, BsFolderPlus } from 'react-icons/bs';

// Main
function FolderSelector({ showModal, defaultPath, onClose, onSelect }) {

  // State
  const [path, setPath] = useState(defaultPath);
  const [drives, setDrives] = useState([]);
  const [folders, setFolders] = useState([]);
  const [showNewFolder, setShowNewFolder] = useState(false);

  // On load get folders
  useEffect(() => {
    getDrives();
    getFolders(null);
  }, []);

  // On load defaultPath
  useEffect(() => {
    getFolders(defaultPath);
  }, [defaultPath]);

  // Function to get folders
  const getDrives = () => {

    // Get request
    axios.get('/api/drives').then((response) => {

      // Set state
      setDrives(response.data);

    }).catch((error) => {
      console.log(error);
    });
  }

  // Function to get folders
  const getFolders = (dir) => {

    // Get request
    axios.get('/api/folders', { params: { path: dir } }).then((response) => {

      // Set state
      setPath(response.data.path);
      setFolders(response.data.folders);

    }).catch((error) => {
      console.log(error);
    });
  }

  // Function to create new folder
  const newFolder = (folderName) => {

    // Create folder request
    axios.post('/api/folder', { path: path, folder_name: folderName }).then((response) => {

      // Set state
      setPath(response.data.path);
      setFolders(response.data.folders);
      setShowNewFolder(false);

    }).catch((error) => {
      console.log(error);
    });
  }

  // Render
  return (
    <>
      {showModal ? (
        <>

          {/* Modal Container */}
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-20 outline-none focus:outline-none"
            onClick={(e) => onClose()}
          >

            {/* Modal Window */}
            <div className="flex flex-col items-center rounded-md p-8 bg-neutral-600 h-136 w-136" onClick={(e) => e.stopPropagation()}>

              {/* Title */}
              <h2 className='text-center text-2xl mb-4'>Select a folder</h2>

              <div className='flex flex-row gap-2 w-4/5 h-96'>

                {/* Drives List */}
                <div className='flex flex-col w-1/4'>

                  {/* Sub Title */}
                  <h2 className='text-md mb-6'>Drives</h2>

                  {/* List Drives */}
                  <div className="flex flex-col grow rounded-md bg-neutral-300 w-4/5 mb-4 p-1 overflow-auto text-black">
                    {drives.map((value, index) => (
                      <div
                        key={`folder-${index}`}
                        className={path.startsWith(value) ? 'bg-amber-400 hover:bg-neutral-400 cursor-pointer rounded px-1' : 'hover:bg-neutral-400 cursor-pointer rounded px-1'}
                        onClick={(e) => getFolders(value + '\\')}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Folders List */}
                <div className='flex flex-col w-3/4'>

                  {/* Buttons */}
                  <div className='flex flex-row justify-start mb-2 gap-2'>
                    <button
                      className='rounded-md bg-neutral-400 bg px-3 py-2'
                      onClick={(e) => {
                        var arr = path.split('\\');
                        arr.pop();
                        getFolders(arr.join('\\'));
                      }}
                    >
                      <BsArrow90DegUp size={25} />
                    </button>

                    <button
                      className='rounded-md bg-neutral-400 bg px-3 py-2'
                      onClick={(e) => setShowNewFolder(true)}
                    >
                      <BsFolderPlus size={25} />
                    </button>
                  </div>

                  {/* List out folders */}
                  <div className="flex flex-col grow rounded-md bg-neutral-300 mb-4 p-1 overflow-auto text-black">
                    {folders.map((value, index) => (
                      <div
                        key={`folder-${index}`}
                        className='hover:bg-neutral-400 cursor-pointer rounded px-1'
                        onClick={(e) => getFolders(path + '\\' + value)}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='flex flex-col mb-4 w-4/5'>
                <label htmlFor="current_path" className="block text-sm font-medium leading-6 text-white">Current Location</label>
                <input type="text" disabled={true} name="current_path" id="current_path" placeholder="C:\..." value={path} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 disabled:bg-white" />
              </div>

              <div className='flex flex-row justify-between w-4/5'>

                <button
                  className='bg-amber-400 py-3 px-5 rounded-3xl text-black'
                  onClick={(e) => onClose()}
                >Cancel</button>

                <button
                  className='bg-amber-400 py-3 px-5 rounded-3xl text-black'
                  onClick={(e) => onSelect(path)}
                >Select</button>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-10 bg-black"></div>
        </>
      ) : null
      }

      <NewFolderModal
        showModal={showNewFolder}
        onClose={() => setShowNewFolder(false)}
        onSelect={(value) => newFolder(value)}
      />
    </>
  )
};

// Export
export default FolderSelector;
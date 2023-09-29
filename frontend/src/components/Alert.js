// NPM Imports
import { useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { hideAlert } from "../store/alert";

// Custom Components

// Styling

// Main
function Alert(props) {

  // Redux
  const dispatch = useDispatch();

  // State
  const show = useSelector((state) => state.alert.show);
  const message = useSelector((state) => state.alert.message);
  const variant = useSelector((state) => state.alert.variant);

  // On change of show
  useEffect(() => {

    // Get the div by id
    const alert = document.getElementById('alert');

    // Show alert box
    if (show) {

      // Remove display none
      alert.classList.remove('hidden');

      // Set timeout to hide alert in 3 seconds
      setTimeout(() => {

        // Hide alert
        dispatch(hideAlert());

      }, 3000);

    } else {

      // Add display none
      alert.classList.add('hidden');
    }
  }, [show]);
  
  // On change of variant change the classname to include the correct color
  useEffect(() => {

    // Get the div by id
    const alert = document.getElementById('alert-box');

    // Remove all colors first
    alert.classList.remove('bg-red-400');
    alert.classList.remove('bg-yellow-400');
    alert.classList.remove('bg-green-500');
    alert.classList.remove('bg-blue-500');
    
    // Set the proper color
    if (variant === 'failure') {
      alert.classList.add('bg-red-400');
    } else if (variant === 'warning') {
      alert.classList.add('bg-yellow-400');
    } else if (variant === 'success') {
      alert.classList.add('bg-green-400');
    } else if (variant === 'other') {
      alert.classList.add('bg-blue-400');
    }
  }, [variant]);

  // Render
  return (
    <div id='alert' className="hidden fixed z-50 top-7 left-0 right-0 flex justify-center">
      <div id='alert-box' className="rounded-lg py-3 px-5">{message}</div>
    </div>
  )
};

// Export
export default Alert;
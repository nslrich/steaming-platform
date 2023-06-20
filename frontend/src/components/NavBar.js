// NPM Imports

// Redux

// Custom Components

// Icons
import { AiOutlineMenu } from 'react-icons/ai';

// Styling
import '../styling/components/NavBar.scss';

// Main
function NavBar(props) {

  // State


  // Render
  return (
    <div className='nav-bar'>
      <div className='nav-bar-item'>
        <AiOutlineMenu color='white' size={20}/>
      </div>
    </div>
  )
};

// Export
export default NavBar;
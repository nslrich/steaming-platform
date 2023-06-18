// Redux Imports
import { configureStore } from '@reduxjs/toolkit';

// Reducers
import profile from './profile';
import content from './content';

// Export store
export default configureStore({
  reducer: {
    profile: profile,
    content: content
  },
})
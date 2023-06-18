// Redux Imports
import { configureStore } from '@reduxjs/toolkit';

// Reducers
import profile from './profile';

// Export store
export default configureStore({
  reducer: {
    profile: profile,
  },
})
// Redux Imports
import { configureStore } from '@reduxjs/toolkit';

// Reducers
import profile from './profile';
import content from './content';
import alert from './alert';

// Export store
export default configureStore({
  reducer: {
    profile: profile,
    content: content,
    alert: alert,
  },
})
// Redux Imports
import { createSlice } from '@reduxjs/toolkit';

// Create slice for store reducers
export const alert = createSlice({
  name: 'alert',
  initialState: {
    show: false,
    message: '',
    variant: 'failure',
  },
  reducers: {
    displayAlert: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.variant = action.payload.variant;
    },
    hideAlert: (state) => {
      state.show = false;
      state.message = '';
      state.variant = 'failure';
    },
  },
});

// Functions to change state
export const { displayAlert, hideAlert } = alert.actions;

// Default export for store creation
export default alert.reducer;
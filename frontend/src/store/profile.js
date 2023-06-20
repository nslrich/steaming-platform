// Redux Imports
import { createSlice } from '@reduxjs/toolkit';

// Create slice for store reducers
export const profile = createSlice({
  name: 'profile',
  initialState: {
    id: null,
    first_name: null,
    last_name: null,
    role: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.role = action.payload.role;
    },
  },
});

// Functions to change state
export const { setUser } = profile.actions;

// Default export for store creation
export default profile.reducer;
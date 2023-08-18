// Redux Imports
import { createSlice } from '@reduxjs/toolkit';

// Create slice for store reducers
export const content = createSlice({
  name: 'content',
  initialState: {
    id: null,
    title: null,
  },
  reducers: {
    setID: (state, action) => {
      state.id = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
  },
});

// Functions to change state
export const { setID, setTitle } = content.actions;

// Default export for store creation
export default content.reducer;
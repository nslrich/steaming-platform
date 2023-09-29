// Redux Imports
import { createSlice } from '@reduxjs/toolkit';

// Create slice for store reducers
export const content = createSlice({
  name: 'content',
  initialState: {
    movie: {},
    show: {},
    seasons: [],
    episodes: []
  },
  reducers: {
    setContent: (state, action) => {
      state.movie = action.payload.movie === undefined ? {} : action.payload.movie;
      state.show = action.payload.show === undefined ? {} : action.payload.show;
      state.seasons = action.payload.seasons === undefined ? [] : action.payload.seasons;
      state.episodes = action.payload.episodes === undefined ? [] : action.payload.episodes;
    },
    clearContent: (state, action) => {
      state = {
        show: null,
        seasons: null,
        episodes: null,
      }
    }
  },
});

// Functions to change state
export const { setContent, clearContent } = content.actions;

// Default export for store creation
export default content.reducer;
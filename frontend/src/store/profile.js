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
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
});

// Functions to change state
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Default export for store creation
export default profile.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialSocketState = {
  socket: null
};

const socketSlice = createSlice({
  name: 'socket',
  initialState: initialSocketState,
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
    }
  }
});

export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;

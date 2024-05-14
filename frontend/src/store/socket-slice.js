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
    },
    closeSocket(state) {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
    emitSocketEvent(state, action) {
      console.log('emitSocketEventtt', action)
      const { eventName, data } = action.payload;
      console.log('eventName, data', action.payload, data)

      if (state.socket) {
        state.socket.emit(eventName, data);
      } else {
        console.error('Socket not initialized.');
      }
    }
  }
});

export const { setSocket, closeSocket, emitSocketEvent } = socketSlice.actions;

export default socketSlice.reducer;

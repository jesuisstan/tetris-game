import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_BACKEND_PORT}`;

const initialSocketState = {
  socket: null
};

const socketSlice = createSlice({
  name: 'socket',
  initialState: initialSocketState,
  reducers: {
    initializeSocket(state, action) {
      const socket = io.connect(BASE_URL, { closeOnBeforeunload: true });
      state.socket = socket;
    },
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
      const { eventName, data } = action.payload;
      if (state.socket) {
        state.socket.emit(eventName, data);
      }
    },
    listenSocketEvent(state, action) {
      const { eventName, callback } = action.payload;
      if (state.socket) {
        state.socket.on(eventName, callback);
      }
    },
    stopListeningSocketEvent(state, action) {
      const { eventName, callback } = action.payload;
      if (state.socket) {
        state.socket.off(eventName, callback);
      }
    }
  }
});

export const {
  setSocket,
  closeSocket,
  initializeSocket,
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} = socketSlice.actions;

export default socketSlice.reducer;

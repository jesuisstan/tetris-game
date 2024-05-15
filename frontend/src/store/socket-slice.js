import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';

const BASE_URL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`;

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
    initializeSocket(state, action) {
      const socket = io.connect(BASE_URL, { closeOnBeforeunload: true });
      state.socket = socket;
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
    },
    //checkRoomPresence(state, action) {
    //  const { roomName, successCallback, errorCallback } = action.payload;
    //  if (state.socket) {
    //    state.socket.emit('check_room_presence', { roomName });

    //    const timeoutId = setTimeout(() => {
    //      errorCallback('Room presence check timed out');
    //    }, 5000);

    //    state.socket.once('room_exists', (presence) => {
    //      clearTimeout(timeoutId); // Clear timeout if response received before timeout
    //      if (presence) {
    //        successCallback();
    //      } else {
    //        errorCallback('No such a room exists');
    //      }
    //    });
    //  }
    //},
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

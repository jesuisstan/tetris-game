// socketMiddleware.js

import io from 'socket.io-client';
import { setSocket } from '../store/socket-slice';

let socket;

export const initializeSocket = (baseUrl, dispatch) => {
  socket = io.connect(baseUrl);
  dispatch(setSocket(socket));
};

export const getSocket = () => {
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const emitEvent = (eventName, data) => {
  if (socket) {
    socket.emit(eventName, data);
  } else {
    console.error('Socket not initialized.');
  }
};

export const listenEvent = (eventName, callback) => {
  if (socket) {
    socket.on(eventName, callback);
  } else {
    console.error('Socket not initialized.');
  }
};

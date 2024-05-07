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
  console.log('CLOSE 1');

  if (socket) {
    console.log('CLOSE 2');

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

export const stopListeningEvent = (eventName, callback) => {
  if (socket) {
    socket.off(eventName, callback);
  } else {
    console.error('Socket not initialized.');
  }
};

export const getRoomsList = () => {
  return new Promise((resolve, reject) => {
    emitEvent('get_rooms_list', null); // Emitting get_rooms_list event

    listenEvent('update_rooms', (data) => {
      // Listening for update_rooms event
      resolve(data.roomsList);
    });
  });
};

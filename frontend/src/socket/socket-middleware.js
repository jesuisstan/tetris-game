import io from 'socket.io-client';
import { setSocket } from '../store/socket-slice';

const BASE_URL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`;

let socket;

export const initializeSocket = (dispatch) => {
  socket = io.connect(BASE_URL, { closeOnBeforeunload: true }); // closeOnBeforeunload is to disconnect socket immediatly on page reloading
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

export const checkRoomPresence = async (roomName) => {
  return new Promise((resolve, reject) => {
    emitEvent('check_room_presence', { roomName }); // Emitting check_room_presence event

    const handleRoomPresence = (presence) => {
      clearTimeout(timeoutId); // Clear the timeout once result received
      stopListeningEvent('room_exists', handleRoomPresence); // Stop listening once result received
      resolve(presence);
    };

    listenEvent('room_exists', handleRoomPresence); // Listening for room_presence_result event

    // Set a timeout to reject the promise if no room_presence_result occurs within a certain time
    const timeoutId = setTimeout(() => {
      stopListeningEvent('room_exists', handleRoomPresence); // Stop listening if timeout occurs
      reject(new Error('Room presence check timed out'));
    }, 5000); // Timeout after 5 seconds (adjust as needed)
  });
};

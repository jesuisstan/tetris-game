import {
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../store/socket-slice';

export const checkRoomPresence = (roomName, dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(
      emitSocketEvent({
        eventName: 'check_room_presence',
        data: { roomName: roomName }
      })
    );

    const handleRoomPresence = (presence) => {
      clearTimeout(timeoutId);
      dispatch(
        stopListeningSocketEvent({
          eventName: 'room_exists',
          callback: handleRoomPresence
        })
      );
      resolve(presence);
    };

    dispatch(
      listenSocketEvent({
        eventName: 'room_exists',
        callback: handleRoomPresence
      })
    );

    const timeoutId = setTimeout(() => {
      dispatch(
        stopListeningSocketEvent({
          eventName: 'room_exists',
          callback: handleRoomPresence
        })
      );
      reject(new Error('Room presence check timed out'));
    }, 5000);
  });
};

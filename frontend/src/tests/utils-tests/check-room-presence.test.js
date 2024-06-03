import {
  checkRoomPresence
} from '../../utils/check-room-presence';
import {
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';
import { jest } from '@jest/globals';

jest.useFakeTimers();

describe('checkRoomPresence', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('should dispatch listenSocketEvent and stopListeningSocketEvent', async () => {
    const roomName = 'test-room';

    const promise = checkRoomPresence(roomName, dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      emitSocketEvent({
        eventName: 'check_room_presence',
        data: { roomName }
      })
    );

    expect(dispatch).toHaveBeenCalledWith(
      listenSocketEvent({
        eventName: 'room_exists',
        callback: expect.any(Function)
      })
    );

    jest.runAllTimers();

    await expect(promise).rejects.toThrow('Room presence check timed out');

    expect(dispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'room_exists',
        callback: expect.any(Function)
      })
    );
  });
});

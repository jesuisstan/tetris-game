import { checkRoomPresence } from '../../utils/check-room-presence';
import { listenSocketEvent, stopListeningSocketEvent } from '../../store/socket-slice'

jest.useFakeTimers();

describe('checkRoomPresence', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('should dispatch listenSocketEvent and stopListeningSocketEvent', async () => {
    const promise = checkRoomPresence()(dispatch);

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
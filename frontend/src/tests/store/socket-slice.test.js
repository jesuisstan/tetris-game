import { configureStore } from '@reduxjs/toolkit';
import socketReducer, {
  initializeSocket,
  setSocket,
  closeSocket,
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';

// Mock the socket.io-client module
jest.mock('socket.io-client', () => {
  return {
    __esModule: true,
    default: {
      connect: jest.fn(),
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      disconnect: jest.fn()
    },
    io: jest.fn()
  };
});

describe('socket reducer', () => {
  let store;
  let mockSocket;

  beforeEach(() => {
    mockSocket = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      disconnect: jest.fn()
    };

    require('socket.io-client').default.connect.mockReturnValue(mockSocket);

    store = configureStore({
      reducer: {
        socket: socketReducer
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [
              initializeSocket.type,
              setSocket.type,
              closeSocket.type,
              emitSocketEvent.type,
              listenSocketEvent.type,
              stopListeningSocketEvent.type
            ],
            ignoredActionPaths: ['payload.socket', 'payload.callback'],
            ignoredPaths: ['socket']
          }
        })
    });
  });

  it('should initialize socket', () => {
    store.dispatch(initializeSocket());
    const socket = store.getState().socket.socket;
    expect(socket).not.toBeNull();
  });

  it('should set socket', () => {
    store.dispatch(setSocket(mockSocket));
    const socket = store.getState().socket.socket;
    expect(socket).toBe(mockSocket);
  });

  it('should close socket', () => {
    store.dispatch(initializeSocket());
    store.dispatch(closeSocket());
    const socket = store.getState().socket.socket;
    expect(socket).toBeNull();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should emit socket event', () => {
    const eventName = 'testEvent';
    const data = { key: 'value' };
    store.dispatch(setSocket(mockSocket));
    store.dispatch(emitSocketEvent({ eventName, data }));
    expect(mockSocket.emit).toHaveBeenCalledWith(eventName, data);
  });

  it('should listen to socket event', () => {
    const eventName = 'testEvent';
    const callback = jest.fn();
    store.dispatch(setSocket(mockSocket));
    store.dispatch(listenSocketEvent({ eventName, callback }));
    expect(mockSocket.on).toHaveBeenCalledWith(eventName, callback);
  });

  it('should stop listening to socket event', () => {
    const eventName = 'testEvent';
    const callback = jest.fn();
    store.dispatch(setSocket(mockSocket));
    store.dispatch(stopListeningSocketEvent({ eventName, callback }));
    expect(mockSocket.off).toHaveBeenCalledWith(eventName, callback);
  });
});

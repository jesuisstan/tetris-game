import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../store/index';
import socketReducer, {
  initializeSocket,
  emitSocketEvent
} from '../../store/socket-slice';

// Mock the socket.io-client module
jest.mock('socket.io-client', () => {
  return {
    __esModule: true,
    default: {
      connect: jest.fn()
    },
    io: jest.fn()
  };
});

describe('socket reducer', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        socket: socketReducer
      }
    });
  });

  it('should initialize socket', () => {
    store.dispatch(initializeSocket());
    const socket = store.getState().socket.socket;
    expect(socket).not.toBeNull();
  });
});

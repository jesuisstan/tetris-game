import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import JoinRoomBlock from '../../components/Lobby/JoinRoomBlock';
import { createData, checkAccess } from '../../components/Lobby/JoinRoomBlock';
import {
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';

jest.useFakeTimers();
jest.mock('@mui/material/Table', () => ({
  ...jest.requireActual('@mui/material/Table'),
  Table: jest.fn(({ children }) => <table>{children}</table>),
  TableRow: jest.fn(({ children }) => <tr>{children}</tr>),
  TableCell: jest.fn(({ children }) => <td>{children}</td>)
}));

jest.mock('socket.io-client', () => {
  return {
    __esModule: true,
    default: {
      connect: jest.fn()
    },
    io: jest.fn()
  };
});

// Mock modules and components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('../../components/UI/TetrisLoader', () => () => (
  <div>TetrisLoader</div>
));

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseSelector = (state) => state;

// Mock initial state
const initialState = {
  socket: {
    socket: { emit: jest.fn() }
  },
  user: {
    user: null
  }
};

const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice
  },
  preloadedState: initialState
});

beforeEach(() => {
  jest.clearAllMocks();
  mockDispatch.mockClear(); // Reset the mock dispatch function
  require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  require('react-redux').useSelector.mockImplementation((selector) =>
    selector(mockUseSelector(initialState))
  );
  require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('JoinRoomBlock Component', () => {
  it('renders loader initially', () => {
    render(
      <Provider store={store}>
        <Router>
          <JoinRoomBlock />
        </Router>
      </Provider>
    );

    expect(screen.getByText('TetrisLoader')).toBeInTheDocument();
  });

  it('renders TetrisLoader when loading is true', async () => {
    const setState = jest.fn(); // Mock setState function

    // Mock useState to return our mocked state and setState function
    jest
      .spyOn(React, 'useState')
      .mockImplementation((initialValue) => [initialValue, setState]);

    useSelector.mockReturnValueOnce([]); // Mocking initial empty room list
    render(
      <Provider store={store}>
        <Router>
          <JoinRoomBlock />
        </Router>
      </Provider>
    );

    // Ensure TetrisLoader is rendered initially
    expect(screen.getByText('TetrisLoader')).toBeInTheDocument();

    // Call the setState function to update the loading state to true
    //setState(true);

    // Ensure TetrisLoader with specific text is rendered when loading is true
    //expect(screen.getByText(text => text.includes('Joining the room in progress'))).toBeInTheDocument();
  });

  test('creates data object with correct properties and values', () => {
    // Define input parameters
    const roomName = 'test-room';
    const mode = 'solo';
    const admin = 'admin';
    const maxPlayers = 4;
    const players = 2;
    const adminSocketId = 'admin-socket-id';
    const state = true;

    // Call the function
    const data = createData(
      roomName,
      mode,
      admin,
      maxPlayers,
      players,
      adminSocketId,
      state
    );

    // Assert the properties and values of the returned data object
    expect(data).toEqual({
      roomName: 'test-room',
      mode: 'solo',
      admin: 'admin',
      details: '2 / 4',
      players: 2,
      maxPlayers: 4,
      adminSocketId: 'admin-socket-id',
      status: 'Playing'
    });
  });

  it('should dispatch listenSocketEvent update_rooms', async () => {
    render(
      <Provider store={store}>
        <Router>
          <JoinRoomBlock />
        </Router>
      </Provider>
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      listenSocketEvent({
        eventName: 'update_rooms',
        callback: expect.any(Function)
      })
    );
  });

  it('should emitSocketEvent "get_rooms_list"', () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <JoinRoomBlock />
        </Router>
      </Provider>
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      emitSocketEvent({
        eventName: 'get_rooms_list'
      })
    );

    unmount();

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'get_rooms_list',
        callback: null
      })
    );
  });
});

describe('checkAccess', () => {
  test('returns false if roomData is falsy', () => {
    const roomData = null;
    const socketId = 'socket-id';
    const access = checkAccess(roomData, socketId);
    expect(access).toBe(false);
  });

  test('returns false if room status is "Playing"', () => {
    const roomData = {
      status: 'Playing',
      mode: 'solo',
      adminSocketId: 'admin-socket-id'
    };
    const socketId = 'socket-id';
    const access = checkAccess(roomData, socketId);
    expect(access).toBe(false);
  });

  test('returns true if room mode is "solo" and socketId matches adminSocketId', () => {
    const roomData = {
      status: 'Pending',
      mode: 'solo',
      adminSocketId: 'admin-socket-id'
    };
    const socketId = 'admin-socket-id';
    const access = checkAccess(roomData, socketId);
    expect(access).toBe(true);
  });

  test('returns false if room mode is "solo" and socketId does not match adminSocketId', () => {
    const roomData = {
      status: 'Pending',
      mode: 'solo',
      adminSocketId: 'admin-socket-id'
    };
    const socketId = 'another-socket-id';
    const access = checkAccess(roomData, socketId);
    expect(access).toBe(false);
  });

  test('returns true if room mode is "competition" and maxPlayers is not reached', () => {
    const roomData = {
      status: 'Pending',
      mode: 'competition',
      maxPlayers: 4,
      players: 2
    };
    const socketId = 'socket-id';
    const access = checkAccess(roomData, socketId);
    expect(access).toBe(true);
  });

  test('returns false if room mode is "competition" and maxPlayers is reached', () => {
    const roomData = {
      status: 'Pending',
      mode: 'competition',
      maxPlayers: 2,
      players: 2
    };
    const socketId = 'socket-id';
    const access = checkAccess(roomData, socketId);
    expect(access).toBe(false);
  });

  test('returns false if room mode is "competition" and status is "Playing"', () => {
    const roomData = {
      status: 'Playing',
      mode: 'competition',
      maxPlayers: 4,
      players: 2
    };
    const socketId = 'socket-id';
    const access = checkAccess(roomData, socketId);
    expect(access).toBe(false);
  });
});

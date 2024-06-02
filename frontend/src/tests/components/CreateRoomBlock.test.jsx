import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';
import CreateRoomBlock from '../../components/Lobby/CreateRoomBlock';
import {
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';

jest.useFakeTimers();

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

describe('CreateRoomBlock Component', () => {
  test('renders without fail', () => {
    render(
      <Provider store={store}>
        <Router>
          <CreateRoomBlock />
        </Router>
      </Provider>
    );

    // Fast forward the timer to ensure loading state is false
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('create-room-block')).toBeInTheDocument();
  });

  it('should listen to room_already_exists', async () => {
    render(
      <Provider store={store}>
        <Router>
          <CreateRoomBlock />
        </Router>
      </Provider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      listenSocketEvent({
        eventName: 'room_already_exists',
        callback: expect.any(Function)
      })
    );
  });

  it('should dispatch stopListeningSocketEvent on cleanup', () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <CreateRoomBlock />
        </Router>
      </Provider>
    );

    // Fast forward the timer to ensure loading state is false
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    unmount();

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'room_already_exists',
        callback: null
      })
    );
  });

  it('should navigate on form submission', () => {
    render(<CreateRoomBlock />);

    const roomInput = screen.getByLabelText('Room name:');
    const createButton = screen.getByRole('button', { name: 'Create' });

    // Simulate change event on the input
    fireEvent.change(roomInput, { target: { value: 'TestRoom' } });

    // Simulate form submission
    fireEvent.click(createButton);

    // Assert that navigate function is called with the expected URL
    expect(mockNavigate).toHaveBeenCalledWith('/TestRoom/undefined');
  });
});

import { act, renderHook } from '@testing-library/react';
import { useGameStats } from '../../hooks/useGameStats';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';

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

describe('useGameStats hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should have corrrect initial game stats', () => {
    const mockDispatch = jest.fn();

    // Mock the useDispatch hook
    jest.mock('react-redux', () => ({
      ...jest.requireActual('react-redux'),
      useDispatch: jest.fn()
    }));

    // Mock the useDispatch hook to return the mockDispatch function
    require('react-redux').useDispatch.mockReturnValue(mockDispatch);

    const { result } = renderHook(
      () => useGameStats('competition', 'testRoom'),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider> // Wrap with Provider
        )
      }
    );

    // Ensure game stats are initiated correctly
    const [gameStats] = result.current;
    expect(gameStats).toEqual({
      level: 1,
      linesCompleted: 0,
      linesPerLevel: 10,
      points: 0
    });
  });

  test('should update game stats correctly', () => {
    const mockDispatch = jest.fn();

    // Mock the useDispatch hook to return the mockDispatch function
    require('react-redux').useDispatch.mockReturnValue(mockDispatch);

    const { result } = renderHook(
      () => useGameStats('competition', 'testRoom'),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider> // Wrap with Provider
        )
      }
    );

    // Destructure addLinesCleared function from the result
    const [, addLinesCleared] = result.current;

    // Call addLinesCleared function
    act(() => {
      addLinesCleared(2); // Simulate clearing 2 lines
    });

    // Ensure game stats are updated correctly
    const [gameStats] = result.current;
    expect(gameStats).toEqual({
      level: 1,
      linesCompleted: 2,
      linesPerLevel: 10,
      points: 200
    });
  });
});

import '@testing-library/jest-dom';
import { render, act, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import GameLayout from '../../components/Game/GameLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';
import {
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';
import { checkRoomPresence } from '../../utils/check-room-presence';
import { errorAlert } from '../../utils/alerts';

jest.useFakeTimers();

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
//jest.mock('../../components/UI/FloatingButton', () => () => (
//  <div>FloatingButton</div>
//));
jest.mock('../../components/UI/TetrisConfetti', () => () => (
  <div>TetrisConfetti</div>
));

jest.mock('../../utils/check-room-presence');

jest.mock('../../utils/alerts', () => ({
  errorAlert: jest.fn()
}));

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseSelector = (state) => state;

// Mock initial state
const initialState = {
  socket: {
    socket: { emit: jest.fn() }
  },
  user: {
    user: 'test-player'
  }
};

const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice
  },
  preloadedState: initialState
});

// Mock useState to set showConfetti to true
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockDispatch.mockClear(); // Reset the mock dispatch function
  require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  require('react-redux').useSelector.mockImplementation((selector) =>
    selector(mockUseSelector(initialState))
  );
  require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

  // Mock useState implementation
  let useStateMock = (initState) => [initState, jest.fn()];
  require('react').useState.mockImplementation((initState) => {
    if (initState === false) {
      return [true, jest.fn()]; // Mock showConfetti as true
    }
    return useStateMock(initState);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GameLayout', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );
  });

  it('stops listening to socket event on unmount', () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    unmount();

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'game_started',
        callback: null
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'new_tetrominoes',
        callback: null
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'join_denied',
        callback: null
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'update_room_data',
        callback: null
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'welcome_to_the_room',
        callback: null
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'game_start_error',
        callback: null
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      emitSocketEvent({
        eventName: 'leave_room',
        data: null
      })
    );
  });

  test('renders TetrisLoader on the 1st load', () => {
    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    // Fast forward the timer to ensure loading state is false
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('TetrisLoader')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('floating-button')).toBeInTheDocument();
  });

  test('do not shows error if player_name does not match nickname', async () => {
    const mockParams = { room: 'test-room', player_name: 'test-player' }; // Mocked params to match nickname

    checkRoomPresence.mockResolvedValue({ presence: true }); // Mock room presence check

    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    expect(errorAlert).not.toHaveBeenCalled(); // Ensure errorAlert is not called
    expect(mockNavigate).not.toHaveBeenCalled(); // Ensure mockNavigate is not called
  });

  //test('renders MagicButton when socketId matches admin socketId', async () => {
  //  // Mock initial state with socketId matching admin socketId
  //  const initialStateWithAdminSocketId = {
  //    ...initialState,
  //    socket: {
  //      socket: { emit: jest.fn(), id: 'admin-socket-id' } // Mock admin socketId
  //    },
  //    socket: {
  //      socket: { id: 'admin-socket-id' } // Set socketId to match admin socketId
  //    },
  //    user: {
  //      user: 'test-player'
  //    }
  //  };

  //  const storeWithAdminSocketId = configureStore({
  //    reducer: {
  //      user: userSlice,
  //      socket: socketSlice
  //    },
  //    preloadedState: initialStateWithAdminSocketId
  //  });

  //  render(
  //    <Provider store={storeWithAdminSocketId}>
  //      <Router>
  //        <GameLayout />
  //      </Router>
  //    </Provider>
  //  );

  //  // Wait for the MagicButton to appear
  //  await waitFor(() => {
  //    expect(screen.getByText('Start')).toBeInTheDocument();
  //  });
  //});

  //test('renders TetrisLoader when socketId does not match admin socketId', () => {
  //  // Mock initial state with socketId not matching admin socketId
  //  const initialStateWithoutAdminSocketId = {
  //    ...initialState,
  //    socket: {
  //      socket: { emit: jest.fn(), id: 'user-socket-id' } // Mock user socketId
  //    },
  //    socket: {
  //      socket: { id: 'user-socket-id' } // Set socketId to not match admin socketId
  //    },
  //    user: {
  //      user: 'test-player'
  //    }
  //  };

  //  const storeWithoutAdminSocketId = configureStore({
  //    reducer: {
  //      user: userSlice,
  //      socket: socketSlice
  //    },
  //    preloadedState: initialStateWithoutAdminSocketId
  //  });

  //  render(
  //    <Provider store={storeWithoutAdminSocketId}>
  //      <Router>
  //        <GameLayout />
  //      </Router>
  //    </Provider>
  //  );

  //  // Ensure TetrisLoader is rendered
  //  expect(screen.getByText('Awaiting the start')).toBeInTheDocument();
  //});
});

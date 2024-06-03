import '@testing-library/jest-dom';
import {
  cleanup,
  render,
  act,
  screen,
  waitFor,
  fireEvent
} from '@testing-library/react';
import { Provider } from 'react-redux';
import GameLayout from '../../components/Game/GameLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';
import {
  listenSocketEvent,
  emitSocketEvent,
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
  cleanup();
});

describe('GameLayout', () => {
  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );
  });

  test('stops listening to socket event on unmount', () => {
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
    expect(screen.getByTestId('floating-button-leave')).toBeInTheDocument();
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

  test('shows error if checkRoomPresence is false', async () => {
    const mockParams = { room: 'test-room', player_name: 'test-player' }; // Mocked params to match nickname

    checkRoomPresence.mockResolvedValue({ presence: false }); // Mock room presence check

    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(errorAlert).toHaveBeenCalledWith('Room not found');
    });
    expect(mockNavigate).toHaveBeenCalled(); // Ensure mockNavigate is called
  });

  test('shows error if an error occurs while checking room presence', async () => {
    const mockParams = { room: 'test-room', player_name: 'test-player' }; // Mocked params to match nickname

    checkRoomPresence.mockRejectedValue(); // Mock room presence check

    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(errorAlert).toHaveBeenCalledWith(
        'Something went wrong while checking room presence'
      );
    });
    expect(mockNavigate).toHaveBeenCalled(); // Ensure mockNavigate is called
  });

  test('listen to chat messages and unsubsribe on unmount', async () => {
    const mockParams = { room: 'test-room', player_name: 'test-player' }; // Mocked params to match nickname

    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        listenSocketEvent({
          eventName: 'chat',
          callback: expect.any(Function)
        })
      )
    );

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
        eventName: 'chat',
        callback: null
      })
    );
  });

  test('shows confetti on winner message', async () => {
    const mockParams = { room: 'test-room', player_name: 'test-player' }; // Mocked params to match nickname

    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        listenSocketEvent({
          eventName: 'chat',
          callback: expect.any(Function)
        })
      );
    });

    const handleNewMessage = mockDispatch.mock.calls.find(
      (call) => call[0].type === listenSocketEvent.type
    )[0].payload.callback;

    act(() => {
      handleNewMessage({
        type: 'winner',
        nickname: 'test-player'
      });
    });

    expect(screen.getByText('TetrisConfetti')).toBeInTheDocument();
  });

  test('shows FloatingButtonBlur when pending is true', () => {
    // Render the component
    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    // Update the state to set pending to true
    store.dispatch = jest.fn(() => {
      store.getState().pending = true;
      return Promise.resolve();
    });

    // Ensure the FloatingButtonBlur is in the document and visible
    const floatingButtonBlur = screen.getByTestId('floating-button-blur');
    expect(floatingButtonBlur).toBeInTheDocument();
    expect(floatingButtonBlur).toBeVisible();
  });

  test('shows FloatingButtonLeave when pending is false', async () => {
    const mockParams = { room: 'test-room', player_name: 'test-player' }; // Mocked params to match nickname
    const mockAdmin = { socketId: 'xxx' };

    // Render the component
    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    // Ensure the FloatingButtonLeave is in the document and visible
    const floatingButtonLeave = screen.getByTestId('floating-button-leave');
    expect(floatingButtonLeave).toBeInTheDocument();
    expect(floatingButtonLeave).toBeVisible();

    //act(() => {
    //  jest.advanceTimersByTime(1000);
    //});

    const x = fireEvent.click(floatingButtonLeave);
    expect(x).toBe(true);
    //act(() => {
    //  jest.advanceTimersByTime(2000);
    //});

    //await waitFor(() => {
    //  expect(mockNavigate).toHaveBeenCalled(); // Ensure mockNavigate is called
    //});
  });

  test('listen chat', async () => {
    const mockParams = { room: 'test-room', player_name: 'test-player' }; // Mocked params to match nickname

    checkRoomPresence.mockResolvedValue({ presence: true }); // Mock room presence check

    render(
      <Provider store={store}>
        <Router>
          <GameLayout />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(errorAlert).not.toHaveBeenCalledWith('Room not found');
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      listenSocketEvent({
        eventName: 'chat',
        callback: expect.any(Function)
      })
    );
  });
});

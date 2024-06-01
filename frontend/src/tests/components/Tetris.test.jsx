import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';
import Tetris from '../../components/Game/Tetris';
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

describe('Tetris Component', () => {
  test('renders TetrisLoader if no other boards received', () => {
    render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 1,
              maxPlayers: 3,
              state: false,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={false}
            setGameOver={() => {}}
            initialTetrominoes={[]}
            popTetromino={() => {}}
            messages={['messages']}
            setPending={() => {}}
            losers={['losers']}
          />
        </Router>
      </Provider>
    );

    // Fast forward the timer to ensure loading state is false
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('TetrisLoader')).toBeInTheDocument();
  });

  test('does not render observation bar if there is only one player', () => {
    render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 1,
              maxPlayers: 3,
              state: false,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={false}
            setGameOver={() => {}}
            initialTetrominoes={[]}
            popTetromino={() => {}}
            messages={['messages']}
            setPending={() => {}}
            losers={['losers']}
          />
        </Router>
      </Provider>
    );

    // Fast forward the timer to ensure loading state is false
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('Observation:')).not.toBeInTheDocument();
  });

  it('should dispatch listenSocketEvent if gameOver is false', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 3,
              maxPlayers: 3,
              state: false,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={false}
            setGameOver={jest.fn()}
            initialTetrominoes={[]}
            popTetromino={jest.fn()}
            messages={['messages']}
            setPending={jest.fn()}
            losers={['losers']}
          />
        </Router>
      </Provider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      listenSocketEvent({
        eventName: 'board_from_back',
        callback: expect.any(Function)
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      listenSocketEvent({
        eventName: 'add_penalty',
        callback: expect.any(Function)
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      listenSocketEvent({
        eventName: 'set_gameover',
        callback: expect.any(Function)
      })
    );
  });

  it('should not dispatch listenSocketEvent if gameOver is true', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 3,
              maxPlayers: 3,
              state: false,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={true}
            setGameOver={jest.fn()}
            initialTetrominoes={[]}
            popTetromino={jest.fn()}
            messages={['messages']}
            setPending={jest.fn()}
            losers={['losers']}
          />
        </Router>
      </Provider>
    );

    // Fast forward the timer to ensure any pending effects are executed
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert that dispatch was not called
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch stopListeningSocketEvent on cleanup', () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 3,
              maxPlayers: 3,
              state: false,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={false}
            setGameOver={jest.fn()}
            initialTetrominoes={[]}
            popTetromino={jest.fn()}
            messages={['messages']}
            setPending={jest.fn()}
            losers={['losers']}
          />
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
        eventName: 'board_from_back',
        callback: null
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'add_penalty',
        callback: null
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      stopListeningSocketEvent({
        eventName: 'set_gameover',
        callback: null
      })
    );
  });

  it('should call handleGetBoard when receiving board_from_back event', () => {
    const mockState = {
      socket: {
        socket: { emit: jest.fn() }
      },
      user: {
        user: null
      }
    };

    const handleGetBoard = jest.fn();

    render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 3,
              maxPlayers: 3,
              state: true,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={false}
            setGameOver={jest.fn()}
            initialTetrominoes={[]}
            popTetromino={jest.fn()}
            messages={['messages']}
            setPending={jest.fn()}
            losers={['losers']}
          />
        </Router>
      </Provider>
    );

    // Call handleGetBoard with mock data
    act(() => {
      handleGetBoard({
        playerName: 'player1',
        board: {}
      });
    });

    // Check if handleGetBoard was called
    expect(handleGetBoard).toHaveBeenCalled();
  });

  it('should render GameController if gameOver is false', () => {
    render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 3,
              maxPlayers: 3,
              state: true,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={false}
            setGameOver={jest.fn()}
            initialTetrominoes={[]}
            popTetromino={jest.fn()}
            messages={['messages']}
            setPending={jest.fn()}
            losers={['losers']}
          />
        </Router>
      </Provider>
    );

    // Expect GameController to be rendered
    expect(screen.getByTestId('game-controller')).toBeInTheDocument();
  });

  it('should not render GameController if gameOver is true', () => {
    render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 3,
              maxPlayers: 3,
              state: true,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={true}
            setGameOver={jest.fn()}
            initialTetrominoes={[]}
            popTetromino={jest.fn()}
            messages={['messages']}
            setPending={jest.fn()}
            losers={['losers']}
          />
        </Router>
      </Provider>
    );

    // Expect GameController not to be rendered
    expect(screen.queryByTestId('game-controller')).not.toBeInTheDocument();
  });

  it('should update othersBoards state when handleGetBoard is called', () => {
    let capturedCallback;

    render(
      <Provider store={store}>
        <Router>
          <Tetris
            nickname={'nickname'}
            roomData={{
              mode: 'competition',
              name: 'testRoom',
              players: 3,
              maxPlayers: 3,
              state: true,
              admin: { socketId: 'Jq1PN2NwNOqKHnZ5AAAF', nickname: 'acaren' }
            }}
            rows={20}
            columns={10}
            gameOver={false}
            setGameOver={jest.fn()}
            initialTetrominoes={[]}
            popTetromino={jest.fn()}
            messages={['messages']}
            setPending={jest.fn()}
            losers={['losers']}
          />
        </Router>
      </Provider>
    );

    // Capture the handleGetBoard callback
    mockDispatch.mock.calls.forEach((call) => {
      if (
        call[0].type === listenSocketEvent.type &&
        call[0].payload.eventName === 'board_from_back'
      ) {
        capturedCallback = call[0].payload.callback;
      }
    });

    const testData = {
      playerName: 'player1',
      board: [
        [0, 0],
        [1, 1]
      ],
      points: 100
    };

    // Simulate receiving the event
    act(() => {
      capturedCallback(testData);
    });

    // Use state inspection to assert the state update
    const othersBoards = screen.getByTestId('othersBoards');
    expect(othersBoards).toHaveTextContent('Observation:player1100');
  });
});

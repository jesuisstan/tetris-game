import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';
import Tetris from '../../components/Game/Tetris';

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

jest.mock('../../utils/alerts', () => ({
  errorAlert: jest.fn()
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
  require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  require('react-redux').useSelector.mockImplementation((selector) =>
    selector(mockUseSelector(initialState))
  );
  require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
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
});

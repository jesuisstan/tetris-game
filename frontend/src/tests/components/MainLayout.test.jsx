import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';
import MainLayout from '../../components/Layout/MainLayout';

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

jest.mock('../../components/Layout/Footer', () => () => <div>Footer</div>);
jest.mock('../../components/UI/TetrisLoader', () => () => (
  <div>TetrisLoader</div>
));
jest.mock('../../components/Layout/Menu', () => () => <div>Menu</div>);

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

describe('MainLayout Component', () => {
  test('renders initial loading state', () => {
    render(
      <Provider store={store}>
        <Router>
          <MainLayout />
        </Router>
      </Provider>
    );
    expect(screen.getByText('TetrisLoader')).toBeInTheDocument();
  });

  test('renders Menu form after loading', async () => {
    jest.useFakeTimers();
    render(
      <Provider store={store}>
        <Router>
          <MainLayout />
        </Router>
      </Provider>
    );

    // Fast forward the timer to ensure loading state is false
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() =>
      expect(screen.queryByText('TetrisLoader')).not.toBeInTheDocument()
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders Footer form after loading', async () => {
    jest.useFakeTimers();
    render(
      <Provider store={store}>
        <Router>
          <MainLayout />
        </Router>
      </Provider>
    );

    // Fast forward the timer to ensure loading state is false
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() =>
      expect(screen.queryByText('TetrisLoader')).not.toBeInTheDocument()
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});

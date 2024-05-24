import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import PleaseLogin from '../../components/Login/PleaseLogin';
import userSlice from '../../store/user-slice';
import socketSlice from '../../store/socket-slice';
import axios from 'axios';

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
jest.mock('axios');
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

jest.mock('../../components/Login/SignUpModal', () => () => (
  <div>SignUpModal</div>
));
jest.mock('../../components/UI/TetrisLoader', () => () => (
  <div>TetrisLoader</div>
));
jest.mock('../../components/UI/FormInput', () => (props) => (
  <input
    data-testid={props.name}
    type={props.type}
    name={props.name}
    value={props.value}
    onChange={props.onChange}
  />
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

describe('PleaseLogin Component', () => {
  test('renders initial loading state', () => {
    render(
      <Provider store={store}>
        <Router>
          <PleaseLogin />
        </Router>
      </Provider>
    );
    expect(screen.getByText('TetrisLoader')).toBeInTheDocument();
  });

  test('renders login form after loading', async () => {
    jest.useFakeTimers();
    render(
      <Provider store={store}>
        <Router>
          <PleaseLogin />
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
    expect(screen.getByText('Please login to continue')).toBeInTheDocument();
  });

  test('handles form input changes', async () => {
    jest.useFakeTimers();
    render(
      <Provider store={store}>
        <Router>
          <PleaseLogin />
        </Router>
      </Provider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() =>
      expect(screen.queryByText('TetrisLoader')).not.toBeInTheDocument()
    );

    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('Password123!');
  });

  test('handles form submission', async () => {
    axios.post.mockResolvedValue({ data: { user: 'testUser' } });
    jest.useFakeTimers();

    render(
      <Provider store={store}>
        <Router>
          <PleaseLogin />
        </Router>
      </Provider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() =>
      expect(screen.queryByText('TetrisLoader')).not.toBeInTheDocument()
    );

    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const form = screen.getByTestId('login-form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.submit(form);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/lobby'));
    expect(mockDispatch).toHaveBeenCalled();
    expect(initialState.socket.socket.emit).toHaveBeenCalledWith(
      'user_logged_in',
      { user: 'testUser' }
    );
  });

  test('displays error on failed login', async () => {
    axios.post.mockRejectedValue({
      response: { status: 409, data: { message: 'Conflict error' } }
    });
    const { errorAlert } = require('../../utils/alerts');
    jest.useFakeTimers();

    render(
      <Provider store={store}>
        <Router>
          <PleaseLogin />
        </Router>
      </Provider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() =>
      expect(screen.queryByText('TetrisLoader')).not.toBeInTheDocument()
    );

    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const form = screen.getByTestId('login-form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.submit(form);

    await waitFor(() =>
      expect(errorAlert).toHaveBeenCalledWith('Conflict error')
    );
  });
});

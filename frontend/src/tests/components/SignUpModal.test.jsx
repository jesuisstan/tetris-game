import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SignUpModal from '../../components/Login/SignUpModal';
import * as alerts from '../../utils/alerts';

const baseUrl = process.env.REACT_APP_BACKEND_URL || `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_BACKEND_PORT}`;

const mockAxios = new MockAdapter(axios);
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('@mui/lab/LoadingButton', () => (props) => {
  const { loading, children, ...rest } = props;
  return (
    <button {...rest} {...(loading ? { loading: 'true' } : {})}>
      {loading ? 'Loading...' : children}
    </button>
  );
});

jest.mock('@mui/joy/Modal', () => (props) => <div {...props} />);
jest.mock('@mui/joy/ModalDialog', () => (props) => <div {...props} />);
jest.mock('@mui/joy/ModalClose', () => (props) => (
  <button {...props}>Close</button>
));
jest.mock('@mui/material/Stack', () => (props) => <div {...props} />);
jest.mock('@mui/material/Typography', () => (props) => <div {...props} />);
jest.mock('../../components/UI/FormInput', () => (props) => (
  <input
    data-testid={props.name}
    type={props.type}
    name={props.name}
    value={props.value}
    onChange={props.onChange}
  />
));

jest.mock('../../utils/alerts', () => ({
  errorAlert: jest.fn(),
  saveAlert: jest.fn()
}));

const renderSignUpModal = (open, setOpen) => {
  return render(
    <Router>
      <SignUpModal open={open} setOpen={setOpen} />
    </Router>
  );
};

describe('SignUpModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the sign-up modal with all form inputs', () => {
    renderSignUpModal(true, jest.fn());

    expect(screen.getByText('Create new account')).toBeInTheDocument();
    expect(screen.getByTestId('firstName')).toBeInTheDocument();
    expect(screen.getByTestId('lastName')).toBeInTheDocument();
    expect(screen.getByTestId('nickname')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    renderSignUpModal(true, jest.fn());

    const firstNameInput = screen.getByTestId('firstName');
    const lastNameInput = screen.getByTestId('lastName');
    const nicknameInput = screen.getByTestId('nickname');
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(nicknameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(nicknameInput.value).toBe('johndoe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(passwordInput.value).toBe('Password123!');
  });

  test('handles form submission successfully', async () => {
    const setOpenMock = jest.fn();
    mockAxios.onPost(`${baseUrl}/api/auth/signup`).reply(200);

    renderSignUpModal(true, setOpenMock);

    const firstNameInput = screen.getByTestId('firstName');
    const lastNameInput = screen.getByTestId('lastName');
    const nicknameInput = screen.getByTestId('nickname');
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const signUpButton = screen.getByText('Sign Up');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(nicknameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.click(signUpButton);

    await waitFor(() => expect(setOpenMock).toHaveBeenCalledWith(false));
    expect(alerts.saveAlert).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('handles form submission error', async () => {
    const setOpenMock = jest.fn();
    mockAxios.onPost(`${baseUrl}/api/auth/signup`).reply(409, {
      message: 'User already exists'
    });

    renderSignUpModal(true, setOpenMock);

    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const signUpButton = screen.getByText('Sign Up');

    fireEvent.change(emailInput, {
      target: { value: 'existing.email@example.com' }
    });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.click(signUpButton);

    await waitFor(() =>
      expect(alerts.errorAlert).toHaveBeenCalledWith('User already exists')
    );
    expect(setOpenMock).toHaveBeenCalledWith(false);
  });

  test('handles form submission error 2', async () => {
    const setOpenMock = jest.fn();
    mockAxios.onPost(`${baseUrl}/api/auth/signup`).reply(404, {
      message: ''
    });

    renderSignUpModal(true, setOpenMock);

    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const signUpButton = screen.getByText('Sign Up');

    fireEvent.change(emailInput, {
      target: { value: 'existing.email@example.com' }
    });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.click(signUpButton);

    await waitFor(() =>
      expect(alerts.errorAlert).toHaveBeenCalledWith('Something went wrong')
    );
    expect(setOpenMock).toHaveBeenCalledWith(false);
  });
});

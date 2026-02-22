import axios from 'axios';
import { errorAlert } from './alerts';
import { initialUserState } from '../store/user-slice';

export const getCookieValue = (name, documentObj = document) => {
  const cookies = documentObj.cookie.split('; ');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');

    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_BACKEND_PORT}`;

export const getUserData = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/users/getuser`,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status !== 401) {
      errorAlert('Something went wrong while logging in');
    }
  }
};

export const logout = async () => {
  try {
    await axios.get(
      `${BACKEND_URL}/api/auth/logout`,
      {
        withCredentials: true
      }
    );
    return initialUserState;
  } catch (error) {
    errorAlert('Something went wrong while logging out');
  }
};

import axios from 'axios';
import errorAlert from './error-alert';
import { initialUserState } from '../store/user-slice';

export const getCookieValue = (name) => {
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');

    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

export const getUserData = async () => {
  try {
    const response = await axios.get(`/api/users/getuser`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status !== 401) {
      errorAlert('Something went wrong while logging in');
    }
  }
};

export const logout = async () => {
  try {
    await axios.get(`/api/auth/logout`, {
      withCredentials: true
    });
    return initialUserState;
  } catch (error) {
    errorAlert('Something went wrong while logging out');
  }
};

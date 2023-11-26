import axios from 'axios';
import errorAlert from './errorAlert';
import { setUser } from '../redux/actions/userActions';

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

//export const getUserData = async (
//  setUser
//) => {
//  try {
//    const response = await axios.get(`/api/users/getuser`, {
//      withCredentials: true
//    });
//    setUser(response.data);
//  } catch (error) {
//    if (error.response.status !== 401)
//      errorAlert('Something went wrong while logging in');
//  }
//};

//export const logout = async (
//  setUser
//) => {
//  const response = await axios.get(`/api/auth/logout`, {
//    withCredentials: true
//  });
//  setUser({ _id: '', nickname: '', email: '', firstName: '', lastName: '' });
//};

export const getUserData = async (dispatch) => {
  try {
    const response = await axios.get(`/api/users/getuser`, {
      withCredentials: true
    });
    dispatch(setUser(response.data)); // Dispatch setUser action with the fetched user data
  } catch (error) {
    if (error.response && error.response.status !== 401) {
      errorAlert('Something went wrong while logging in');
    }
  }
};

export const logout = async (dispatch) => {
  try {
    await axios.get(`/api/auth/logout`, {
      withCredentials: true
    });
    dispatch(setUser({ _id: '', nickname: '', email: '', firstName: '', lastName: '' })); // Dispatch setUser action to reset the user state
  } catch (error) {
    // Handle errors if needed
  }
};
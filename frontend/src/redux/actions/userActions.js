export const SET_USER = 'SET_USER';

export const setUser = (userData) => ({
  type: SET_USER,
  payload: userData,
});
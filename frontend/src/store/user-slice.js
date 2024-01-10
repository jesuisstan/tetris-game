import { createSlice } from '@reduxjs/toolkit';

export const initialUserState = {
  _id: '',
  nickname: '',
  email: '',
  firstName: '',
  lastName: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUser(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

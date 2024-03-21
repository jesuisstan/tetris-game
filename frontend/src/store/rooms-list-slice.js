import { createSlice } from '@reduxjs/toolkit';

export const initialRoomsListState = [];

const roomsListSlice = createSlice({
  name: 'roomsList',
  initialState: initialRoomsListState,
  reducers: {
    setRoomsList(state, action) {
      return action.payload; // Return the new state instead of mutating it
    }
  }
});

export const { setRoomsList } = roomsListSlice.actions;

export default roomsListSlice.reducer;

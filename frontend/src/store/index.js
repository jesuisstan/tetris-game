import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice';
import socketReducer from './socket-slice';

export default configureStore({
  reducer: {
    user: userReducer,
    sockets: socketReducer
  }
});

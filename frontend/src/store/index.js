import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice';
import socketReducer, { setSocket } from './socket-slice';

export default configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer
  },
  // to make Redux store non-serialized data (socket), use middleware ignorence (https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data):
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore socket actions and the socket instance
        ignoredActions: [setSocket.type],
        // Ignore the 'socket' field in actions and state
        ignoredActionPaths: ['payload.socket', 'payload.callback'],
        ignoredPaths: ['socket']
      }
    })
});

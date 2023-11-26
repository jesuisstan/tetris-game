import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userReducer';

const store = configureStore({
  reducer: {
    user: userReducer // assuming userReducer manages user-related state
    // Add other reducers if needed
  }
  // Add middleware or other configurations as needed
});

export default store;

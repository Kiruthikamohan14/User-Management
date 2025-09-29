import { combineReducers,configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/userSlice';

// Combine reducers into a rootReducer
const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer, // Make sure usersReducer is included here
});

// Create the store
const store = configureStore({
  reducer: rootReducer,
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
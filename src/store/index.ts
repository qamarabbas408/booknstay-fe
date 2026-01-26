import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './services/api';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // Standard slices
    auth: authReducer,
    // RTK Query api reducer
    [api.reducerPath]: api.reducer,
  },
  // Middleware is required for RTK Query to handle caching, invalidation, and polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
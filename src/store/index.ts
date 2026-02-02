import { configureStore,combineReducers } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './services/api';
import authReducer from './slices/authSlice';
import logger from 'redux-logger';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web


// 1. Combine all your reducers
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
})


// 2. Configure persistence
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // Only persist the auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);



// export const store = configureStore({
//   reducer: {
//     // Standard slices
//     auth: authReducer,
//     // RTK Query api reducer
//     [api.reducerPath]: api.reducer,
//   },
//   // Middleware is required for RTK Query to handle caching, invalidation, and polling
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware(({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     })).concat(api.middleware,logger),
// });

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions (they use non-serializable values)
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware,logger),
});

// setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
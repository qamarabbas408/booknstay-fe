import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../services/AuthApi';
import type { User } from '../services/AuthApi';


interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}


const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; access_token: string }>
    ) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null; 
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.token = payload.access_token;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.registerGuest.matchFulfilled, (state, { payload }) => {
        state.token = payload.access_token;
        state.user = payload.user;
        state.isAuthenticated = true;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;